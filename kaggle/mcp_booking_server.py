# File: mcp_booking_server.py
# MCP Server for Mindspace Escalation and Booking System

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mindspace_booking.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Psychologist(Base):
    __tablename__ = "psychologists"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TimeSlot(Base):
    __tablename__ = "time_slots"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    psychologist_id = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    psychologist_id = Column(String, nullable=False)
    time_slot_id = Column(Integer, nullable=False)
    status = Column(String, default="confirmed")  # confirmed, cancelled, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    appointment_time = Column(DateTime, nullable=False)

class EscalationLog(Base):
    __tablename__ = "escalation_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    distress_score = Column(Float, nullable=False)
    risk_level = Column(String)
    patterns_detected = Column(String)  # JSON string
    action_taken = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class SessionReport(Base):
    __tablename__ = "session_reports"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_id = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    psychologist_id = Column(String, nullable=False)
    session_date = Column(DateTime, nullable=False)
    report_content = Column(Text, nullable=False)  # Full report text
    remedies = Column(Text)  # JSON string of remedies/actions
    reminders = Column(Text)  # JSON string of reminders
    progress_notes = Column(Text)  # JSON string of progress tracking
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserEmail(Base):
    __tablename__ = "user_emails"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    email_address = Column(String, nullable=False)
    email_type = Column(String, nullable=False)  # booking_confirmation, journal_reminder, etc.
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="sent")  # sent, failed, pending

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models for API
class PsychologistCreate(BaseModel):
    name: str
    specialty: str
    email: Optional[str] = None
    phone: Optional[str] = None

class TimeSlotCreate(BaseModel):
    psychologist_id: str
    start_time: datetime
    end_time: datetime

class BookingCreate(BaseModel):
    user_id: str
    psychologist_id: str
    time_slot_id: int

class EscalationLogCreate(BaseModel):
    user_id: str
    reason: str
    distress_score: float
    risk_level: Optional[str] = None
    patterns_detected: Optional[List[str]] = None

class SessionReportCreate(BaseModel):
    booking_id: str
    user_id: str
    psychologist_id: str
    session_date: datetime
    report_content: str
    remedies: Optional[List[Dict]] = None  # List of {action, description, due_date}
    reminders: Optional[List[Dict]] = None  # List of {reminder_text, frequency}

class ProgressUpdate(BaseModel):
    report_id: int
    user_id: str
    progress_notes: Dict  # {remedy_id: {status, notes, completion_date}}

class EmailRequest(BaseModel):
    user_id: str
    email_address: str
    email_type: str  # booking_confirmation, journal_reminder, etc.
    subject: str
    body: str

# FastAPI app
app = FastAPI(title="Mindspace Booking MCP Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Email Service
def send_email(to_email: str, subject: str, body: str) -> bool:
    """
    Send email using SMTP. Configure via environment variables:
    - SMTP_HOST (default: smtp.gmail.com)
    - SMTP_PORT (default: 587)
    - SMTP_USER (email address)
    - SMTP_PASSWORD (app password)
    - EMAIL_FROM (sender email, defaults to SMTP_USER)
    """
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")
        email_from = os.getenv("EMAIL_FROM", smtp_user)
        
        if not smtp_user or not smtp_password:
            # If SMTP not configured, log and return False (for development)
            print(f"[EMAIL] Would send to {to_email}: {subject}")
            print(f"[EMAIL] Body: {body[:100]}...")
            return False
        
        msg = MIMEMultipart()
        msg['From'] = email_from
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email: {e}")
        return False

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Mindspace Booking MCP Server", "status": "running"}

@app.get("/psychologists", response_model=List[dict])
async def get_psychologists(specialty: Optional[str] = None, db: Session = Depends(get_db)):
    """Get available psychologists, optionally filtered by specialty."""
    query = db.query(Psychologist).filter(Psychologist.is_available == True)
    if specialty:
        query = query.filter(Psychologist.specialty.ilike(f"%{specialty}%"))
    psychologists = query.all()
    
    result = []
    for psy in psychologists:
        # Get available time slots
        slots = db.query(TimeSlot).filter(
            TimeSlot.psychologist_id == psy.id,
            TimeSlot.is_available == True,
            TimeSlot.start_time > datetime.utcnow()
        ).all()
        
        result.append({
            "id": psy.id,
            "name": psy.name,
            "specialty": psy.specialty,
            "email": psy.email,
            "phone": psy.phone,
            "available_slots": [
                {
                    "id": slot.id,
                    "start_time": slot.start_time.isoformat(),
                    "end_time": slot.end_time.isoformat()
                }
                for slot in slots[:10]  # Limit to 10 slots
            ]
        })
    return result

@app.post("/bookings")
async def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    """Create a new booking."""
    # Verify time slot is available
    time_slot = db.query(TimeSlot).filter(
        TimeSlot.id == booking.time_slot_id,
        TimeSlot.is_available == True
    ).first()
    
    if not time_slot:
        raise HTTPException(status_code=404, detail="Time slot not available")
    
    if time_slot.psychologist_id != booking.psychologist_id:
        raise HTTPException(status_code=400, detail="Time slot does not match psychologist")
    
    # Create booking
    booking_id = f"booking_{booking.user_id}_{booking.psychologist_id}_{datetime.utcnow().timestamp()}"
    new_booking = Booking(
        id=booking_id,
        user_id=booking.user_id,
        psychologist_id=booking.psychologist_id,
        time_slot_id=booking.time_slot_id,
        appointment_time=time_slot.start_time,
        status="confirmed"
    )
    
    # Mark time slot as unavailable
    time_slot.is_available = False
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # Get psychologist details for email
    psychologist = db.query(Psychologist).filter(Psychologist.id == booking.psychologist_id).first()
    
    # Send booking confirmation email (if user email is available)
    # Note: In production, user email should be stored in user profile
    # For now, we'll log it and the agent can trigger email separately
    
    return {
        "status": "success",
        "data": {
            "booking_id": booking_id,
            "psychologist_id": booking.psychologist_id,
            "psychologist_name": psychologist.name if psychologist else None,
            "appointment_time": time_slot.start_time.isoformat(),
            "message": "Booking confirmed successfully",
            "email_sent": False  # Will be sent via separate endpoint
        }
    }

@app.post("/escalations")
async def log_escalation(escalation: EscalationLogCreate, db: Session = Depends(get_db)):
    """Log an escalation event."""
    new_log = EscalationLog(
        user_id=escalation.user_id,
        reason=escalation.reason,
        distress_score=escalation.distress_score,
        risk_level=escalation.risk_level,
        patterns_detected=json.dumps(escalation.patterns_detected or []),
        action_taken="escalation_logged",
        timestamp=datetime.utcnow()
    )
    
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return {
        "status": "success",
        "data": {
            "log_id": new_log.id,
            "message": "Escalation logged successfully"
        }
    }

@app.get("/escalations/{user_id}")
async def get_user_escalations(user_id: str, db: Session = Depends(get_db)):
    """Get escalation history for a user."""
    logs = db.query(EscalationLog).filter(
        EscalationLog.user_id == user_id
    ).order_by(EscalationLog.timestamp.desc()).limit(50).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": log.id,
                "reason": log.reason,
                "distress_score": log.distress_score,
                "risk_level": log.risk_level,
                "patterns_detected": json.loads(log.patterns_detected) if log.patterns_detected else [],
                "timestamp": log.timestamp.isoformat()
            }
            for log in logs
        ]
    }

# Session Reports Endpoints
@app.post("/session-reports")
async def create_session_report(report: SessionReportCreate, db: Session = Depends(get_db)):
    """Create a session report after psychologist session."""
    new_report = SessionReport(
        booking_id=report.booking_id,
        user_id=report.user_id,
        psychologist_id=report.psychologist_id,
        session_date=report.session_date,
        report_content=report.report_content,
        remedies=json.dumps(report.remedies or []),
        reminders=json.dumps(report.reminders or []),
        progress_notes=json.dumps({})
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return {
        "status": "success",
        "data": {
            "report_id": new_report.id,
            "message": "Session report created successfully"
        }
    }

@app.get("/session-reports/{user_id}")
async def get_user_reports(user_id: str, db: Session = Depends(get_db)):
    """Get all session reports for a user."""
    reports = db.query(SessionReport).filter(
        SessionReport.user_id == user_id
    ).order_by(SessionReport.session_date.desc()).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": report.id,
                "booking_id": report.booking_id,
                "psychologist_id": report.psychologist_id,
                "session_date": report.session_date.isoformat(),
                "report_content": report.report_content,
                "remedies": json.loads(report.remedies) if report.remedies else [],
                "reminders": json.loads(report.reminders) if report.reminders else [],
                "progress_notes": json.loads(report.progress_notes) if report.progress_notes else {},
                "created_at": report.created_at.isoformat(),
                "updated_at": report.updated_at.isoformat()
            }
            for report in reports
        ]
    }

@app.get("/session-reports/{user_id}/active")
async def get_active_reports(user_id: str, db: Session = Depends(get_db)):
    """Get active reports (with pending remedies/reminders) for a user."""
    reports = db.query(SessionReport).filter(
        SessionReport.user_id == user_id
    ).order_by(SessionReport.session_date.desc()).all()
    
    active_reports = []
    for report in reports:
        remedies = json.loads(report.remedies) if report.remedies else []
        progress = json.loads(report.progress_notes) if report.progress_notes else {}
        
        # Filter for active remedies (not completed)
        active_remedies = [
            r for r in remedies 
            if str(r.get('id', '')) not in progress or 
            progress.get(str(r.get('id', '')), {}).get('status') != 'completed'
        ]
        
        if active_remedies or (report.reminders and json.loads(report.reminders)):
            active_reports.append({
                "id": report.id,
                "session_date": report.session_date.isoformat(),
                "remedies": active_remedies,
                "reminders": json.loads(report.reminders) if report.reminders else [],
                "progress_notes": progress
            })
    
    return {
        "status": "success",
        "data": active_reports
    }

@app.post("/session-reports/update-progress")
async def update_progress(progress: ProgressUpdate, db: Session = Depends(get_db)):
    """Update progress on remedies from session report."""
    report = db.query(SessionReport).filter(
        SessionReport.id == progress.report_id,
        SessionReport.user_id == progress.user_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Merge new progress with existing
    existing_progress = json.loads(report.progress_notes) if report.progress_notes else {}
    existing_progress.update(progress.progress_notes)
    
    report.progress_notes = json.dumps(existing_progress)
    report.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return {
        "status": "success",
        "data": {
            "message": "Progress updated successfully",
            "progress_notes": existing_progress
        }
    }

# Email Endpoints
@app.post("/send-email")
async def send_email_endpoint(email_req: EmailRequest, db: Session = Depends(get_db)):
    """Send an email and log it."""
    success = send_email(email_req.email_address, email_req.subject, email_req.body)
    
    # Log email
    email_log = UserEmail(
        user_id=email_req.user_id,
        email_address=email_req.email_address,
        email_type=email_req.email_type,
        subject=email_req.subject,
        body=email_req.body,
        status="sent" if success else "failed"
    )
    
    db.add(email_log)
    db.commit()
    
    return {
        "status": "success" if success else "partial",
        "data": {
            "email_sent": success,
            "message": "Email sent successfully" if success else "Email logged but not sent (SMTP not configured)"
        }
    }

@app.get("/emails/{user_id}")
async def get_user_emails(user_id: str, email_type: Optional[str] = None, db: Session = Depends(get_db)):
    """Get email history for a user."""
    query = db.query(UserEmail).filter(UserEmail.user_id == user_id)
    if email_type:
        query = query.filter(UserEmail.email_type == email_type)
    
    emails = query.order_by(UserEmail.sent_at.desc()).limit(50).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": email.id,
                "email_type": email.email_type,
                "subject": email.subject,
                "sent_at": email.sent_at.isoformat(),
                "status": email.status
            }
            for email in emails
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)


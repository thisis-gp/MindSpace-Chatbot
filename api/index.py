import os
import sys

from fastapi import FastAPI

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "Backend"))
from script import app as backend  # noqa: E402

# Vercel keeps the /api prefix in the request path, so mount the backend under it.
app = FastAPI()
app.mount("/api", backend)

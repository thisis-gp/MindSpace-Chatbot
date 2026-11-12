// Numbers verified against Government of India sources (MoHFW Tele-MANAS, MHA ERSS-112).
const CrisisNotice = ({ className = "" }) => (
  <p className={`text-xs text-gray-500 text-center leading-relaxed ${className}`}>
    MindSpace is an AI companion and is not a substitute for professional help.
    If you are in crisis, call Tele-MANAS on <strong>14416</strong> (free, 24x7)
    or the emergency number <strong>112</strong>.
  </p>
);

export default CrisisNotice;

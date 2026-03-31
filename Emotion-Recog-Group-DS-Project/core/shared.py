from core.engine import MultiModalAIPipeline
from core.webcam_engine import WebcamStream

# Global Singletons to avoid redundant loading & circular imports
ai = MultiModalAIPipeline()
webcam = WebcamStream(ai)

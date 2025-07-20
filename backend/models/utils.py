# utils/timezone.py
from datetime import datetime
import pytz

BRASIL_TZ = pytz.timezone("America/Sao_Paulo")

def agora_brasil():
    return datetime.now(BRASIL_TZ)
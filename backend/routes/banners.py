# routes/banners.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import shutil

router = APIRouter()

BANNERS_DIR = "uploads/banners"

os.makedirs(BANNERS_DIR, exist_ok=True)

@router.post("/banners")
async def upload_banner(file: UploadFile = File(...)):
    # print("CHEGOU UM UPLOAD:", file.filename)
    file_location = os.path.join(BANNERS_DIR, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "url": f"/uploads/banners/{file.filename}"}

@router.get("/banners")
async def list_banners():
    files = os.listdir(BANNERS_DIR)
    # Gera o URL de cada banner
    banners = [f"/uploads/banners/{fname}" for fname in files if not fname.startswith('.')]
    return banners

@router.delete("/banners/{filename}")
async def delete_banner(filename: str):
    file_path = os.path.join(BANNERS_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"status": "deleted"}
    else:
        raise HTTPException(status_code=404, detail="Banner não encontrado")

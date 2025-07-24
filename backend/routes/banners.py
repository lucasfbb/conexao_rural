# routes/banners.py
import cloudinary.api
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import shutil
from cloudinary_utils import cloudinary,spitIt
import cloudinary.uploader

router = APIRouter()

BANNERS_DIR = "uploads/banners"

os.makedirs(BANNERS_DIR, exist_ok=True)

@router.post("/banners")
async def upload_banner(file: UploadFile = File(...)):
    # print("CHEGOU UM UPLOAD:", file.filename)
    contents = await file.read()
    upload_result = cloudinary.uploader.upload(contents, resource_type="image", folder="conexaorural/banners")
    return {"public_id": upload_result.get("public_id"), "url": upload_result["secure_url"]}

@router.get("/banners")
async def list_banners():
    try:
        response = cloudinary.api.resources(
            type="upload",
            prefix="conexaorural/banners/",  # Folder name
            resource_type="image"
        )
        # Each resource has a 'secure_url' and 'public_id'
        banners = [
            {"id":res["public_id"],"url":res["secure_url"]}
            for res in response.get("resources", [])
        ]
        print(banners)
        return banners
    except Exception as e:
        return {"error": str(e)}

@router.delete("/banners/{public_id}")
async def delete_banner(public_id: str):
    print(public_id)
    try:
        result = cloudinary.uploader.destroy("conexaorural/banners/"+public_id, resource_type="image")
        if result.get("result") == "ok":
            return {"status": "deleted"}
        else:
            raise HTTPException(status_code=404, detail="Banner não encontrado no Cloudinary")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

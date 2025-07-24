import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)
def spitIt():
    print(os.getenv("CLOUDINARY_CLOUD_NAME"), os.getenv("CLOUDINARY_API_KEY"), os.getenv("CLOUDINARY_API_SECRET"))

def upload_image_to_cloudinary(file_path: str):
    try:
        response = cloudinary.uploader.upload(file_path)
        return response["secure_url"]
    except Exception as e:
        print("Erro no upload:", e)
        return None

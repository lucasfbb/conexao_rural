import os
from auth.auth_utils import get_current_user
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import shutil
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor
from schemas.produtor import ProdutorOut, ProdutorUpdate

router = APIRouter()

UPLOAD_BANNERS_DIR = "uploads/bannerProdutor"
UPLOAD_PERFIS_DIR = "uploads/perfilProdutor"
os.makedirs(UPLOAD_BANNERS_DIR, exist_ok=True)
os.makedirs(UPLOAD_PERFIS_DIR, exist_ok=True)

@router.get("/produtores/me", response_model=ProdutorOut)
def get_me_produtor(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    produtor = db.query(Produtor).filter(Produtor.cpf_cnpj == current_user.cpf_cnpj).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")
    # Evita erro de campo faltando:
    return ProdutorOut(
        nome=produtor.nome,
        endereco=produtor.endereco,
        categoria=produtor.categoria,
        foto=produtor.foto,
        banner=produtor.banner,
        distancia=None,  # ou calcule se quiser
        email=current_user.email,
        telefone_1=current_user.telefone_1,
        telefone_2=current_user.telefone_2,
    )

@router.patch("/produtores/me", response_model=ProdutorOut)
def update_me_produtor(
    update: ProdutorUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    produtor = db.query(Produtor).filter(Produtor.cpf_cnpj == current_user.cpf_cnpj).first()
    usuario = db.query(Usuario).filter(Usuario.cpf_cnpj == current_user.cpf_cnpj).first()
    if not produtor or not usuario:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    # Se veio algum campo que é do usuário, atualiza também
    campos_usuario = ['email', 'telefone_1', 'telefone_2']
    for key, value in update.dict(exclude_unset=True).items():
        if hasattr(produtor, key):
            setattr(produtor, key, value)
        if key in campos_usuario and hasattr(usuario, key):
            setattr(usuario, key, value)

    db.commit()
    db.refresh(produtor)
    db.refresh(usuario)
    return ProdutorOut(
        nome=produtor.nome,
        endereco=produtor.endereco,
        categoria=produtor.categoria,
        foto=produtor.foto,
        banner=produtor.banner,
        distancia=None,
        email=usuario.email,
        telefone_1=usuario.telefone_1,
        telefone_2=usuario.telefone_2,
    )

@router.post("/produtores/banner/upload")
async def upload_banner(
    file: UploadFile = File(...),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):  
    print("==> RECEBIDO UPLOAD FOTO", file.filename, file.content_type)
    ext = file.filename.split('.')[-1]
    filename = f"banner_{current_user.cpf_cnpj}.{ext}"
    file_path = os.path.join(UPLOAD_BANNERS_DIR, filename)
    print("==> Salvando em", file_path)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    produtor = db.query(Produtor).filter(Produtor.cpf_cnpj == current_user.cpf_cnpj).first()
    if produtor:
        produtor.banner = f"/uploads/bannerProdutor/{filename}"
        db.commit()
        db.refresh(produtor)
    return {"banner": f"/uploads/bannerProdutor/{filename}"}

@router.post("/produtores/foto/upload")
async def upload_foto(
    file: UploadFile = File(...),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("==> RECEBIDO UPLOAD FOTO", file.filename, file.content_type)
    ext = file.filename.split('.')[-1]
    filename = f"foto_{current_user.cpf_cnpj}.{ext}"
    file_path = os.path.join(UPLOAD_PERFIS_DIR, filename)

    # Tenta deletar o arquivo anterior, se existir
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Não foi possível remover a foto anterior: {e}")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        produtor = db.query(Produtor).filter(Produtor.cpf_cnpj == current_user.cpf_cnpj).first()
        if produtor:
            produtor.foto = f"/uploads/perfilProdutor/{filename}"
            db.commit()
            db.refresh(produtor)
        return {"foto": f"/uploads/perfilProdutor/{filename}"}
    except Exception as e:
        print("ERRO AO SALVAR FOTO:", e)
        raise HTTPException(status_code=500, detail="Erro ao salvar a foto")
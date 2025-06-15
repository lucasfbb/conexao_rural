import os
import time
from auth.auth_utils import get_current_user
from schemas.produto import ProdutoOut
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import shutil
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor
from models.produto import Produto
from models.listagem import Listagem
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
    filename = f"banner_{current_user.cpf_cnpj}_{int(time.time())}.{ext}"
    file_path = os.path.join(UPLOAD_BANNERS_DIR, filename)
    print("==> Salvando em", file_path)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    produtor = db.query(Produtor).filter(Produtor.cpf_cnpj == current_user.cpf_cnpj).first()
    if produtor:

        if produtor.banner and os.path.exists(produtor.banner[1:]):  # Remove a barra inicial
            try:
                os.remove(produtor.banner[1:])
            except Exception:
                pass

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
    filename = f"foto_{current_user.cpf_cnpj}_{int(time.time())}.{ext}"
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
            if produtor.foto and os.path.exists(produtor.foto[1:]):  # Remove a barra inicial
                try:
                    os.remove(produtor.foto[1:])
                except Exception:
                    pass

            produtor.foto = f"/uploads/fotoProdutor/{filename}"
            db.commit()
            db.refresh(produtor)

            # atualizando o caminho da nova foto no banco
            produtor.foto = f"/uploads/perfilProdutor/{filename}"
            db.commit()
            db.refresh(produtor)
        return {"foto": f"/uploads/perfilProdutor/{filename}"}
    except Exception as e:
        print("ERRO AO SALVAR FOTO:", e)
        raise HTTPException(status_code=500, detail="Erro ao salvar a foto")
    
@router.get("/produtores/{cpf_cnpj}", response_model=ProdutorOut)
def detalhes_produtor(cpf_cnpj: str, db: Session = Depends(get_db)):
    produtor = db.query(Produtor).filter(Produtor.cpf_cnpj == cpf_cnpj).first()
    usuario = db.query(Usuario).filter(Usuario.cpf_cnpj == cpf_cnpj).first()

    if not produtor or not usuario:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    return ProdutorOut(
        cpf_cnpj=usuario.cpf_cnpj,
        nome=produtor.nome,
        endereco=produtor.endereco,
        categoria=produtor.categoria,
        banner=produtor.banner,
        foto=produtor.foto,
        distancia=None  # ou calcule se quiser!
    )

@router.get("/produtores/{cpf_cnpj}/produtos", response_model=list[ProdutoOut])
def listar_produtos_produtor(cpf_cnpj: str, db: Session = Depends(get_db)):
    listagens = (
        db.query(Listagem)
        .join(Produto, Listagem.produto_id == Produto.id)
        .filter(Listagem.produtor_cpf_cnpj == cpf_cnpj)
        .all()
    )
    # Para cada listagem, pegue o produto e adicione info de preço e estoque!
    produtos = []
    for listagem in listagens:
        produto = listagem.produto
        produto_dict = ProdutoOut.from_orm(produto).dict()
        produto_dict["preco"] = listagem.preco
        produto_dict["estoque"] = listagem.estoque
        produtos.append(produto_dict)
    print("==> PRODUTOS DO PRODUTOR", cpf_cnpj, ":", produtos)
    return produtos
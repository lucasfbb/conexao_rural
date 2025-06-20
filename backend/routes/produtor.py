import os
import time
from typing import Optional
from auth.auth_utils import get_current_user
from schemas.listagem import ListagemCreate
from schemas.produto import ProdutoEstoqueOut, ProdutoOut
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
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
FOTO_PRODUTO_DIR = "uploads/fotoProduto"
os.makedirs(UPLOAD_BANNERS_DIR, exist_ok=True)
os.makedirs(UPLOAD_PERFIS_DIR, exist_ok=True)
os.makedirs(FOTO_PRODUTO_DIR, exist_ok=True)

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
        cpf_cnpj=current_user.cpf_cnpj,
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

# @router.get("/produtores/{cpf_cnpj}/produtos", response_model=list[ProdutoOut])
# def listar_produtos_produtor(cpf_cnpj: str, db: Session = Depends(get_db)):
#     listagens = (
#         db.query(Listagem)
#         .join(Produto, Listagem.produto_id == Produto.id)
#         .filter(Listagem.produtor_cpf_cnpj == cpf_cnpj)
#         .all()
#     )
#     # Para cada listagem, pegue o produto e adicione info de preço e estoque!
#     produtos = []
#     for listagem in listagens:
#         produto = listagem.produto
#         produto_dict = ProdutoOut.from_orm(produto).dict()
#         produto_dict["preco"] = listagem.preco
#         produto_dict["estoque"] = listagem.estoque
#         produtos.append(produto_dict)
#     print("==> PRODUTOS DO PRODUTOR", cpf_cnpj, ":", produtos)
#     return produtos

@router.get("/produtores/{cpf_cnpj}/produtos", response_model=list[ProdutoEstoqueOut])
def listar_produtos_produtor(cpf_cnpj: str, db: Session = Depends(get_db)):
    listagens = (
        db.query(Listagem)
        .join(Produto, Listagem.produto_id == Produto.id)
        .filter(Listagem.produtor_cpf_cnpj == cpf_cnpj)
        .all()
    )
    
    produtos = []
    for listagem in listagens:
        produto = listagem.produto
        produtos.append({
            "id": produto.id,
            "listagem_id": listagem.id,
            "nome": produto.nome,
            "nome_personalizado": listagem.nome_personalizado if listagem.nome_personalizado else produto.nome,
            "preco": float(listagem.preco),
            "estoque": listagem.estoque,
            "unidade": listagem.unidade,
            "descricao": listagem.descricao,
            "preco_promocional": float(listagem.preco_promocional) if listagem.preco_promocional else None,
            "foto": listagem.foto if hasattr(listagem, "foto") else produto.foto if hasattr(produto, "foto") else None,
        })
    
    # print("==> PRODUTOS DO PRODUTOR", cpf_cnpj, ":", produtos)
    return produtos

@router.post("/produtores/produtos/adicionar")
async def adicionar_produto(
    nome: str = Form(...),  # Nome para busca no catálogo e exibição personalizada
    preco: float = Form(...),
    quantidade: int = Form(...),
    unidade: str = Form(...),
    descricao: str = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Procura produto existente no catálogo (ignora maiúscula/minúscula)
    produto_existente = db.query(Produto).filter(Produto.nome.ilike(nome.strip())).first()
    if not produto_existente:
        # Em produção, só admin pode criar produto novo!
        produto_existente = Produto(nome=nome.strip())
        db.add(produto_existente)
        db.commit()
        db.refresh(produto_existente)
    
    # 2. Salvar imagem SE enviada
    foto_url = None
    if file is not None:
        ext = file.filename.split('.')[-1]
        filename = f"produto_{current_user.cpf_cnpj}_{int(time.time())}.{ext}"
        file_path = os.path.join(FOTO_PRODUTO_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        foto_url = f"/uploads/fotoProduto/{filename}"

    # 3. Cria a Listagem, agora usando nome_personalizado
    listagem_existente = db.query(Listagem).filter(
        Listagem.produto_id == produto_existente.id,
        Listagem.produtor_cpf_cnpj == current_user.cpf_cnpj
    ).first()
    if listagem_existente:
        raise HTTPException(status_code=400, detail="Este produto já está no estoque do produtor")
    
    listagem = Listagem(
        produto_id=produto_existente.id,
        preco=preco,
        nome_personalizado=nome.strip(),   # <--- Aqui você personaliza!
        estoque=quantidade,
        produtor_cpf_cnpj=current_user.cpf_cnpj,
        unidade=unidade,
        descricao=descricao,
        foto=foto_url
    )
    db.add(listagem)
    db.commit()
    db.refresh(listagem)
    return {
        "message": "Produto adicionado com sucesso!",
        "produto_id": produto_existente.id,
        "foto": foto_url,
        "nome": nome.strip()
    }

@router.delete("/produtores/produtos/remover/{listagem_id}", status_code=204)
def remover_listagem_produto(listagem_id: int, db: Session = Depends(get_db)):
    listagem = db.query(Listagem).filter(Listagem.id == listagem_id).first()
    if not listagem:
        raise HTTPException(status_code=404, detail="Produto não encontrado na listagem do produtor")
    db.delete(listagem)
    db.commit()
    return {"message": "Produto removido com sucesso!"}

@router.patch("/produtores/produtos/editar/{listagem_id}")
async def editar_produto(
    listagem_id: int,
    nome: Optional[str] = Form(None),
    preco: Optional[float] = Form(None),
    quantidade: Optional[float] = Form(None),
    unidade: Optional[str] = Form(None),
    descricao: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    listagem = db.query(Listagem).filter_by(id=listagem_id).first()
    if not listagem:
        print("Produto não encontrado!")
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    produto = listagem.produto

    # Só altera o nome_personalizado do estoque do produtor!
    if nome is not None:
        listagem.nome_personalizado = nome.strip()
        
    if descricao is not None:
        listagem.descricao = descricao
    
    if file:
        filename = f"produto_{listagem.id}_{file.filename}"
        full_path = os.path.join("uploads/fotoProduto", filename)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as buffer:
            buffer.write(await file.read())
        listagem.foto = f"/uploads/fotoProduto/{filename}"
    else:
        print("Nenhuma imagem enviada")

    if preco is not None:
        listagem.preco = preco
    if quantidade is not None:
        listagem.estoque = quantidade
    if unidade is not None:
        listagem.unidade = unidade

    db.commit()
    db.refresh(listagem)
    return {
        "message": "Produto atualizado com sucesso",
        "foto": listagem.foto,
        "nome": listagem.nome_personalizado,  # Retorna o nome personalizado
        "preco": listagem.preco,
        "quantidade": listagem.estoque,
        "unidade": listagem.unidade,
        "descricao": listagem.descricao
    }
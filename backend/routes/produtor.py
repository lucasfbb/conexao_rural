import os
import time
from typing import Optional
from auth.auth_utils import get_current_user
from models.endereco import Endereco
from models.item_pedido import ItemPedido
from models.pedido import Pedido
from schemas.pedido import PedidoCreate
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
    produtor = db.query(Produtor).filter(Produtor.usuario_id == current_user.id).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")
    # Evita erro de campo faltando:
    return ProdutorOut(
        usuario_id=current_user.id,
        cpf_cnpj=current_user.cpf_cnpj,
        nome=produtor.nome,
        endereco=produtor.endereco,
        rua=produtor.rua,
        numero=produtor.numero,
        complemento=produtor.complemento,
        bairro=produtor.bairro,
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
    produtor = db.query(Produtor).filter(Produtor.usuario_id == current_user.id).first()
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
        rua=produtor.rua,
        numero=produtor.numero,
        complemento=produtor.complemento,
        bairro=produtor.bairro,
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
    filename = f"banner_{current_user.id}_{int(time.time())}.{ext}"
    file_path = os.path.join(UPLOAD_BANNERS_DIR, filename)
    print("==> Salvando em", file_path)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    produtor = db.query(Produtor).filter(Produtor.usuario_id == current_user.id).first()
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
    filename = f"foto_{current_user.id}_{int(time.time())}.{ext}"
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
        produtor = db.query(Produtor).filter(Produtor.usuario_id == current_user.id).first()
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
    
@router.get("/produtores/{usuario_id}", response_model=ProdutorOut)
def detalhes_produtor(usuario_id: int, db: Session = Depends(get_db)):
    produtor = db.query(Produtor).filter(Produtor.usuario_id == usuario_id).first()
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    print(produtor.id)

    if not produtor or not usuario:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    return ProdutorOut(
        id=produtor.id,
        usuario_id=usuario.id,
        cpf_cnpj=usuario.cpf_cnpj,
        nome=produtor.nome,
        endereco=produtor.endereco,
        rua=produtor.rua,
        numero=produtor.numero,
        complemento=produtor.complemento,
        bairro=produtor.bairro,
        categoria=produtor.categoria,
        banner=produtor.banner,
        foto=produtor.foto,
        distancia=None  # ou calcule se quiser!
    )

@router.get("/produtores/perto")
async def listar_produtores_perto(
    lat: float,
    lng: float,
    raio_km: float = 10,
    exclude_usuario_id: int = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Produtor)
    # Filtro de localização e outros...
    if exclude_usuario_id:
        query = query.filter(Produtor.usuario_id != exclude_usuario_id)
    query = query.offset(offset).limit(limit)
    return query.all()

@router.get("/produtores/{usuario_id}/produtos", response_model=list[ProdutoEstoqueOut])
def listar_produtos_produtor(usuario_id: int, db: Session = Depends(get_db)):
    produtor = db.query(Produtor).filter(Produtor.usuario_id == usuario_id).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    listagens = db.query(Listagem).filter(Listagem.produtor_id == produtor.id).all()

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
    nome: str = Form(...),
    preco: float = Form(...),
    preco_promocional: Optional[float] = Form(None),
    quantidade: int = Form(...),
    unidade: str = Form(...),
    descricao: str = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Busca o produtor pelo usuario_id
    produtor = db.query(Produtor).filter_by(usuario_id=current_user.id).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    # 2. Procura produto existente no catálogo
    produto_existente = db.query(Produto).filter(Produto.nome.ilike(nome.strip())).first()
    if not produto_existente:
        produto_existente = Produto(nome=nome.strip())
        db.add(produto_existente)
        db.commit()
        db.refresh(produto_existente)
    
    # 3. Salvar imagem, se enviada
    foto_url = None
    if file is not None:
        ext = file.filename.split('.')[-1]
        filename = f"produto_{current_user.id}_{int(time.time())}.{ext}"
        file_path = os.path.join(FOTO_PRODUTO_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        foto_url = f"/uploads/fotoProduto/{filename}"

    # 4. Verifica se esse produto já foi listado por esse produtor
    listagem_existente = db.query(Listagem).filter(
        Listagem.produto_id == produto_existente.id,
        Listagem.produtor_id == produtor.id
    ).first()
    if listagem_existente:
        raise HTTPException(status_code=400, detail="Este produto já está no estoque do produtor")

    # 5. Cria a listagem
    listagem = Listagem(
        produto_id=produto_existente.id,
        preco=preco,
        preco_promocional=preco_promocional,
        nome_personalizado=nome.strip(),
        estoque=quantidade,
        produtor_id=produtor.id,
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
    preco_promocional: Optional[float] = Form(None),
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
    if preco_promocional is not None:
        listagem.preco_promocional = preco_promocional
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

# @router.post("/produtores/novo-pedido")
# def criar_pedido_sem_pagamento(
#     pedido: PedidoCreate,
#     db: Session = Depends(get_db),
#     current_user: Usuario = Depends(get_current_user)
# ):
#     endereco = db.query(Endereco).filter_by(id=pedido.id_endereco, usuario_id=current_user.id).first()
#     if not endereco:
#         raise HTTPException(404, detail="Endereço não encontrado.")

#     pedidos_por_produtor = {}

#     for item in pedido.itens:
#         listagem = db.query(Listagem).filter_by(id=item.id_listagem).first()
#         if not listagem:
#             raise HTTPException(404, detail=f"Listagem com id {item.id_listagem} não encontrada.")
        
#         produtor_id = listagem.produtor_id
#         if produtor_id not in pedidos_por_produtor:
#             pedidos_por_produtor[produtor_id] = []
        
#         pedidos_por_produtor[produtor_id].append((listagem, item))

#     for produtor_id, lista in pedidos_por_produtor.items():
#         pedido_db = Pedido(
#             quantidade=sum(item.quantidade for _, item in lista),
#             valor=sum(float(l.preco) * i.quantidade for l, i in lista),
#             status="confirmado",  # ← Aqui está o status inicial
#             usuario_id=current_user.id,
#             id_endereco=endereco.id,
#             group_hash=pedido.group_hash
#         )
#         db.add(pedido_db)
#         db.flush()

#         for listagem, item in lista:
#             item_pedido = ItemPedido(
#                 pedido_id=pedido_db.id,
#                 produto_id=listagem.produto_id,
#                 nome_personalizado=listagem.nome_personalizado,
#                 listagem_id=listagem.id,
#                 quantidade=item.quantidade,
#                 valor_unitario=float(listagem.preco)
#             )
#             db.add(item_pedido)

#     db.commit()

#     return {
#         "mensagem": "Pedido registrado com sucesso!",
#         "group_hash": pedido.group_hash
#     }
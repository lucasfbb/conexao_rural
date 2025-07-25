import json
import os
from pathlib import Path
import time
import httpx
import shutil
from typing import Optional
from models.utils import reconhecer_alimento_clarifai
from schemas.endereco import EnderecoInput
from auth.auth_utils import get_current_user
from models.endereco import Endereco
from models.item_pedido import ItemPedido
from models.pedido import Pedido
from schemas.pedido import PedidoCreate
from schemas.listagem import ListagemCreate
from schemas.produto import ProdutoEstoqueOut, ProdutoOut
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor
from models.produto import Produto
from models.listagem import Listagem
from schemas.produtor import ProdutorOut, ProdutorUpdate
from cloudinary_utils import cloudinary
import cloudinary.uploader

router = APIRouter()

TRADUCOES = json.loads(Path("alimentos_traduzidos.json").read_text(encoding="utf-8"))

UPLOAD_BANNERS_DIR = "uploads/bannerProdutor"
UPLOAD_PERFIS_DIR = "uploads/perfilProdutor"
FOTO_PRODUTO_DIR = "uploads/fotoProduto"
os.makedirs(UPLOAD_BANNERS_DIR, exist_ok=True)
os.makedirs(UPLOAD_PERFIS_DIR, exist_ok=True)
os.makedirs(FOTO_PRODUTO_DIR, exist_ok=True)

async def geocode_endereco(endereco_texto: str) -> dict | None:
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "format": "json",
            "q": endereco_texto
        }
        headers = {
            "User-Agent": "conexao-rural-app"  # obrigatório pelo Nominatim
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers)

        response.raise_for_status()
        data = response.json()

        if data:
            return {
                "latitude": float(data[0]["lat"]),
                "longitude": float(data[0]["lon"])
            }

        return None

    except Exception as e:
        print("Erro ao geocodificar endereço:", e)
        return None

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
    imagem_url: Optional[str] = Form(None),  # 👈 novo campo
    file: Optional[UploadFile] = File(None),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Busca o produtor
    produtor = db.query(Produtor).filter_by(usuario_id=current_user.id).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    # 2. Produto global
    produto_existente = db.query(Produto).filter(Produto.nome.ilike(nome.strip())).first()
    if not produto_existente:
        produto_existente = Produto(nome=nome.strip())
        db.add(produto_existente)
        db.commit()
        db.refresh(produto_existente)
    
    # 3. Foto
    foto_url = None
    foto_id = None

    if imagem_url and imagem_url.startswith("https://res.cloudinary.com/"):
        # Reutiliza imagem já hospedada
        foto_url = imagem_url
        foto_id = imagem_url.split("/")[-1].split(".")[0]  # pega nome da imagem sem extensão
    elif file is not None:
        contents = await file.read()
        upload_result = cloudinary.uploader.upload(contents, resource_type="image", folder="conexaorural/fotoProduto")
        foto_url = upload_result["secure_url"]
        foto_id = upload_result["public_id"].split("/")[-1]

    # 4. Verifica duplicidade
    listagem_existente = db.query(Listagem).filter(
        Listagem.produto_id == produto_existente.id,
        Listagem.produtor_id == produtor.id
    ).first()
    if listagem_existente:
        raise HTTPException(status_code=400, detail="Este produto já está no estoque do produtor")

    # 5. Cria listagem
    listagem = Listagem(
        produto_id=produto_existente.id,
        preco=preco,
        preco_promocional=preco_promocional,
        nome_personalizado=nome.strip(),
        estoque=quantidade,
        produtor_id=produtor.id,
        unidade=unidade,
        descricao=descricao,
        foto=foto_url,
        foto_id=foto_id,
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
async def remover_listagem_produto(listagem_id: int, db: Session = Depends(get_db)):
    listagem = db.query(Listagem).filter(Listagem.id == listagem_id).first()
    if not listagem:
        raise HTTPException(status_code=404, detail="Produto não encontrado na listagem do produtor")
    
    # try:
    #     result = cloudinary.uploader.destroy("conexaorural/fotoProduto/"+listagem.foto_id, resource_type="image",invalidate=True)
    #     if result.get("result") == "ok":
    #         print("Foto removida com sucesso do Cloudinary")
    #     else:
    #         raise HTTPException(status_code=404, detail="foto não encontrado no Cloudinary")
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

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
    imagem_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    listagem = db.query(Listagem).filter_by(id=listagem_id).first()
    if not listagem:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    if nome is not None:
        listagem.nome_personalizado = nome.strip()

    if descricao is not None:
        listagem.descricao = descricao

    if file:
        # Upload de imagem nova com `file`
        contents = await file.read()
        upload_result = cloudinary.uploader.upload(
            contents,
            resource_type="image",
            folder="conexaorural/fotoProduto",
            public_id=f"conexaorural/fotoProduto/{listagem.foto_id}",
            overwrite=True
        )
        listagem.foto_id = upload_result.get("public_id").split("/")[-1]
        listagem.foto = upload_result["secure_url"]

    elif imagem_url:
        # Apenas atualizar a URL e ID da imagem já existente
        listagem.foto = imagem_url
        if "/conexaorural/fotoProduto/" in imagem_url:
            listagem.foto_id = imagem_url.split("/conexaorural/fotoProduto/")[-1].split(".")[0]
        else:
            listagem.foto_id = None  # fallback se não estiver no padrão esperado

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
        "nome": listagem.nome_personalizado,
        "preco": listagem.preco,
        "quantidade": listagem.estoque,
        "unidade": listagem.unidade,
        "descricao": listagem.descricao
    }

@router.post("/validar-endereco")
async def validar_endereco(data: EnderecoInput):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "format": "json",
        "q": data.endereco
    }
    headers = {
        "User-Agent": "conexao-rural-app"  # obrigatório pelo Nominatim
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)

    if response.status_code != 200:
        return {"valido": False, "erro": "Falha na requisição à API"}

    geodata = response.json()

    valido = len(geodata) > 0

    return {"valido": valido}

@router.get("/produtores/{produtor_id}/endereco-coordenadas")
def get_endereco_com_coordenadas(produtor_id: int, db: Session = Depends(get_db)):
    produtor = db.query(Produtor).filter(Produtor.id == produtor_id).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    endereco = f"{produtor.rua or ''}, {produtor.numero or ''}, {produtor.bairro or ''}".strip(', ')

    return {
        "texto": endereco,
        "rua": produtor.rua,
        "numero": produtor.numero,
        "bairro": produtor.bairro
    }

@router.post("/produtores/produtos/sugerirnome")
async def sugerir_nome_produto(file: UploadFile = File(...)):
    try:
        # 1. Lê os bytes da imagem
        contents = await file.read()

        # 2. Faz o upload para o Cloudinary
        print('fazendo upload no cloudinary')

        upload_result = cloudinary.uploader.upload(
            contents,
            resource_type="image",
            folder="conexaorural/fotoProduto"
        )
        url_imagem = upload_result["secure_url"]

        # 3. Chama o Clarifai com essa URL
        print('chamando api')
        conceitos = reconhecer_alimento_clarifai(url_imagem)

        if not conceitos:
            raise HTTPException(status_code=422, detail="Nenhum item reconhecido na imagem")
        
        print(conceitos)

        def traduzir(nome: str) -> str:
            return TRADUCOES.get(nome.lower(), nome).capitalize()

        return {
            "nome_sugerido": traduzir(conceitos[0]["nome"]),
            "conceitos": [
                {"nome": traduzir(c["nome"]), "confiança": c["confiança"]}
                for c in conceitos[:5]
            ],
            "imagem_url": url_imagem
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")
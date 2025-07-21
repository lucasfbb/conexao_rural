from datetime import datetime
import os
import shutil
import time
from typing import List
from auth.auth_utils import get_current_user
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from schemas.produtor import ProdutorOut
from schemas.produto import ProdutoOut
from schemas.formaPagamento import FormaPagamentoIn, FormaPagamentoOut
from schemas.endereco import EnderecoIn, EnderecoOut
from schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioResponse, UsuarioUpdate
from crud.usuario import criar_usuario
from database import get_db
from models.pedido import Pedido
from models.formapagamento import FormaPagamento
from models.produto import Produto
from models.produtor import Produtor
from models.endereco import Endereco
from models.usuario import Usuario

router = APIRouter()

UPLOAD_PERFIS_USUARIO_DIR = "uploads/perfilUsuario"
os.makedirs(UPLOAD_PERFIS_USUARIO_DIR, exist_ok=True)

### CADASTRO

@router.post("/cadastrar_user", response_model=UsuarioResponse)
def criar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    return criar_usuario(db, usuario)

### PROFILE

@router.get("/perfil/me", response_model=UsuarioOut)
def get_perfil(current_user: Usuario = Depends(get_current_user)):
    return current_user

@router.patch("/perfil/me", response_model=UsuarioOut)
def update_perfil(
    dados: UsuarioUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):  
    print("Recebido:", dados)
    # Atualize só os campos informados
    for attr, value in dados.dict(exclude_unset=True).items():
        setattr(current_user, attr, value)
    db.commit()
    db.refresh(current_user)
    return current_user

### ENDEREÇOS

@router.get("/perfil/enderecos", response_model=List[EnderecoOut])
def listar_enderecos(current_user: Usuario = Depends(get_current_user)):
    return current_user.enderecos

@router.post("/perfil/enderecos", response_model=EnderecoOut)
def adicionar_endereco(endereco: EnderecoIn, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    novo = Endereco(**endereco.dict(), usuario_id=current_user.id)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.patch("/perfil/enderecos/{id}", response_model=EnderecoOut)
def editar_endereco(id: int, dados: EnderecoIn, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    end = db.query(Endereco).filter_by(id=id, usuario_id=current_user.id).first()
    if not end:
        raise HTTPException(404)
    for attr, value in dados.dict(exclude_unset=True).items():
        setattr(end, attr, value)
    db.commit()
    db.refresh(end)
    return end

@router.delete("/perfil/enderecos/{id}")
def remover_endereco(id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    end = db.query(Endereco).filter_by(id=id, usuario_id=current_user.id).first()
    if not end:
        raise HTTPException(404)
    db.delete(end)
    db.commit()
    return {"detail": "Endereço removido"}

@router.get("/perfil/{usuario_id}/tem-endereco")
def usuario_tem_endereco(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    tem_endereco = len(usuario.enderecos) > 0
    return {"tem_endereco": tem_endereco}

### PAGAMENTOS

@router.get("/perfil/pagamentos", response_model=List[FormaPagamentoOut])
def listar_pagamentos(current_user: Usuario = Depends(get_current_user)):
    return current_user.formas_pagamento

# @router.post("/perfil/pagamentos", response_model=FormaPagamentoOut)
# def adicionar_pagamento(dados: FormaPagamentoIn, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
#     nova = FormaPagamento(**dados.dict(), usuario_cpf_cnpj=current_user.cpf_cnpj)
#     db.add(nova)
#     db.commit()
#     db.refresh(nova)
#     return nova

@router.post("/perfil/pagamentos", response_model=FormaPagamentoOut)
def adicionar_pagamento(
    dados: FormaPagamentoIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    if not dados.token_gateway:
        raise HTTPException(status_code=400, detail="Token do cartão é obrigatório")

    nova = FormaPagamento(
        usuario_id=current_user.id,
        gateway="mercadopago",
        token_gateway=dados.token_gateway,
        bandeira=dados.bandeira,
        final_cartao=dados.final_cartao,
        nome_cartao=dados.nome_cartao,
        nome_impresso=dados.nome_impresso,
        criado_em=datetime.now()
    )

    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@router.delete("/perfil/pagamentos/{id}")
def remover_pagamento(id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    pag = db.query(FormaPagamento).filter_by(id=id, usuario_id=current_user.id).first()
    if not pag:
        raise HTTPException(404)
    db.delete(pag)
    db.commit()
    return {"detail": "Pagamento removido"}

@router.patch("/perfil/pagamentos/{id}", response_model=FormaPagamentoOut)
def editar_pagamento(id: int, dados: FormaPagamentoIn, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    pagamento = db.query(FormaPagamento).filter_by(id=id, usuario_id=current_user.id).first()
    if not pagamento:
        raise HTTPException(404, detail="Pagamento não encontrado")

    for key, value in dados.dict().items():
        setattr(pagamento, key, value)

    db.commit()
    db.refresh(pagamento)
    return pagamento

### PRODUTOS FAVORITOS

@router.get("/perfil/produtos-favoritos", response_model=List[ProdutoOut])
def listar_produtos_favoritos(current_user: Usuario = Depends(get_current_user)):
    return current_user.produtos_favoritos

@router.post("/perfil/produtos-favoritos/{produto_id}")
def favoritar_produto(produto_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    produto = db.query(Produto).get(produto_id)
    if not produto:
        raise HTTPException(404)
    current_user.produtos_favoritos.append(produto)
    db.commit()
    return {"detail": "Produto favoritado"}

@router.delete("/perfil/produtos-favoritos/{produto_id}")
def desfavoritar_produto(produto_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    produto = db.query(Produto).get(produto_id)
    if not produto:
        raise HTTPException(404)
    current_user.produtos_favoritos.remove(produto)
    db.commit()
    return {"detail": "Produto removido dos favoritos"}

### AGRICULTORES FAVORITOS

@router.get("/perfil/produtores-favoritos", response_model=List[ProdutorOut])
def listar_produtores_favoritos(current_user: Usuario = Depends(get_current_user)):
    return current_user.produtores_favoritos

@router.post("/perfil/produtores-favoritos/{produtor_cpf_cnpj}")
def favoritar_produtor(produtor_cpf_cnpj: str, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    produtor = db.query(Produtor).get(produtor_cpf_cnpj)
    if not produtor:
        raise HTTPException(404)
    current_user.produtores_favoritos.append(produtor)
    db.commit()
    return {"detail": "Produtor favoritado"}

@router.delete("/perfil/produtores-favoritos/{produtor_cpf_cnpj}")
def desfavoritar_produtor(produtor_cpf_cnpj: str, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    produtor = db.query(Produtor).get(produtor_cpf_cnpj)
    if not produtor:
        raise HTTPException(404)
    current_user.produtores_favoritos.remove(produtor)
    db.commit()
    return {"detail": "Produtor removido dos favoritos"}

@router.get("/perfil/ultimos-pedidos")
def listar_ultimos_pedidos(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    pedidos = (
        db.query(Pedido)
        .filter(Pedido.usuario_id == usuario_id)
        .order_by(Pedido.momento_compra.desc())
        .limit(5)
        .all()
    )
    
    return [p.to_dict() for p in pedidos]

@router.post("/perfil/foto/upload")
async def upload_foto_perfil(
    file: UploadFile = File(...),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("==> RECEBIDO UPLOAD FOTO", file.filename, file.content_type)
    ext = file.filename.split('.')[-1]
    filename = f"foto_perfil_{current_user.id}_{int(time.time())}.{ext}"
    file_path = os.path.join(UPLOAD_PERFIS_USUARIO_DIR, filename)

    # Tenta deletar o arquivo anterior, se existir
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Não foi possível remover a foto anterior: {e}")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        usuario = db.query(Usuario).filter(Usuario.id == current_user.id).first()
        if usuario:
            if usuario.foto_perfil and os.path.exists(usuario.foto_perfil[1:]):  # Remove a barra inicial
                try:
                    os.remove(usuario.foto_perfil[1:])
                except Exception:
                    pass

            usuario.foto_perfil = f"/uploads/perfilUsuario/{filename}"
            db.commit()
            db.refresh(usuario)

            # # atualizando o caminho da nova foto no banco
            # produtor.foto = f"/uploads/perfilProdutor/{filename}"
            # db.commit()
            # db.refresh(produtor)
        return {"foto": f"/uploads/perfilUsuario/{filename}"}
    except Exception as e:
        print("ERRO AO SALVAR FOTO:", e)
        raise HTTPException(status_code=500, detail="Erro ao salvar a foto")
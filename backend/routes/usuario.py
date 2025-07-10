from typing import List
from auth.auth_utils import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.produtor import ProdutorOut
from schemas.produto import ProdutoOut
from schemas.formaPagamento import FormaPagamentoIn, FormaPagamentoOut
from schemas.endereco import EnderecoIn, EnderecoOut
from schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioResponse, UsuarioUpdate
from crud.usuario import criar_usuario
from database import get_db
from models.formapagamento import FormaPagamento
from models.produto import Produto
from models.produtor import Produtor
from models.endereco import Endereco
from models.usuario import Usuario

router = APIRouter()

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
    novo = Endereco(**endereco.dict(), cpf_usuario=current_user.cpf_cnpj)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.patch("/perfil/enderecos/{id}", response_model=EnderecoOut)
def editar_endereco(id: int, dados: EnderecoIn, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    end = db.query(Endereco).filter_by(id=id, cpf_usuario=current_user.cpf_cnpj).first()
    if not end:
        raise HTTPException(404)
    for attr, value in dados.dict(exclude_unset=True).items():
        setattr(end, attr, value)
    db.commit()
    db.refresh(end)
    return end

@router.delete("/perfil/enderecos/{id}")
def remover_endereco(id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    end = db.query(Endereco).filter_by(id=id, cpf_usuario=current_user.cpf_cnpj).first()
    if not end:
        raise HTTPException(404)
    db.delete(end)
    db.commit()
    return {"detail": "Endereço removido"}

### PAGAMENTOS

@router.get("/perfil/pagamentos", response_model=List[FormaPagamentoOut])
def listar_pagamentos(current_user: Usuario = Depends(get_current_user)):
    return current_user.formas_pagamento

@router.post("/perfil/pagamentos", response_model=FormaPagamentoOut)
def adicionar_pagamento(dados: FormaPagamentoIn, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    nova = FormaPagamento(**dados.dict(), usuario_cpf_cnpj=current_user.cpf_cnpj)
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@router.delete("/perfil/pagamentos/{id}")
def remover_pagamento(id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    pag = db.query(FormaPagamento).filter_by(id=id, usuario_cpf_cnpj=current_user.cpf_cnpj).first()
    if not pag:
        raise HTTPException(404)
    db.delete(pag)
    db.commit()
    return {"detail": "Pagamento removido"}

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

@router.get("/perfil/agricultores-favoritos", response_model=List[ProdutorOut])
def listar_agricultores_favoritos(current_user: Usuario = Depends(get_current_user)):
    return current_user.produtores_favoritos

@router.post("/perfil/agricultores-favoritos/{produtor_cpf_cnpj}")
def favoritar_agricultor(produtor_cpf_cnpj: str, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    produtor = db.query(Produtor).get(produtor_cpf_cnpj)
    if not produtor:
        raise HTTPException(404)
    current_user.produtores_favoritos.append(produtor)
    db.commit()
    return {"detail": "Agricultor favoritado"}

@router.delete("/perfil/agricultores-favoritos/{produtor_cpf_cnpj}")
def desfavoritar_agricultor(produtor_cpf_cnpj: str, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    produtor = db.query(Produtor).get(produtor_cpf_cnpj)
    if not produtor:
        raise HTTPException(404)
    current_user.produtores_favoritos.remove(produtor)
    db.commit()
    return {"detail": "Agricultor removido dos favoritos"}
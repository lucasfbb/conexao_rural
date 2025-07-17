from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.produto import Produto
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor

router = APIRouter()

@router.get("/favoritos/produtor")
def listar_favoritos_produtores(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return [p.cpf_cnpj for p in usuario.produtores_favoritos]

@router.post("/favoritos/produtor")
def adicionar_favorito_produtor(id_usuario: int, cpf_produtor: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=id_usuario).first()
    usuario_produtor = db.query(Usuario).filter_by(cpf_cnpj=cpf_produtor).first()

    if not usuario or not usuario_produtor:
        raise HTTPException(status_code=404, detail="Usuário ou produtor não encontrado")

    produtor = db.query(Produtor).filter_by(usuario_id=usuario_produtor.id).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    if produtor in usuario.produtores_favoritos:
        return {"msg": "Produtor já está nos favoritos"}

    usuario.produtores_favoritos.append(produtor)
    db.commit()
    return {"msg": "Produtor favoritado com sucesso"}

@router.delete("/favoritos/produtor")
def remover_favorito_produtor(id_usuario: int, cpf_produtor: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=id_usuario).first()
    usuario_produtor = db.query(Usuario).filter_by(cpf_cnpj=cpf_produtor).first()

    if not usuario or not usuario_produtor:
        raise HTTPException(status_code=404, detail="Usuário ou produtor não encontrado")

    produtor = db.query(Produtor).filter_by(usuario_id=usuario_produtor.id).first()
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    if produtor in usuario.produtores_favoritos:
        usuario.produtores_favoritos.remove(produtor)
        db.commit()

    return {"msg": "Produtor removido dos favoritos"}

# @router.get("/favoritos/produto")
# def listar_favoritos_produtos(cpf_usuario: str, db: Session = Depends(get_db)):
#     usuario = db.query(Usuario).filter_by(cpf_cnpj=cpf_usuario).first()
#     if not usuario:
#         raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
#     return usuario.produtos_favoritos  # ou serialize se quiser transformar antes

@router.get("/favoritos/produto")
def listar_favoritos_produtos(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    favoritos = usuario.produtos_favoritos

    resultado = []
    for produto in favoritos:
        listagem = produto.listagens[0] if produto.listagens else None
        produtor = listagem.produtor if listagem else None

        resultado.append({
            "id": produto.id,
            "nome": produto.nome,
            "descricao": listagem.descricao if listagem else None,
            "foto": listagem.foto if listagem and listagem.foto else None,
            "preco": float(listagem.preco) if listagem else None,
            "preco_promocional": float(listagem.preco_promocional) if listagem and listagem.preco_promocional else None,
            "produtor": {
                "nome": produtor.nome,
                # "cpf_cnpj": produtor.cpf_cnpj,
            } if produtor else None
        })

    return resultado

@router.post("/favoritos/produto")
def adicionar_favorito_produto(id_usuario: int, id_produto: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=id_usuario).first()
    produto = db.query(Produto).filter_by(id=id_produto).first()

    if not usuario or not produto:
        raise HTTPException(status_code=404, detail="Usuário ou produto não encontrado")

    if produto in usuario.produtos_favoritos:
        raise HTTPException(status_code=400, detail="Produto já favoritado")

    usuario.produtos_favoritos.append(produto)
    db.commit()
    return {"msg": "Produto favoritado com sucesso"}

@router.delete("/favoritos/produto")
def remover_favorito_produto(id_usuario: int, id_produto: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=id_usuario).first()
    produto = db.query(Produto).filter_by(id=id_produto).first()

    if not usuario or not produto:
        raise HTTPException(status_code=404, detail="Usuário ou produto não encontrado")

    if produto in usuario.produtos_favoritos:
        usuario.produtos_favoritos.remove(produto)
        db.commit()

    return {"msg": "Produto removido dos favoritos"}
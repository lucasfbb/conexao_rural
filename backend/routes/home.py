from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor
from schemas.produtor import ProdutorOut

router = APIRouter()

@router.get("/agricultores", response_model=list[ProdutorOut])
def listar_agricultores(
    db: Session = Depends(get_db),
    exclude_cpf_cnpj: str = Query(None, description="CPF/CNPJ do usuário logado para não aparecer na lista"),
    limit: int = Query(20, description="Máximo de produtores"),
    offset: int = Query(0, description="Deslocamento para paginação"),
):
    query = (
        db.query(Produtor)
        .join(Usuario, Usuario.cpf_cnpj == Produtor.cpf_cnpj)
        .filter(Usuario.e_vendedor == True)
    )

    # Exclui o próprio usuário (se informado)
    if exclude_cpf_cnpj:
        query = query.filter(Produtor.cpf_cnpj != exclude_cpf_cnpj)
    
    # Paginação/limite
    produtores = query.offset(offset).limit(limit).all()

    resposta = []
    for produtor in produtores:
        usuario = db.query(Usuario).filter(Usuario.cpf_cnpj == produtor.cpf_cnpj).first()
        resposta.append(ProdutorOut(
            cpf_cnpj=usuario.cpf_cnpj,
            nome=produtor.nome,
            banner=produtor.banner,
            endereco=produtor.endereco,
            categoria=produtor.categoria,
            foto=produtor.foto,
            distancia=8.5  # valor default fictício por enquanto
        ))

    return resposta


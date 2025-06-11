from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor
from schemas.produtor import ProdutorOut

router = APIRouter()

@router.get("/agricultores", response_model=list[ProdutorOut])
def listar_agricultores(db: Session = Depends(get_db)):
    produtores = (
        db.query(Produtor)
        .join(Usuario, Usuario.cpf_cnpj == Produtor.cpf_cnpj)
        .filter(Usuario.e_vendedor == True)
        .all()
    )

    resposta = []
    for produtor in produtores:
        resposta.append(ProdutorOut(
            nome=produtor.nome,
            endereco=produtor.endereco,
            categoria=produtor.categoria,
            foto=produtor.foto,
            distancia=8.5  # valor default fictício por enquanto
        ))

    print(resposta)
    
    return resposta


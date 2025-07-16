from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor
from schemas.produtor import ProdutorOut

router = APIRouter()

# @router.get("/produtores", response_model=list[ProdutorOut])
# def listar_produtores(
#     db: Session = Depends(get_db),
#     exclude_cpf_cnpj: str = Query(None, description="CPF/CNPJ do usuário logado para não aparecer na lista"),
#     limit: int = Query(20, description="Máximo de produtores"),
#     offset: int = Query(0, description="Deslocamento para paginação"),
# ):
#     query = (
#         db.query(Produtor)
#         .join(Usuario, Usuario.id == Produtor.usuario_id)
#         .filter(Usuario.e_vendedor == True)
#     )

#     # Exclui o próprio usuário (se informado)
#     if exclude_cpf_cnpj:
#         query = query.filter(Produtor.cpf_cnpj != exclude_cpf_cnpj)
    
#     # Paginação/limite
#     produtores = query.offset(offset).limit(limit).all()

#     resposta = []
#     for produtor in produtores:
#         usuario = db.query(Usuario).filter(Usuario.cpf_cnpj == produtor.cpf_cnpj).first()
#         resposta.append(ProdutorOut(
#             cpf_cnpj=usuario.cpf_cnpj,
#             nome=produtor.nome,
#             banner=produtor.banner,
#             endereco=produtor.endereco,
#             rua=produtor.rua,
#             numero=produtor.numero,
#             bairro=produtor.bairro,
#             complemento=produtor.complemento,
#             categoria=produtor.categoria,
#             foto=produtor.foto,
#             distancia=8.5  # valor default fictício por enquanto
#         ))

#         # print(f"Produtor: {produtor.nome}, CPF/CNPJ: {usuario.cpf_cnpj}, rua: {produtor.rua}")

#     return resposta

@router.get("/produtores", response_model=list[ProdutorOut])
def listar_produtores(
    db: Session = Depends(get_db),
    exclude_usuario_id: int = Query(None, description="ID do usuário logado para não aparecer na lista"),
    limit: int = Query(20, description="Máximo de produtores"),
    offset: int = Query(0, description="Deslocamento para paginação"),
):
    query = (
        db.query(Produtor)
        .join(Usuario, Usuario.id == Produtor.usuario_id)
        .filter(Usuario.e_vendedor == True)
    )

    if exclude_usuario_id:
        query = query.filter(Produtor.usuario_id != exclude_usuario_id)

    produtores = query.offset(offset).limit(limit).all()

    resposta = []
    for produtor in produtores:
        usuario = produtor.usuario  # relação já definida no modelo com relationship("Usuario")

        resposta.append(ProdutorOut(
            id=produtor.id,
            usuario_id=usuario.id,
            cpf_cnpj=usuario.cpf_cnpj,  # ainda pode ser retornado no schema, se quiser
            nome=produtor.nome,
            banner=produtor.banner,
            endereco=produtor.endereco,
            rua=produtor.rua,
            numero=produtor.numero,
            bairro=produtor.bairro,
            complemento=produtor.complemento,
            categoria=produtor.categoria,
            foto=produtor.foto,
            email=usuario.email,
            telefone_1=usuario.telefone_1,
            telefone_2=usuario.telefone_2,
            distancia=8.5  # valor default fictício por enquanto
        ))

    return resposta


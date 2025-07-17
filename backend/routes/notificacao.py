from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from auth.auth_utils import get_current_user
from database import get_db
from models.notificacao import Notificacao
from models.usuario import Usuario
from schemas.notificacao import NotificacaoCreate, NotificacaoOut

router = APIRouter()


@router.post("/notificacoes", response_model=NotificacaoOut, status_code=status.HTTP_201_CREATED)
def criar_notificacao(
    notificacao_data: NotificacaoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    nova_notificacao = Notificacao(**notificacao_data.dict())
    db.add(nova_notificacao)
    db.commit()
    db.refresh(nova_notificacao)
    return nova_notificacao


@router.get("/notificacoes", response_model=List[NotificacaoOut])
def listar_notificacoes(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    notificacoes = db.query(Notificacao).filter(
        Notificacao.usuario_id == current_user.id
    ).order_by(Notificacao.criado_em.desc()).all()
    return notificacoes


@router.delete("/notificacoes/{notificacao_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_notificacao(
    notificacao_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    notificacao = db.query(Notificacao).filter(
        Notificacao.id == notificacao_id,
        Notificacao.usuario_id == current_user.id
    ).first()

    if not notificacao:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")

    db.delete(notificacao)
    db.commit()

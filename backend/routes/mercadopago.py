from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Usuario
from schemas.formaPagamento import PedidoPagamentoIn
from auth.auth_utils import get_current_user
import mercadopago

router = APIRouter()

sdk = mercadopago.SDK("TEST-7194314365664629-071422-91b20e782dca6d74f6f23e20d5451c70-265020088")    

def calcular_total_pedido(pedido: PedidoPagamentoIn, db: Session) -> float:
    total = 0.0
    for item in pedido.itens:
        result = db.execute(
            "SELECT preco FROM listagem WHERE id = :id",
            {"id": item.id_listagem}
        ).fetchone()
        if result:
            preco_unitario = result[0]
            total += preco_unitario * item.quantidade

    # frete = 10.0
    return total

@router.post("/pedidos/pagar")
def pagar_pedido(
    pagamento: PedidoPagamentoIn,  # você define o schema com valor e id_pagamento
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    forma = db.query(FormaPagamento).filter_by(
        id=pagamento.id_pagamento,
        usuario_id=current_user.id
    ).first()

    if not forma:
        raise HTTPException(status_code=404, detail="Forma de pagamento não encontrada.")

    # Monta os dados para o pagamento
    payment_data = {
        "transaction_amount": float(pagamento.valor),
        "token": forma.token_gateway,
        "description": "Pedido no Conexão Rural",
        "installments": 1,
        "payment_method_id": forma.bandeira.lower(),  # ex: "visa"
        "payer": {
            "email": current_user.email
        }
    }

    # Faz o pagamento
    try:
        result = sdk.payment().create(payment_data)
        response = result["response"]
        status = response.get("status")

        if status != "approved":
            raise HTTPException(status_code=400, detail=f"Pagamento não aprovado: {status}")

        return {
            "status": status,
            "id_pagamento": response.get("id"),
            "valor": pagamento.valor,
            "mensagem": "Pagamento realizado com sucesso!"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar pagamento: {str(e)}")

@router.post("/pedidos/pagar_pix")
def pagar_com_pix(pedido: PedidoPagamentoIn, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    total = calcular_total_pedido(pedido, db)

    payment_data = {
        "transaction_amount": total,
        "description": "Pedido no Conexão Rural",
        "payment_method_id": "pix",
        "payer": {
            "email": current_user.email,
            "first_name": current_user.nome,
            "last_name": current_user.sobrenome or "",
            "identification": {
                "type": "CPF",
                "number": current_user.cpf_cnpj
            }
        }
    }

    result = sdk.payment().create(payment_data)
    pagamento = result["response"]

    return {
        "status": pagamento["status"],
        "qr_code": pagamento["point_of_interaction"]["transaction_data"]["qr_code"],
        "qr_code_base64": pagamento["point_of_interaction"]["transaction_data"]["qr_code_base64"],
        "id_pagamento": pagamento["id"]
    }
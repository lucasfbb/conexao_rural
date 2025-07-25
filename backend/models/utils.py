# utils/timezone.py
from datetime import datetime
import pytz
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2

BRASIL_TZ = pytz.timezone("America/Sao_Paulo")

PAT = 'da274e920a7c420fa097d2496ef1f140'
USER_ID = "clarifai"
APP_ID = "main"
MODEL_ID = "food-item-recognition"
MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044"

def agora_brasil():
    return datetime.now(BRASIL_TZ)

def reconhecer_alimento_clarifai(imagem_url: str):
    channel = ClarifaiChannel.get_grpc_channel()
    stub = service_pb2_grpc.V2Stub(channel)
    metadata = (('authorization', 'Key ' + PAT),)
    userDataObject = resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID)

    response = stub.PostModelOutputs(
        service_pb2.PostModelOutputsRequest(
            user_app_id=userDataObject,
            model_id=MODEL_ID,
            version_id=MODEL_VERSION_ID,
            inputs=[resources_pb2.Input(
                data=resources_pb2.Data(
                    image=resources_pb2.Image(url=imagem_url)
                )
            )]
        ),
        metadata=metadata
    )

    if response.status.code != status_code_pb2.SUCCESS:
        raise Exception("Erro Clarifai: " + response.status.description)

    conceitos = []
    for concept in response.outputs[0].data.concepts:
        conceitos.append({"nome": concept.name, "confiança": concept.value})
    
    return conceitos


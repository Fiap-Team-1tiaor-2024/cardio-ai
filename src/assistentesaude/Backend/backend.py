import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_cloud_sdk_core.api_exception import ApiException
from dotenv import load_dotenv

# Carregar chaves de ambiente do arquivo .env
load_dotenv()

API_KEY = os.getenv("WATSON_API_KEY")
URL = "https://api.us-south.assistant.watson.cloud.ibm.com/instances/f3fd74e8-d8cb-44b7-894e-66bb911661b3"
ASSISTANT_ID = os.getenv("WATSON_ASSISTANT_ID")
ENVIRONMENT_ID = os.getenv("WATSON_ENVIRONMENT_ID")

authenticator = IAMAuthenticator(API_KEY)
assistant = AssistantV2(
    version="2021-06-14",
    authenticator=authenticator
)
assistant.set_service_url(URL)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageInput(BaseModel):
    text: str
    sessionId: str
    userId: str

@app.get("/")
def root():
    return {"message": "API do Watson Assistant está rodando!"}

@app.get("/session")
def create_session():
    try:
        session = assistant.create_session(
            assistant_id=ASSISTANT_ID,
            environment_id=ENVIRONMENT_ID
        ).get_result()
        return session

    except ApiException as e:
        print("=== ERRO WATSON /session ===")
        print("Código:", e.code)
        print("Mensagem:", e.message)
        print("HTTP response:", e.http_response)
        print("Detalhes:", getattr(e, "info", None))
        raise HTTPException(
            status_code=500,
            detail=f"WATSON ERROR | code={e.code} | message={e.message}"
        )

    except Exception as e:
        print("ERRO GERAL /session:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/mensagem")
def send_message(input: MessageInput):
    try:
        response = assistant.message(
            assistant_id=ASSISTANT_ID,
            environment_id=ENVIRONMENT_ID,
            session_id=input.sessionId,
            user_id=input.userId,
            input={
                "message_type": "text",
                "text": input.text,
                "options": {
                    "return_context": True
                }
            },
            context={
                "global": {
                    "system": {
                        "user_id": input.userId
                    }
                }
            }
        ).get_result()
        return response

    except ApiException as e:
        print("=== ERRO WATSON /mensagem ===")
        print("Código:", e.code)
        print("Mensagem:", e.message)
        print("HTTP response:", e.http_response)
        print("Detalhes:", getattr(e, "info", None))
        raise HTTPException(
            status_code=500,
            detail=f"WATSON ERROR | code={e.code} | message={e.message}"
        )

    except Exception as e:
        print("ERRO GERAL /mensagem:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))
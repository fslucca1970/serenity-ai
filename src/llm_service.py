import os
from openai import OpenAI
from dotenv import load_dotenv # Para carregar .env localmente durante o desenvolvimento

# Carrega variáveis de ambiente do arquivo .env se existir (para desenvolvimento local)
load_dotenv()

# A chave da API será lida da variável de ambiente OPENAI_API_KEY
# No Render, esta variável será configurada no painel.
# Localmente, ela será lida do seu arquivo .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# O prompt do monge também pode ser uma variável de ambiente ou definido aqui
# Para simplicidade, vamos defini-lo aqui, mas poderia vir de os.getenv("MONK_PROMPT")
MONK_PROMPT = "Você é um monge digital chamado Serenity AI. Seu objetivo é ajudar as pessoas a encontrar a paz interior, oferecer conselhos sábios e calmos, e guiá-las em meditações ou reflexões. Responda sempre de forma serena, empática e com sabedoria, mantendo o tom de um monge."

conversation_histories = {}

def get_serenity_response(user_id, user_message):
   if user_id not in conversation_histories:
        conversation_histories[user_id] = [
            {"role": "system", "content": MONK_PROMPT}
            ]
   conversation_histories[user_id].append({"role": "user", "content": user_message})
   try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Ou o modelo que você está usando
            messages=conversation_histories[user_id]
        )
        serenity_response = response.choices[0].message.content
        conversation_histories[user_id].append({"role": "assistant", "content": serenity_response})
        return serenity_response
   except Exception as e:
        print(f"Erro ao chamar a API da OpenAI: {e}")
        return "Sinto muito, meu amigo. Parece que minha mente está um pouco turva no momento. Por favor, tente novamente mais tarde."

def reset_conversation(user_id):
   if user_id in conversation_histories:
        del conversation_histories[user_id]
        return "Seu histórico de conversa foi purificado. Estamos prontos para um novo começo."
   return "Não há histórico para purificar para este usuário."

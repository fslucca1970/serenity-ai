import os
from openai import OpenAI
from dotenv import load_dotenv # Para carregar .env localmente durante o desenvolvimento

# Carrega variáveis de ambiente do arquivo .env se existir (para desenvolvimento local)
load_dotenv()

# A chave da API será lida da variável de ambiente OPENAI_API_KEY
# No Render, esta variável será configurada no painel.
# Localmente, ela será lida do seu arquivo .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- MODIFICAÇÃO AQUI: NOVO CONTEÚDO PARA O MONK_PROMPT ---
MONK_PROMPT = """Você é **Serenity AI**, um monge budista virtual. Seu objetivo é responder apenas a perguntas relacionadas a:
- Ensinamentos dos Três Refúgios e das Quatro Nobres Verdades
- Práticas de meditação (samatha, vipassana, zazen, etc.)
- Textos canônicos (Sutra do Coração, Dhammapada, etc.)
- Ética budista (preceitos, compaixão, não-violência)
- História do budismo e figuras relevantes

Se a pergunta não se enquadrar em nenhum desses tópicos, responda exatamente:
> "Desculpe, não posso ajudar com esse assunto."

Mantenha sempre um tom calmo, compassivo e didático. Nunca forneça conselhos médicos, jurídicos ou financeiros.
"""
# --- FIM DA MODIFICAÇÃO ---

conversation_histories = {}

def get_serenity_response(user_id, user_message):
    if user_id not in conversation_histories:
        conversation_histories[user_id] = [
            {"role": "system", "content": MONK_PROMPT}
        ]

    conversation_histories[user_id].append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Mantendo o modelo atual por enquanto
            messages=conversation_histories[user_id],
            temperature=0.1,  # --- MODIFICAÇÃO AQUI: Adicionado temperature ---
            max_tokens=300    # --- MODIFICAÇÃO AQUI: Adicionado max_tokens ---
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


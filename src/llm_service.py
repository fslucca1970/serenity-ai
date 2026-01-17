        import os
        from openai import OpenAI
        from config import OPENAI_API_KEY, MONK_PROMPT

        client = OpenAI(api_key=OPENAI_API_KEY)

        conversation_histories = {}

        def get_serenity_response(user_id, user_message):
            if user_id not in conversation_histories:
                conversation_histories[user_id] = [
                    {"role": "system", "content": MONK_PROMPT}
                ]
            conversation_histories[user_id].append({"role": "user", "content": user_message})

            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
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


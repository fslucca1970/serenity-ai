from flask import Flask, request, jsonify
from llm_service import get_serenity_response, reset_conversation
# from config import OPENAI_API_KEY, MONK_PROMPT
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

print(f"DEBUG: OPENAI_API_KEY carregada: {os.getenv('OPENAI_API_KEY')[:10]}...")

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Mensagem não fornecida"}), 400

    response_text = get_serenity_response(user_id, user_message)
    return jsonify({"response": response_text})

@app.route('/reset', methods=['POST'])
def reset():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    message = reset_conversation(user_id)
    return jsonify({"message": message})

@app.route('/')
def home():
    return "Bem-vindo ao Serenity AI Backend! Use a rota /chat para interagir."

# if __name__ == '__main__':
#    app.run(debug=True, host='0.0.0.0', port=os.getenv('PORT', 5000))

from flask import Flask, request, jsonify
from urllib.parse import urlparse
import os
import requests
from dotenv import load_dotenv
from RAG.store_file import load_files
from RAG.document_chat import start_chat, process_query
import base64
import google.generativeai as genai
from PIL import Image

load_dotenv()
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

app = Flask(__name__)
port = 3000


#get user access token from code
@app.route("/getAccessToken", methods=["GET"])
def getAccessToken():
    code = request.args.get("code")
    response = requests.get("https://github.com/login/oauth/access_token", data={
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code
    },
    headers={
        'Accept': 'application/json',
        'Accept-encoding': 'application/json'
    })

    data = response.json()
    return jsonify(data)

#get user data 
@app.route("/getUserData", methods=["GET"])
def getUserData():
    authorization_token = request.headers.get("authorization")
    response = requests.get("https://api.github.com/user", headers={
        "Authorization": authorization_token
    })

    data = response.json()
    return jsonify(data)

@app.route("/getUserRepos", methods=["GET"])
def getUserRepos():
    authorization_token = request.headers.get("authorization")
    response = requests.get("https://api.github.com/user/repos", headers={
        "Authorization": authorization_token
    })

    data = response.json()
    return jsonify(data)


# Endpoint to invoke the process of storing file in vector DB
@app.route("/storeFiles", methods=["POST"])
def store_files():
    # Getting JSON data from request
    request_data = request.get_json()

    # Exacting all the date required as parameters to call the function
    repo_link = request_data["repoPath"]
    username = request_data["username"]
    github_token = request_data["githubToken"]
    branch_name = request_data["branch"]

    #parsing github link to create path format in username/repoName
    parsed_url = urlparse(repo_link)
    path = parsed_url.path
    cleaned_path = path.strip("/")
    path_parts = cleaned_path.split("/")
    repo_path = "/".join(path_parts[:2])

    # Calling the load_file Function with all the parameters
    try:
        load_files(repo_path, username, github_token, branch_name)
        return jsonify({"message": "Database created successfully"}), 201
    except Exception as e:
        return "Database couldn't be created", 500


# Endpoint to invoke the process of initializing new chat for an user
@app.route("/startChat", methods=["GET"])
def start_chat_endpoint():
    username = request.args.get("username")
    try:
        response = start_chat(username)
        return jsonify(response), 200
    except Exception as e:
        return "Chat couldn't be started", 500


# Endpoint to process user's query with relevant file in context
@app.route("/sendMessage", methods=["POST"])
def send_message():
    request_data = request.get_json()

    # Exacting all the date required as parameters to call the function
    user_text_query = request_data["userTextQuery"]
    username = request_data["username"]
    chat_history = request_data["chatHistory"]

    # Calling the process_query function to process the request and return a response
    try:
        response = process_query(user_text_query, chat_history, username)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": f"Message couldn't be processed: {e}"}), 500


@app.route("/performOCR", methods=["POST"])
def perform_ocr():
    image_data = request.json.get("image")

    base64_data = image_data.replace("data:image/png;base64,", "")
    # Decode base64 data
    try:
        binary_data = base64.b64decode(base64_data)
    except Exception as e:
        return jsonify({"error": f"Error decoding image data: {e}"}), 400

    # Save image to temporary file
    try:
        with open("image.png", "wb") as f:
            f.write(binary_data)
    except Exception as e:
        return jsonify({"error": f"Error saving image: {e}"}), 500

    return jsonify({"message": "success"})


def getGenAIResponse(prompt: str):
    # Use gemini-pro-vision model
    model = genai.GenerativeModel('gemini-pro-vision')

    # Read image from file
    try:
        image_content = Image.open("image.png")
    except Exception as e:
        raise FileNotFoundError(e)

    try:
        response = model.generate_content([prompt, image_content])
        response.resolve()

        return response.text
    except Exception as e:
        raise Exception(e)


@app.route("/getDataResponse", methods=["GET"])
def get_data_response():
    # Define prompt (can be customized)
    prompt = "Explain it to me like I'm 5. I have 0 knowledge of python so please tailor answer to my proficiency. Also explain some code concepts if possible"
    try:
        return jsonify({"response": getGenAIResponse(prompt)}), 200
    except FileNotFoundError as e:
        return jsonify({"error": f"Error reading image: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error generating content: {e}"}), 500


@app.route("/getUserResponse", methods=["POST"])
def get_user_response():
    prompt = request.json["message"]

    try:
        return jsonify({"response": getGenAIResponse(prompt)}), 200
    except FileNotFoundError as e:
        return jsonify({"error": f"Error reading image: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error generating content: {e}"}), 500

# Start listening on given port
if __name__ == '__main__':
    app.run(port=port)

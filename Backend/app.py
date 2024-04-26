from flask import Flask, request, jsonify
from urllib.parse import urlparse
import os
import requests
from dotenv import load_dotenv
from RAG.store_file import load_files
from RAG.document_chat import start_chat, process_query

load_dotenv()
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

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
    print(authorization_token)
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

    #parsing github link to create path format in username/repoName
    parsed_url = urlparse(repo_link)
    path = parsed_url.path
    cleaned_path = path.strip("/")
    path_parts = cleaned_path.split("/")
    repo_path = "/".join(path_parts[:2])

    # Calling the load_file Function with all the parameters
    try:
        load_files(repo_path, username, github_token)
        return "Database created successfully", 201
    except Exception as e:
        print(e)
        return "Database couldn't be created", 500


# Endpoint to invoke the process of initializing new chat for an user
@app.route("/startChat", methods=["GET"])
def start_chat_endpoint():
    username = request.args.get("username")
    try:
        response = start_chat(username)
        return jsonify(response), 200
    except Exception as e:
        print(e)
        return "Chat couldn't be started", 500


# Endpoint to process user's query with relevant file in context
@app.route("/sendMessage", methods=["POST"])
def send_message():
    request_data = request.get_json()
    print(request_data)

    # Exacting all the date required as parameters to call the function
    user_text_query = request_data["userTextQuery"]
    username = request_data["username"]
    chat_history = request_data["chatHistory"]

    # Calling the process_query function to process the request and return a response
    try:
        response = process_query(user_text_query, chat_history, username)
        print(response)
        return jsonify(response), 200
    except Exception as e:
        print(e)
        return "Message couldn't be processed", 500


# Start listening on given port
if __name__ == '__main__':
    app.run(port=port)

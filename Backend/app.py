from flask import Flask, request, jsonify
import base64
import os
import requests
from dotenv import load_dotenv

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
    print(authorization_token)
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
    print(data)
    return jsonify(data)


# Start listening on given port
if __name__ == '__main__':
    app.run(port=port)

import os
import google.generativeai as genai
from dotenv import load_dotenv
from langchain_community.vectorstores.chroma import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

base_db_url = "data"

PROMPT_TEMPLATE = """
Answer the question based on the following code context:

{context}

---

Answer the question based on the above code context: {question}
"""

initialization_prompt = """You are a code helper with over 20 years of experience helping people with questions relating to their code bases. You will be given a few chunks of code files from the repository followed by a question from the user. The chunk is give based on the user’s query, but sometimes it might be empty or might not have relevant information relating to the question, in that case ask the user to mention a file or a section more specifically, if this continues to have more that 3 times for the similar questions or regarding the same file or section ask the user to check what files have been selected in the previous to be added in the context.
The answers should be quite brief unless asked for longer response.
No action needed for now just greet the user by asking to talk about a section or a particular file, keep the greetings short."""


# Function to initialize vector DB model
def initialize_db(user_name: str):
    chroma_path = base_db_url + "/" + user_name
    if not os.path.exists(chroma_path):
        raise FileNotFoundError(f"Path {chroma_path} does not exist.")

    database = Chroma(persist_directory=chroma_path, embedding_function=embeddings)
    return database


# Retrival of 4 relevant chunks from the DB using a query
def query_database(query: str, database: Chroma):
    results = database.similarity_search_with_relevance_scores(query)
    print(results)
    return results


# Function to construct the prompt with user's query and the retrieved documents
def construct_prompt(query_text, documents: list[Document]):
    # Formatting the context documents
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in documents])

    # Creating prompt template model
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    return prompt_template.format(context=context_text, question=query_text)


# function to execute the chat
def process_query(user_text_query, chat_history, username):
    # Document retrieval
    database = initialize_db(user_name=username)
    retrieved_documents = query_database(user_text_query, database)

    # Building prompt
    prompt = construct_prompt(user_text_query, retrieved_documents)

    # Set up chat
    chat = model.start_chat(history=chat_history)

    # Prompt the model
    response = chat.send_message(prompt)

    return {
        "response": response.text,
        "chat_history": chat.history
    }


# Function to initialize a new chat or new session.
def start_chat(username):
    # start the new chat and blank chat history
    chat = model.start_chat(history=[])

    # Make the initial command to the model
    response = chat.send_message(initialization_prompt)
    return {
        "response": response.text,
        "chat_history": chat.history
    }

import shutil
import os
from dotenv import load_dotenv
from langchain_community.vectorstores.chroma import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import GithubFileLoader

from Backend.RAG.tacker import save_new_file

load_dotenv()

base_db_url = "data"

FILE_EXTENSIONS = (".py", ".java", ".cpp", ".cs", ".js", "jsx", ".html", ".css", ".sh", ".md", ".ts", ".tsx", ".php",
                   ".rb", ".swift", ".go", ".kt", ".lua", ".c", ".h", ".xml", ".yml", ".bat", ".dart",
                   ".scala", ".sql", ".rust", ".txt"
                   )


# loads requested files from gitHub, returns them in document format with some metadata
def github_file_loader(repo_path, github_token, branch):
    loader = GithubFileLoader(
        access_token=github_token,
        repo=repo_path,
        branch=branch,
        github_api_url="https://api.github.com",
        file_filter=lambda file_path: file_path.endswith(FILE_EXTENSIONS)
    )
    try:
        return loader.load()
    except Exception as e:
        raise Exception("There was an error loading the files from github")


# Internal function to return the file name from a path
def get_filename(filepath):
    filename_start = filepath.rfind("/") + 1
    return filepath[filename_start:]


# function to clean the metadata
def clean_documents(documents: [Document]):
    for document in documents:
        try:
            document.metadata["source"] = get_filename(document.metadata["source"])
        except Exception as e:
            continue
    return documents

# This function will split the characters in chunks, chunk size is set 2000cd
def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=3000,
        chunk_overlap=400,
        length_function=len,
        add_start_index=True,
    )
    return text_splitter.split_documents(documents)


# This function will save the chunks to the desired path for future retrival
def save_to_chroma(chunks: list[Document], user_name):
    directory_name = save_new_file(username=user_name, base_db_url=base_db_url)
    db_path = base_db_url + "/" + directory_name

    # Set the embeddings function
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    except Exception as e:
        raise Exception("There was an error loading the embeddings from Google")

    # Save the chunks to DB
    try:
        db = Chroma.from_documents(
            chunks, embeddings, persist_directory=db_path
        )
        db.persist()
    except Exception as e:
        raise Exception("There was an error saving the chunks to DB")


def load_files(repo_path, user_name, github_token, branch):
    raw_documents = github_file_loader(repo_path, github_token, branch)
    documents = clean_documents(raw_documents)
    chunks = split_text(documents)
    save_to_chroma(chunks, user_name)

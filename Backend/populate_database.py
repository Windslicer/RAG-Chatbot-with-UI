import os
import argparse
import shutil
from PyPDF2 import PdfReader
from langchain.schema import Document
from langchain_chroma import Chroma

CHROMA_PATH = "chroma"
DATA_PATH = "D:/internship/RAG/backend/data"
TEXT_PATH = "D:/internship/RAG/backend/text_data"

def extract_text_from_pdfs(data_path, text_path):
    print("Extracting text from PDFs...")
    if not os.path.exists(text_path):
        os.makedirs(text_path)

    for filename in os.listdir(data_path):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(data_path, filename)
            text_file_path = os.path.join(text_path, f"{filename}.txt")
            try:
                with open(pdf_path, "rb") as pdf_file, open(text_file_path, "w", encoding="utf-8") as text_file:
                    pdf_reader = PdfReader(pdf_file)
                    text_content = ""
                    for page in pdf_reader.pages:
                        text_content += page.extract_text()
                    text_file.write(text_content)
                    print(f"Extracted text from {filename}")
            except Exception as e:
                print(f"Error extracting text from {filename}: {e}")

def load_text_documents(text_path):
    print("Loading text documents...")
    documents = []
    for filename in os.listdir(text_path):
        if filename.endswith(".txt"):
            text_file_path = os.path.join(text_path, filename)
            try:
                with open(text_file_path, "r", encoding="utf-8") as text_file:
                    content = text_file.read()
                    documents.append(Document(
                        page_content=content,
                        metadata={"source": filename}
                    ))
                    print(f"Loaded {filename}")
            except Exception as e:
                print(f"Error loading {filename}: {e}")
    return documents

def main():
    # Check if the database should be cleared (using the --reset flag).
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset the database.")
    args = parser.parse_args()
    if args.reset:
        print("✨ Clearing Database")
        clear_database()

    # Extract text from PDFs.
    extract_text_from_pdfs(DATA_PATH, TEXT_PATH)

    # Load text documents.
    documents = load_text_documents(TEXT_PATH)
    if not documents:
        print("No documents loaded.")
        return

    chunks = split_documents(documents)
    print("Douments are loaded")
    add_to_chroma(chunks)

def split_documents(documents):
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    print("Splitting documents...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return text_splitter.split_documents(documents)

def add_to_chroma(chunks):
    from get_embedding_function import get_embedding_function
    from langchain_chroma import Chroma
    print("Adding to Chroma database...")

    # Load the existing database.
    db = Chroma(
        persist_directory=CHROMA_PATH, embedding_function=get_embedding_function()
    )

    # Calculate Page IDs.
    chunks_with_ids = calculate_chunk_ids(chunks)

    # Add or Update the documents.
    existing_items = db.get(include=[])  # IDs are always included by default
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    # Only add documents that don't exist in the DB.
    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"👉 Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
        #db.persist()  # This should now be used correctly if persist is available
        print("Documents added")
    else:
        print("✅ No new documents to add")


def calculate_chunk_ids(chunks):
    print("Calculating chunk IDs...")
    # This will create IDs like "data/monopoly.pdf:6:2"
    # Page Source : Page Number : Chunk Index
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page", 0)  # Use a default page number if not available
        current_page_id = f"{source}:{page}"

        # If the page ID is the same as the last one, increment the index.
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        # Calculate the chunk ID.
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        # Add it to the page meta-data.
        chunk.metadata["id"] = chunk_id

    return chunks

def clear_database():
    print("Clearing Chroma database...")
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

if __name__ == "__main__":
    main()















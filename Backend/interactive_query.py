# what happens if i roll double sixes multiple times in monopoly
import os
from get_embedding_function import get_embedding_function
from langchain_chroma import Chroma
from langchain_ollama import OllamaLLM

CHROMA_PATH = "chroma"

def query_model(query: str):
    # Load the database
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    
    # Initialize the model
    model = OllamaLLM(model="llama3.2")

    # Query the database directly with the query string
    # Adjusted method call to ensure compatibility
    results = db.similarity_search_with_score(query, k=1)  # using `k` instead of `n_results`
    
    if results:
        response = results[0][0].page_content  # results is a list of (document, score) tuples
        chunk_id = results[0][0].metadata.get('id', 'N/A')
        return response, chunk_id
    else:
        return "No relevant document found.", None

def main():
    while True:
        query = input("Enter your query (or type 'exit' to quit): ")
        if query.lower() == 'exit':
            break
        response, chunk_id = query_model(query)
        print(f"Model Response: {response}")
        if chunk_id:
            print(f"Chunk ID: {chunk_id}")

if __name__ == "__main__":
    main()

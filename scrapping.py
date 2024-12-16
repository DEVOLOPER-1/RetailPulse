import kagglehub
from serpapi import GoogleSearch
from dotenv import load_dotenv
import os
import requests


load_dotenv(dotenv_path="secret.env" ,verbose=True)

def download_walmart_2010_2012():
    
    # Download latest version
    path = kagglehub.dataset_download("saurabhbadole/walmart-super-market-dataset")
    
    print("Path to dataset files:", path)
    
    
def download_walmart_stock_data_2024():

    # Download latest version
    path = kagglehub.dataset_download("umerhaddii/walmart-stock-data-2024")
    
    print("Path to dataset files:", path)
    
    
def download_carrefour_online_sales_2020_2021():

    # Download latest version
    path = kagglehub.dataset_download("sherifhesham89/carrefour-online-sales")
    
    print("Path to dataset files:", path)
    
    
def download_target_market_sales_2016_2018():

    # Download latest version
    path = kagglehub.dataset_download("narendrabariha/e-commerce-target-sales-dataset")
    
    print("Path to dataset files:", path)
    
    
    
def get_locations(location_name:str , country:str):
    api_key = os.getenv("Key")
    print(api_key)
    params = {
        "engine": "google_local",
        "q": f"{location_name}",
        "location": f"{country}",
        "api_key": api_key,
        # "start":40, make errors
    }
    
    search = GoogleSearch(params)
    results = search.get_dict()
    local_results = results["local_results"] 
    return local_results
    
    
    
    
def get_stock_price(company:str):
    api_key = os.getenv("Key")
    print(api_key)
    q =  f"{company} stock price"
    if company.startswith("car"):
        q = "carrefour stock symbol"

    params = {
        "engine": "google",
        "q": q,
        "api_key": api_key,
        "output":"json",
        "no_cache":False
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    print(results)
    answer_box = results["answer_box"]
    financials = results["knowledge_graph"]["financials"]
    return [financials , answer_box , answer_box["price_movement"]]
    
    #Deprecated
    
    # replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
    #     url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={company}&apikey={api_key}"
    #     r = requests.get(url)
    #     data = r.json()
    #     
    #     print(data)
    #     return data
import kagglehub
from serpapi import GoogleSearch

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
    
    
    
def get_locations(location_name:str , country:str , language:str):
    params = {
        "engine": "google",
        "q": "Coffee",
        "api_key": "fe1f5b2f75661d67a7d7a3381a6a9b45c65281def54fbe204a6655ab5c9acf92"
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    organic_results = results["organic_results"]
    
    
    
    
def get_stock_price():
    params = {
        "engine": "google",
        "q": "Coffee",
        "api_key": "fe1f5b2f75661d67a7d7a3381a6a9b45c65281def54fbe204a6655ab5c9acf92"
    }
    
    search = GoogleSearch(params)
    results = search.get_dict()
    organic_results = results["organic_results"]
import kagglehub
from serpapi import GoogleSearch
from dotenv import load_dotenv
import os


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
    price_movement = answer_box["price_movement"]
    return [financials , answer_box , price_movement]
    
    #Deprecated
    
    # replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
    #     url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={company}&apikey={api_key}"
    #     r = requests.get(url)
    #     data = r.json()
    #     
    #     print(data)
    #     return data


def format_month_year(value:str) -> str:
    x = value.split()[0].lower()
    y = value.split()[1]
    return x+'_'+y
def convert_to_real_value(value:str)->int:
    print(value[ :-1])
    x = 0
    if value.endswith("M"):
        x = float(value[ :-1])*(10**6)
    elif  value.endswith("B"):
        x = float(value[ :-1])*(10**9)
    elif value.endswith("T"):
            x = float(value[ :-1])*(10**12)
    return x

def get_and_parse_stock_price(company:str)->dict:
    dict = {}
    unparsed_out = get_stock_price(company)
    year_and_month = format_month_year(unparsed_out[0]['quarterly_financials'][0]["table"][0][1])  #Nov 2024 -> nov_2024
    print(year_and_month)
    dict["revenue"] = convert_to_real_value(unparsed_out[0]['quarterly_financials'][0]["formatted"][0][year_and_month])
    dict["net_income"] = convert_to_real_value(unparsed_out[0]['quarterly_financials'][0]["formatted"][1][year_and_month])
    dict["currency"]= unparsed_out[1]['currency']
    dict["stock"] = unparsed_out[1]['stock']
    dict["stock_price"] = unparsed_out[1]['price']
    dict["stock_price_movement_status"] = unparsed_out[2]['movement'].lower()
    dict["stock_price_movement"] = unparsed_out[2]['price']
    dict["exchange"] = unparsed_out[1]['exchange']
    dict["market_cap_value"] = unparsed_out[1]['table'][3]['value']
    dict["corp_title"] = unparsed_out[1]['title']
    return dict
    




def get_and_parse_locations(location_name: str, country: str) -> dict:
    locations_list = get_locations(location_name, country)
    x = {}
    counter = 0
    for a_dict in locations_list:
        try:
            x[counter] = {
                "delivery": True,
                "title": a_dict.get("title", f"{location_name}"),
                "company": a_dict.get("place_id_search", "").split("=")[-1] if "place_id_search" in a_dict else "",
                "lat": a_dict["gps_coordinates"].get("latitude", 0.0),
                "lon": a_dict["gps_coordinates"].get("longitude", 0.0),
                "id": a_dict.get("place_id", f"'{location_name}'+'_'+'{counter}'"),
            }
            counter += 1
            # print(f"{x} \n")
        except KeyError as e:
            print(f"KeyError: {e} in {a_dict}")
    return x
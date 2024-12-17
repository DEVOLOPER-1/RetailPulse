import sqlite3
from sqlalchemy import create_engine
import pandas as pd

def create_db()->sqlite3.Connection:
    connection = sqlite3.connect("all_markets_data.db")
    return connection


def create_table(query:str):
    conn = create_db()
    cursor = conn.cursor()
    cursor.execute(query)
    cursor.close()
    

locations_table_q = """CREATE TABLE LOCATIONS (
    title TEXT, 
    company TEXT, 
    lat FLOAT, 
    lon FLOAT, 
    ID TEXT PRIMARY KEY, 
    delivery INTEGER
)"""

finances_table_q = """CREATE TABLE FINANCES (revenue FLOAT , net_income FLOAT , stock TEXT , currency TEXT
 , stock_price FLOAT , stock_price_movement_status TEXT, stock_price_movement FLOAT , market_cap_value INTEGER ,exchange TEXT ,corp_title TEXT)"""

# create_table(locations_table_q)
# create_table(finances_table_q)



def execute_query(query:str ):
    conn = create_db()
    cursor = conn.cursor()
    
    cursor.execute(query)

    conn.commit()
    cursor.close()
    conn.close()




def finances_query_builder(values:dict , mode:str = "insertion" or "update")->str:
    q = ""
    if mode.lower().startswith("ins"):    
        q = f""" INSERT INTO FINANCES (revenue, net_income, stock, currency, stock_price, stock_price_movement_status, stock_price_movement, market_cap_value, exchange, corp_title)
            VALUES (
            {values["revenue"]} , '{values["net_income"]}' , '{values["stock"]}' ,
            '{values["currency"]}' , {values["stock_price"]} , '{values["stock_price_movement_status"]}' ,
            {values["stock_price_movement"]} , {values["market_cap_value"]} , '{values["exchange"]}' , '{values["corp_title"]}'
            )
    
        """
    elif mode.lower().startswith("upd"):
        q = f"""
        UPDATE FINANCES
        SET 
            revenue = {values["revenue"]},
            net_income = {values["net_income"]},
            currency = '{values["currency"]}',
            stock_price = {values["stock_price"]},
            stock_price_movement_status = '{values["stock_price_movement_status"]}',
            stock_price_movement = {values["stock_price_movement"]},
            market_cap_value = {values["market_cap_value"]},
            exchange = '{values["exchange"]}',
            corp_title = '{values["corp_title"]}'
        WHERE stock = '{values["stock"]}'
        """
    return q


def locations_query_builder(values:dict)->str:
    q = ""
    q = f""" INSERT INTO LOCATIONS (title, company, lat, lon, ID, delivery)
        VALUES (
        '{values["title"].replace("'", "")}' , '{values["company"]}' , {values["lat"]} ,
        {values["lon"]} , '{values["id"]}' , {values["delivery"]})

    """

    return q

def retrieve_table(table_name:str , db_url:str)->dict:
    # db_url = "sqlite://all_markets_data.db"
    # engine = create_engine(db_url , echo=True)
    df = pd.read_sql_table(table_name, db_url)
    return df.to_dict()
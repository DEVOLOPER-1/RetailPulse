import sqlite3

import sqlalchemy
from adodbapi import Cursor
from sqlalchemy import create_engine , text , Connection
from sqlalchemy.exc import SQLAlchemyError
import pandas as pd
import os

def create_db()->sqlite3.Connection:
    db_path = "all_markets_data.db"
    connection = sqlite3.connect(db_path)
    print("Connection Established" , connection)
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
        q = f""" INSERT INTO FINANCES (revenue, net_income, stock, currency, stock_price, stock_price_movement_status, stock_price_movement, market_cap_value, exchange)
            VALUES (
            {values["revenue"]} , '{values["net_income"]}' , '{values["stock"]}' ,
            '{values["currency"]}' , {values["stock_price"]} , '{values["stock_price_movement_status"]}' ,
            {values["stock_price_movement"]} , {values["market_cap_value"]} , '{values["exchange"]}' 
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
            exchange = '{values["exchange"]}'
            
        WHERE stock = '{values["stock"]}'
        """
    print(q)
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


def MountingScrappingServer()->sqlalchemy.engine.Engine:
    path = r"sqlite:///all_markets_data.db"
    my_conn = create_engine(path)
    print(f"Scrapping Server Connection Established -> {my_conn}")
    return my_conn
def execute_query_return_results(SqlQuery: str, conn: sqlalchemy.engine.Engine, return_results: bool = True):
    try:
        with conn.begin() as transaction:  # Use transaction context
            with conn.connect() as connection:
                result = connection.execute(text(SqlQuery))
                if return_results:
                    result_str = result.scalar()
                    return result_str
        print("Query executed and committed successfully.")
    except SQLAlchemyError as e:
        print(f"Error executing query: {e}")
        transaction.rollback()  # Rollback on error
        raise
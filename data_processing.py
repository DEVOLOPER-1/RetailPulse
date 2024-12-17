import sqlite3

from adodbapi import Cursor


def create_db():
    connection = sqlite3.connect("all_markets_data.db")
    return connection


def create_table(query:str):
    conn = create_db()
    cursor = conn.cursor()
    cursor.execute(query)
    cursor.close()
    

locations_table_q = """CREATE TABLE LOCATIONS (title TEXT, company TEXT, lat DECIMAL(5, 6), lon DECIMAL(5, 6))"""
finances_table_q = """CREATE TABLE FINANCES (revenue INTEGER , net_income INTEGER , stock TEXT , currency TEXT
 , stock_price FLOAT , stock_price_movement_status TEXT, stock_price_movement FLOAT , market_cap_value INTEGER ,exchange TEXT)"""
create_table(locations_table_q)
create_table(finances_table_q)

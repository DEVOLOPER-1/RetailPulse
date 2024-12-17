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
 , stock_price FLOAT , stock_price_movement_status TEXT, stock_price_movement FLOAT , market_cap_value INTEGER ,exchange TEXT ,corp_title TEXT)"""

# create_table(locations_table_q)
# create_table(finances_table_q)



def update_data(query:str ,conn:sqlite3.Connection , cursor = sqlite3.Cursor):
    # conn = sqlite3.connect('example.db')
    # cursor = conn.cursor()
    
    # Update age of user 'Alice'
    # cursor.execute('UPDATE users SET age = ? WHERE name = ?', (31, 'Alice'))
    cursor.execute(query)

    conn.commit()
    cursor.close()
    conn.close()



def insert_or_update(query:str , operation_mode:str = "insert" or "update"):
    conn = create_db()
    cursor = conn.cursor()
    if operation_mode.startswith("up"):
        update_data(query , conn ,cursor)
        return 
    # Example data to insert
    locations_data = [
        ("Walmart Supercenter", "Walmart", 36.7783, -119.4179),
        ("Carrefour Market", "Carrefour", 48.8566, 2.3522)
    ]

    finances_data = [
        (25670000000, 854000000, "TGT", "USD", 132.45, "Down", 2.07, 60690000000, "NYSE")
    ]

    # Insert data into LOCATIONS table
    cursor.executemany("""
        INSERT INTO LOCATIONS (title, company, lat, lon) 
        VALUES (?, ?, ?, ?)
    """, locations_data)

    # Insert data into FINANCES table
    cursor.executemany("""
        INSERT INTO FINANCES (revenue, net_income, stock, currency, stock_price, stock_price_movement_status, stock_price_movement, market_cap_value, exchange) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, finances_data)

    conn.commit()
    cursor.close()
    conn.close()
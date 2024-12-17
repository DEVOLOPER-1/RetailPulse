from scrapping import *
from data_processing import*


# download_walmart_2010_2012()
# download_walmart_stock_data_2024()
# download_carrefour_online_sales_2020_2021()
# download_target_market_sales_2016_2018()


# Walmart_locations_list = get_locations("Walmart" , "United States")
# carrefour_locations_list = get_locations("Carrefour" , "United States")
# target_locations_list = get_locations("Target Market" , "United States")

walmart_stock_price = get_and_parse_stock_price("Walmart")
# carrefour_stock_price = get_and_parse_stock_price("carrefour")
# target_market_stock_price = get_and_parse_stock_price("Target")



print( walmart_stock_price)

# INSERTION INTO DB
# q = """INSERT INTO  FINANCES (revenue , net_income , stock , currency , stock_price , stock_price_movement_status , stock_price_movement , market_cap_value , exchange)
#         VALUES ()
# """
# insert_or_update()

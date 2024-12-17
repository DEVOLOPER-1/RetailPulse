from scrapping import *

# download_walmart_2010_2012()
# download_walmart_stock_data_2024()
# download_carrefour_online_sales_2020_2021()
# download_target_market_sales_2016_2018()


# Walmart_locations_list = get_locations("Walmart" , "United States")
# carrefour_locations_list = get_locations("Carrefour" , "United States")
# target_locations_list = get_locations("Target Market" , "United States")

# walmart_stock_price = get_stock_price("Walmart")[0]
# carrefour_stock_price = get_stock_price("carrefour")[1]
target_market_stock_price = get_stock_price("Target")



print(target_market_stock_price)
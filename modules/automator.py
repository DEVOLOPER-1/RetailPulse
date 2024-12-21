from modules.scrapping import *
from modules.data_processing import *


def download_all_possible_data():
    download_walmart_2010_2012()
    download_walmart_stock_data_2024()
    download_carrefour_online_sales_2020_2021()
    download_target_market_sales_2016_2018()


def build_finances(is_it_first_time:bool = False):
    walmart_finances = get_and_parse_stock_price("Walmart Inc" , using="yfinance")
    carrefour_finances = get_and_parse_stock_price("Carrefour S A F Sponsored France ADR" , using="yfinance")
    target_market_finances = get_and_parse_stock_price("Target Corp" , using="yfinance")
    # Connection = MountingScrappingServer()
    for single_dict in [walmart_finances , carrefour_finances , target_market_finances]:
        if is_it_first_time:
            execute_query(finances_query_builder(single_dict, mode="insert"))
        elif not is_it_first_time:
            execute_query(finances_query_builder(single_dict, mode="UPDATE"))
def build_locations():
    Walmart_locations_list = get_and_parse_locations("Walmart" , "United States")
    carrefour_locations_list = get_and_parse_locations("Carrefour" , "United States")
    target_locations_list = get_and_parse_locations("Target Market" , "United States")
    for single_list in [Walmart_locations_list , carrefour_locations_list , target_locations_list]:
        print(single_list)
        for single_dict in single_list.values():
            print(single_dict)
            execute_query( locations_query_builder( single_dict ) )


# build_locations()

intiated_prchases_df = False

def get_purchase_table():
    if not intiated_prchases_df:
        return make_df_from_table_name("PURCHASES")
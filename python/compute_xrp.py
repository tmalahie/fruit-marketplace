import sys
import json

unit_price_eur = float(sys.argv[1])
quantity = int(sys.argv[2])
unit_price_xrp = unit_price_eur*0.518
total_price_xrp = unit_price_xrp*quantity
print(round(total_price_xrp,2))
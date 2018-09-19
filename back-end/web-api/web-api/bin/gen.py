from random import *
from datetime import *

#                     year, month, day
start_date = datetime(2018, 7, 1)
num_of_days = 100
min_sales_per_day = 5
max_sales_per_day = 10
max_quantity = 10

# Clear Sales File:
sales_file = open("sales.csv", "w")
sales_file.close();

# Get all the id' from inventory file:
item_ids = []
inv_file = open("inventory.csv", "r")
for line in inv_file:
	values = line.split(",")
	item_ids.append(values[0])
inv_file.close();	

next_sale_id = 1
next_group_id = 1
def generate_sale(num_items, date, time):
	global next_sale_id
	global next_group_id
	group_id = next_group_id
	next_group_id += 1
	sales_file = open("sales.csv", "a")
	for i in range(0, randrange(1, num_items)):
		sale_id = next_sale_id
		next_sale_id += 1
		item_id = item_ids[randrange(0, len(item_ids))]
		quantity = randrange(1, max_quantity)
		sales_file.write(str(sale_id) + "," + str(group_id) + "," + str(item_id) + "," + str(quantity) + "," + str(date) + "," + str(time) + "\n")
	sales_file.close();

date = start_date
for i in range(0, num_of_days):
	date += timedelta(days=1)
	date_str = date.strftime("%d/%m/%Y")
	for j in range(0, randrange(min_sales_per_day, max_sales_per_day)):
		hours = 8 + randrange(0, 9)
		if hours >= 13:
			hours -= 12
		time_str = str(hours) + ":" + str(randrange(0, 5)) + str(randrange(0, 9))
		generate_sale(5, date_str, time_str)

from workbench import Workbench

CONFIG = {
    "host":  'localhost',
    "user": 'muleyashutosh',
    "port": '3306',
    "password": 'Ashu@12345',
    "database": 'sample'
}

db = Workbench(**CONFIG)
db.insert_into('product', {
    "product_name": "ASUS",
    "supplier_name": "ECart",
    "unit_price": 50000
})
# columns = ['product_name', 'supplier_name', 'unit_price']
# vals = ['ASUS', 'ECart', 50000]
# tablename = 'product'
# print(("%s, " * (len(columns)-1)) + "%s")

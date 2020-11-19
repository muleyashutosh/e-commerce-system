from pandas import read_excel
usecols=['prodName', 'prodDesc', 'minPrice', 'img', 'rating', 'unitStock', 'categoryID']
excel_data = read_excel('Example19.xlsx', usecols=usecols)
print(excel_data.columns.ravel())

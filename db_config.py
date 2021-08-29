import os
from dotenv import load_dotenv

load_dotenv()

CONFIG = {
    "host":  os.getenv('mysql-host'),
    "user": os.getenv('mysql-user'),
    "port": os.getenv('mysql-port'),
    "password": os.getenv('mysql-password'),
    "database": os.getenv('mysql-database')
}

# print(CONFIG)

# mysql-database = "b8aglplfcrplneriinhm"
# mysql-host = "b8aglplfcrplneriinhm-mysql.services.clever-cloud.com"
# mysql-password = "5xNfpljjVoU0c6z32ljA"
# mysql-port = "3306"
# MYSQL_ADDON_URI = "mysql://uygnkepsgtpfxcep:5xNfpljjVoU0c6z32ljA@b8aglplfcrplneriinhm-mysql.services.clever-cloud.com:3306/b8aglplfcrplneriinhm"
# mysql-user = "uygnkepsgtpfxcep"
# MYSQL_ADDON_VERSION = "8.0"

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

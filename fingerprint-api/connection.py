import pymongo
from pymongo import MongoClient

connection = MongoClient('mongodb://localhost:27017/')
database = connection['users']
User = database['users']
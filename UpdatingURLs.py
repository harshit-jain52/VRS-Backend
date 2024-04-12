import string

import numpy as np
import pandas as pd
import pymongo
from tqdm import tqdm

MONGODB_URI = "mongodb+srv://new-user:yaZKSWYH23CYEpPr@cluster0.ex7zvzp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = pymongo.MongoClient(MONGODB_URI)

dset = client["test"]["movies"]
x = dset.find()
# print(dset)

dset2 = client["test"]["moviescopy"]

import movieposters

for i in tqdm(x):
    try:
        poster = movieposters.get_poster(i["name"])
        i["poster_url"] = poster
    except:
        print(i["name"])
    dset.update_one({"_id": i["_id"]}, {"$set": i})

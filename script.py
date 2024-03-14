import json
import requests

with open("movies.json", "r") as json_file:
    json_array = json.load(json_file)
    for d in json_array:
        del d["_id"]
        d["rating"] = d["ratingValue"]
        del d["ratingValue"]
        del d["ratingCount"]
        del d["certificate"]
        d["stock"] = 10
        url = "http://localhost:9000/api/videos"
        res = requests.post(url, json=d)
        print(res.text)

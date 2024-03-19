import json
import requests

with open("movies.json", "r") as json_file:
    json_array = json.load(json_file)
    for d in json_array:
        del d["_id"]
        d["rating"] = float(d["ratingValue"])
        del d["ratingValue"]
        del d["ratingCount"]
        del d["certificate"]
        d["stock"] = 10
        d["buy_price"] = 120.50
        d["rent_price"] = 50.50
        for i in range(len(d["genre"])):
            d["genre"][i] = d["genre"][i].strip().lower()
        d["genre"] = list(set(d["genre"]))

        url = "http://localhost:9000/api/videos"
        res = requests.post(url, json=d)
        print(res.text)

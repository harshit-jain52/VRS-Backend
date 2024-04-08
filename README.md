## Backend for Video-Rental-System

https://data.world/studentoflife/imdb-top-250-lists-and-5000-or-so-data-records?ref=hackernoon.com > take IMDBdata_MainData.csv

#### Create .env file:

- PORT=9000
- MONGODB_URI= URI for MongoDB cluster, with username and password
- SECRET= secret key involved in jwt token generation & authentication
- RZP_KEY_ID= Razorpay API key ID
- RZP_KEY_SECRET= Razorpay API key secret

#### Setting up React App:

- `npm install`

#### Setting up python environment:

- `python3 -m venv pyenv`
- `source pyenv/bin/activate`
- `pip install -r pymodules.txt`

#### Before pushing, update the list of dependencies:

- `pip freeze > pymodules.txt`

#### Exit the environment:

- `deactivate`

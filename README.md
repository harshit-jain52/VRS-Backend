# Video Rental System (VRS) Backend

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software.

- Node.js
- npm
- MongoDB

### Installing

A step by step series of examples that tell you how to get a development environment running.

1. Clone the repo: `git clone https://github.com/harshit-jain52/VRS-Backend`
2. Move to the project directory: `cd VRS-Backend`
3. Install dependencies: `npm install`
4. Set up python environment:
   ```bash
   python3 -m venv pyenv
   source pyenv/bin/activate
   pip install -r pymodules.txt
   ```

#### Setting up the .env file

After setting up the development server, you need to create a `.env` file in the root directory of the project to store environment variables:

1. Create a new file named `.env` in the root directory of the project.
2. Add the following lines to the `.env` file:

```env
   PORT=9000
   REACT_PORT=3000
   PYTHON_PORT=5000
   MONGODB_URI=<your_mongodb_uri>
   SECRET=<your_jwt_secret_key>
   RZP_KEY_ID=<your_razorpay_key_id>
   RZP_KEY_SECRET=<your_razorpay_key_secret>
   EMAIL=<your_email>
   APP_PASS_EMAIL=<your_app_password_for_email>
```

### Start the Server

The servers will start on the port specified in the .env file.

1. Node API: `npm start`
2. Python API: `python3 movieRec.py`

## Setting Up Testing Environment

To set up the testing environment, you need to create a `.env.test` file in the `tests` directory of the project. This file should contain the environment variables that are required for running the tests. Here's an example of what the `.env.test` file might look like:

```env
TEST_MOVIE_ID=6607cbf909986a6dbf5bcb0b
TEST_GENRE=sci-fi
TEST_MOVIE_NAME=Inception
TEST_NEW_MOVIE_NAME=Inception2
TEST_CUSTOMER_USERNAME=testCustomer#789
TEST_CUSTOMER_PASSWORD=passwd#789
TEST_CUSTOMER_NAME=TestCustomer#789
TEST_CUSTOMER_EMAIL=testCustomer@testmail.com
TEST_CUSTOMER_PHONE=7897897890
TEST_CUSTOMER_ADDRESS=TestAddress#789
MANAGER_USERNAME=<your_manager_username>
MANAGER_PASSWORD=<your_manager_password>
TEST_STAFF_USERNAME=testStaff#789
TEST_STAFF_PASSWORD=passwd#789
TEST_STAFF_NAME=TestStaff#789
TEST_STAFF_EMAIL=testStaff@testmail.com
TEST_STAFF_PHONE=7897897890
```

### Running Tests

To run the tests, use the following command: `npm test`

### Important Note

Please note that the tests and the development server should not be run simultaneously on the same machine, as they use the same port numbers. If you need to run the tests while the development server is running, please ensure to change the port numbers in either the `.env` or `.env.test` file to avoid conflicts.

## Frontend

For the frontend code, please refer to the [VRS Frontend repository](https://github.com/Cath3dr4l/VRS-Frontend).

## Movies Data

https://data.world/studentoflife/imdb-top-250-lists-and-5000-or-so-data-records?ref=hackernoon.com > take _IMDBdata_MainData.csv_

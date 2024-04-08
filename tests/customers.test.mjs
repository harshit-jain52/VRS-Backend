import * as chai from "chai";
import supertest from "supertest";
import { app, eventEmitter } from "../server.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";
import testState from "./testState.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, ".env.test");
config({ path: envPath });

const should = chai.should();
const request = supertest(app);

describe("Customers", () => {
  let newCustomer = {
    username: process.env.TEST_CUSTOMER_USERNAME,
    password: process.env.TEST_CUSTOMER_PASSWORD,
    name: process.env.TEST_CUSTOMER_NAME,
    email: process.env.TEST_CUSTOMER_EMAIL,
    phone: process.env.TEST_CUSTOMER_PHONE,
    address: process.env.TEST_CUSTOMER_ADDRESS,
  };

  let token;
  let transactionID;

  let cart = [
    {
      id: process.env.TEST_MOVIE_ID,
      quantity: 1,
      duration: 1,
    },
  ];

  describe("signup", () => {
    it("should return 201 and a token", (done) => {
      request
        .post("/api/customers/signup")
        .send(newCustomer)
        .expect(201)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("username", newCustomer.username);
          res.body.should.have.property("token");
        })
        .end(done);
    });

    it("should return 400 and an error message when sign up fails", (done) => {
      request
        .post("/api/customers/signup")
        .send(newCustomer)
        .expect(400)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("error");
        })
        .end(done);
    });
  });

  describe("login", () => {
    it("should send a reset password mail to the customer", (done) => {
      request
        .post("/api/password/forgot")
        .send({ email: newCustomer.email })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("message", "Email Sent");
        })
        .end(done);
    });

    it("should return 200 and a token", (done) => {
      request
        .post("/api/customers/login")
        .send({
          username: newCustomer.username,
          password: newCustomer.password,
        })
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("username", newCustomer.username);
          res.body.should.have.property("token");
          token = res.body.token;
        })
        .end(done);
    });

    it("should return 401 and an error message for wrong password", (done) => {
      request
        .post("/api/customers/login")
        .send({
          username: newCustomer.username,
          password: "wrongPassword", // Send a wrong password
        })
        .expect(401)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("error");
        })
        .end(done);
    });
  });

  describe("auth", () => {
    it("should return 200 and a message for authorized user", (done) => {
      request
        .get("/api/customers/auth")
        .set("Authorization", `Bearer ${token}`) // Set the token in the Authorization header
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("message", "Authorized");
        })
        .end(done);
    });

    it("should return 401 for unauthorized user", (done) => {
      request
        .get("/api/customers/auth")
        .set("Authorization", `Bearer invalid_token`) // Set an invalid token in the Authorization header
        .expect(401)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("error", "Request is not authorized");
        })
        .end(done);
    });
  });

  describe("profile", () => {
    it("should return 200 and the customer profile", (done) => {
      request
        .get("/api/customers/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("username", newCustomer.username);
          res.body.should.have.property("name", newCustomer.name);
          res.body.should.have.property("email", newCustomer.email);
          res.body.should.have.property("phone", newCustomer.phone);
          res.body.should.have.property("address", newCustomer.address);
        })
        .end(done);
    });
  });

  describe("cart", () => {
    it("should return 200 and the customer's cart", (done) => {
      request
        .get("/api/customers/cart")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.be.an("array");
        })
        .end(done);
    });

    it("should return 200 and the updated cart", function (done) {
      this.timeout(10000);
      request
        .put("/api/customers/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ cart: cart })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.be.an("array");
          res.body.forEach((item, index) => {
            item.should.have.property("id", cart[index].id);
            item.should.have.property("quantity", cart[index].quantity);
            item.should.have.property("duration", cart[index].duration);
          });
        })
        .end(done);
    });
  });

  describe("orders", () => {
    it("should return 200 and the customer's orders", (done) => {
      request
        .get("/api/customers/order")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.be.an("array");
          res.body.forEach((order) => {
            order.should.have.property("movieID");
            order.should.have.property("quantity");
            order.should.have.property("duration");
            order.should.have.property("status");
            order.should.have.property("price");
            order.should.have.property("createdAt");
            order.should.have.property("updatedAt");
          });
        })
        .end(done);
    });

    it("should return 200 and the transaction details", (done) => {
      request
        .post("/api/payment/checkout")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100 })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("transaction");
          res.body.should.have.property("payment");
          res.body.transaction.should.have.property("customerID");
          res.body.transaction.should.have.property("amount");
          res.body.transaction.should.have.property("transactionID");
          transactionID = res.body.transaction.transactionID;
        })
        .end(done);
    });

    it("should return 200 and the payment success message", (done) => {
      request
        .put("/api/payment/success")
        .send({
          razorpay_payment_id: "payment_id",
          razorpay_order_id: transactionID,
          razorpay_signature: "signature",
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("message", "Payment successful");
        })
        .end(done);
    });

    it("should return 400 and an error message for invalid transaction", (done) => {
      request
        .put("/api/payment/success")
        .send({
          razorpay_payment_id: "payment_id",
          razorpay_order_id: "invalid_id",
          razorpay_signature: "signature",
        })
        .expect(400)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("message", "Invalid transaction");
        })
        .end(done);
    });

    it("should return 200 and the new order", (done) => {
      request
        .post("/api/customers/order")
        .set("Authorization", `Bearer ${token}`)
        .send({
          movieID: process.env.TEST_MOVIE_ID,
          quantity: 1,
          duration: 1,
          transactionID: transactionID,
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res) => {
          res.body.should.have.property("customerID");
          res.body.should.have.property("movieID");
          res.body.should.have.property("quantity");
          res.body.should.have.property("duration");
          res.body.should.have.property("status");
          res.body.should.have.property("price");
          res.body.should.have.property("transactionID");
          res.body.should.have.property("_id");
          testState.orderID = res.body._id;
        })
        .end(done);
    });
  });
});

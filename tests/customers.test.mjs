import * as chai from "chai";
import supertest from "supertest";
import { app, eventEmitter } from "../server.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";
import Customer from "../models/customerModel.js";

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

  after(async () => {
    await Customer.deleteOne({ username: newCustomer.username });
    console.log("Deleted test customer");
  });

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
  });
});

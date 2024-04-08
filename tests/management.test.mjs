import * as chai from "chai";
import supertest from "supertest";
import { app, eventEmitter } from "../server.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";
import Staff from "../models/staffModel.js";
import Customer from "../models/customerModel.js";
import testState from "./testState.mjs";
import Order from "../models/orderModel.js";
import Movie from "../models/movieModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, ".env.test");
config({ path: envPath });

const should = chai.should();
const request = supertest(app);

describe("Management", () => {
  let token;
  let staffToken;

  after(async () => {
    console.log("Cleaning up test data");
    await Staff.deleteOne({ username: process.env.TEST_STAFF_USERNAME });
    console.log("Deleted test staff");
    await Customer.deleteOne({ username: process.env.TEST_CUSTOMER_USERNAME });
    console.log("Deleted test customer");
    await Order.deleteOne({ _id: testState.orderID });
    console.log("Deleted test order");
    await Movie.deleteOne({ name: process.env.TEST_NEW_MOVIE_NAME });
    console.log("Deleted test movie");
  });

  describe("Manager", () => {
    describe("login", () => {
      it("should return 200 and a token", (done) => {
        request
          .post("/api/managers/login")
          .send({
            username: process.env.MANAGER_USERNAME,
            password: process.env.MANAGER_PASSWORD,
          })
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property(
              "username",
              process.env.MANAGER_USERNAME
            );
            res.body.should.have.property("token");
            token = res.body.token;
          })
          .end(done);
      });

      it("should return 401 and an error message for wrong password", (done) => {
        request
          .post("/api/managers/login")
          .send({
            username: process.env.MANAGER_USERNAME,
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
          .get("/api/managers/auth")
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
          .get("/api/managers/auth")
          .set("Authorization", `Bearer invalid_token`) // Set an invalid token in the Authorization header
          .expect(401)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property("error", "Request is not authorized");
          })
          .end(done);
      });
    });

    describe("manage staffs", () => {
      it("should return 200 and an array of staffs", (done) => {
        request
          .get("/api/managers/staffs")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.be.a("array");
            res.body.forEach((staff) => {
              staff.should.have.property("username");
              staff.should.have.property("name");
              staff.should.have.property("email");
              staff.should.have.property("phone");
            });
          })
          .end(done);
      });

      it("should return 200 and recruited staff details", (done) => {
        request
          .post("/api/managers/createstaff")
          .set("Authorization", `Bearer ${token}`)
          .send({
            username: process.env.TEST_STAFF_USERNAME,
            password: process.env.TEST_STAFF_PASSWORD,
            name: process.env.TEST_STAFF_NAME,
            email: process.env.TEST_STAFF_EMAIL,
            phone: process.env.TEST_STAFF_PHONE,
          })
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property(
              "username",
              process.env.TEST_STAFF_USERNAME
            );
            res.body.should.have.property("token");
          })
          .end(done);
      });
    });

    describe("manage customers", () => {
      it("should return 200 and an array of customers", (done) => {
        request
          .get("/api/managers/customers")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.be.a("array");
            res.body.forEach((customer) => {
              customer.should.have.property("username");
              customer.should.have.property("name");
              customer.should.have.property("email");
              customer.should.have.property("phone");
            });
          })
          .end(done);
      });
    });

    describe("manage movies", () => {
      it("should return 200 and an array of movies", function (done) {
        this.timeout(10000);
        request
          .get("/api/managers/movies")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.be.a("array");
            res.body.forEach((movie) => {
              movie.should.have.property("name");
              movie.name.should.be.a("string");
              movie.should.have.property("poster_url");
              movie.poster_url.should.be.a("string");
              movie.year?.should.be.a("string");
              movie.runtime?.should.be.a("string");
              movie.should.have.property("genre");
              movie.genre.should.be.a("array");
              movie.genre.every((genre) => genre.should.be.a("string"));
              movie.rating?.should.be.a("number");
              movie.summary_text?.should.be.a("string");
              movie.ImdbId?.should.be.a("string");
              movie.cast?.should.be.a("array");
              movie.cast?.every((cast) => cast.should.be.a("string"));
              movie.director?.should.be.a("string");
              movie.should.have.property("stock");
              movie.stock.should.be.a("number");
              movie.should.have.property("buy_price");
              movie.buy_price.should.be.a("number");
              movie.should.have.property("rent_price");
              movie.rent_price.should.be.a("number");
              movie.disabled?.should.be.a("boolean");
              movie.should.have.property("ordered");
              movie.ordered.should.be.a("array");
            });
          })
          .end(done);
      });

      it("should return 200 and the movie with specified id", (done) => {
        request
          .get(`/api/managers/movie/${process.env.TEST_MOVIE_ID}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property("name");
            res.body.name.should.be.a("string");
            res.body.should.have.property("poster_url");
            res.body.poster_url.should.be.a("string");
            res.body.year?.should.be.a("string");
            res.body.runtime?.should.be.a("string");
            res.body.should.have.property("genre");
            res.body.genre.should.be.a("array");
            res.body.genre.every((genre) => genre.should.be.a("string"));
            res.body.rating?.should.be.a("number");
            res.body.summary_text?.should.be.a("string");
            res.body.ImdbId?.should.be.a("string");
            res.body.cast?.should.be.a("array");
            res.body.cast.every((cast) => cast.should.be.a("string"));
            res.body.director?.should.be.a("string");
            res.body.should.have.property("stock");
            res.body.stock.should.be.a("number");
            res.body.should.have.property("buy_price");
            res.body.buy_price.should.be.a("number");
            res.body.should.have.property("rent_price");
            res.body.rent_price.should.be.a("number");
            res.body.disabled?.should.be.a("boolean");
            res.body.should.have.property("ordered");
            res.body.ordered.should.be.a("array");
          })
          .end(done);
      });

      it("should return 200 and the disabled movie", (done) => {
        request
          .put(`/api/managers/movie/disable/${process.env.TEST_MOVIE_ID}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property("disabled", true);
          })
          .end(done);
      });

      it("should return 200 and the updated movie", (done) => {
        request
          .put(`/api/managers/movie/${process.env.TEST_MOVIE_ID}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            disabled: false,
            stock: 50,
          })
          .expect(200)
          .expect("Content-Type", /json/)
          .end(done);
      });

      it("should return 200 and the added movie", (done) => {
        request
          .post("/api/managers/movie")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: process.env.TEST_NEW_MOVIE_NAME,
            poster_url: "https://example.com",
            year: "2021",
            runtime: "1h 30m",
            genre: ["Action", "Adventure"],
            rating: 5,
            summary_text: "A test movie",
            ImdbId: "tt1234567",
            cast: ["Test Actor"],
            director: "Test Director",
            stock: 100,
            buy_price: 10,
            rent_price: 5,
          })
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property(
              "name",
              process.env.TEST_NEW_MOVIE_NAME
            );
            res.body.should.have.property("poster_url", "https://example.com");
            res.body.should.have.property("year", "2021");
            res.body.should.have.property("runtime", "1h 30m");
            res.body.should.have.property("genre");
            res.body.genre.should.be.a("array");
            res.body.genre.every((genre) => genre.should.be.a("string"));
            res.body.should.have.property("rating", 5);
            res.body.should.have.property("summary_text", "A test movie");
            res.body.should.have.property("ImdbId", "tt1234567");
            res.body.should.have.property("cast");
            res.body.cast.should.be.a("array");
            res.body.cast.every((cast) => cast.should.be.a("string"));
            res.body.should.have.property("director", "Test Director");
            res.body.should.have.property("stock", 100);
            res.body.should.have.property("buy_price", 10);
            res.body.should.have.property("rent_price", 5);
          })
          .end(done);
      });
    });

    describe("manage orders", () => {
      it("should return 200 and an array of orders", (done) => {
        request
          .get("/api/managers/orders")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.be.a("array");
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
    });
  });

  describe("Staff", () => {
    describe("login", () => {
      it("should return 200 and a token", (done) => {
        request
          .post("/api/staffs/login")
          .send({
            username: process.env.TEST_STAFF_USERNAME,
            password: process.env.TEST_STAFF_PASSWORD,
          })
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property(
              "username",
              process.env.TEST_STAFF_USERNAME
            );
            res.body.should.have.property("token");
            staffToken = res.body.token;
          })
          .end(done);
      });

      it("should return 401 and an error message for wrong password", (done) => {
        request
          .post("/api/staffs/login")
          .send({
            username: process.env.TEST_STAFF_USERNAME,
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
          .get("/api/staffs/auth")
          .set("Authorization", `Bearer ${staffToken}`) // Set the token in the Authorization header
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property("message", "Authorized");
          })
          .end(done);
      });

      it("should return 401 for unauthorized user", (done) => {
        request
          .get("/api/staffs/auth")
          .set("Authorization", `Bearer invalid_token`) // Set an invalid token in the Authorization header
          .expect(401)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property("error", "Request is not authorized");
          })
          .end(done);
      });
    });

    describe("return order", () => {
      it("should return 200 and the updated order", (done) => {
        request
          .put(`/api/staffs/orders/${testState.orderID}`)
          .set("Authorization", `Bearer ${staffToken}`)
          .send({
            status: "returned",
          })
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res) => {
            res.body.should.have.property("status", "returned");
          })
          .end(done);
      });
    });

    describe("change stock", () => {
      it("should return 200 and the update movie", (done) => {
        request
          .put(`/api/staffs/movie/${process.env.TEST_MOVIE_ID}`)
          .set("Authorization", `Bearer ${staffToken}`)
          .send({ stock: 100 })
          .expect(200)
          .expect("Content-Type", /json/)
          .end(done);
      });
    });
  });
});

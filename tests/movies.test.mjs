import * as chai from "chai";
import supertest from "supertest";
import nock from "nock";
import { app, eventEmitter } from "../server.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, ".env.test");
config({ path: envPath });

const should = chai.should();
const request = supertest(app);

// Wait for the server to start
before(function (done) {
  eventEmitter.on("appStarted", () => {
    done();
  });
});

describe("Movies", () => {
  it("should return 200 and list all movies in the database", function (done) {
    this.timeout(10000);
    request
      .get("/api/movies")
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
          movie.cast.every((cast) => cast.should.be.a("string"));
          movie.director?.should.be.a("string");
          movie.should.have.property("stock");
          movie.stock.should.be.a("number");
          movie.should.have.property("buy_price");
          movie.buy_price.should.be.a("number");
          movie.should.have.property("rent_price");
          movie.rent_price.should.be.a("number");
          movie.disabled?.should.be.a("boolean");
          movie.should.not.have.property("__v");
          movie.should.not.have.property("createdAt");
          movie.should.not.have.property("updatedAt");
          movie.should.not.have.property("ordered");
        });
      })
      .end(done);
  });

  it("should return 404 and an error message for an invalid id", function (done) {
    request
      .get("/api/movies/invalid-id")
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.error.should.equal("No such movie found");
      })
      .end(done);
  });

  it("should return 404 and an error message for a non-existent id", function (done) {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    request
      .get(`/api/movies/${nonExistentId}`)
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.error.should.equal("No such movie found");
      })
      .end(done);
  });

  it("should return 200 and movie details for a valid existent id", function (done) {
    request
      .get(`/api/movies/${process.env.TEST_MOVIE_ID}`)
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
        res.body.should.not.have.property("__v");
        res.body.should.not.have.property("createdAt");
        res.body.should.not.have.property("updatedAt");
        res.body.should.not.have.property("ordered");
      })
      .end(done);
  });

  it("should return 200 and list all movies in the database by genre", function (done) {
    request
      .get(`/api/movies/genre/${process.env.TEST_GENRE}`)
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
          movie.genre.should.include(process.env.TEST_GENRE);
          movie.rating?.should.be.a("number");
          movie.summary_text?.should.be.a("string");
          movie.ImdbId?.should.be.a("string");
          movie.cast?.should.be.a("array");
          movie.cast.every((cast) => cast.should.be.a("string"));
          movie.director?.should.be.a("string");
          movie.should.have.property("stock");
          movie.stock.should.be.a("number");
          movie.should.have.property("buy_price");
          movie.buy_price.should.be.a("number");
          movie.should.have.property("rent_price");
          movie.rent_price.should.be.a("number");
          movie.disabled?.should.be.a("boolean");
          movie.should.not.have.property("__v");
          movie.should.not.have.property("createdAt");
          movie.should.not.have.property("updatedAt");
          movie.should.not.have.property("ordered");
        });
      })
      .end(done);
  });

  it("should return 200 and list recommended movies for a valid movie title", function (done) {
    this.timeout(4000);
    request
      .get(`/api/movies/recommend/${process.env.TEST_MOVIE_NAME}`)
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
          movie.cast.every((cast) => cast.should.be.a("string"));
          movie.director?.should.be.a("string");
          movie.should.have.property("stock");
          movie.stock.should.be.a("number");
          movie.should.have.property("buy_price");
          movie.buy_price.should.be.a("number");
          movie.should.have.property("rent_price");
          movie.rent_price.should.be.a("number");
          movie.disabled?.should.be.a("boolean");
          movie.should.not.have.property("__v");
          movie.should.not.have.property("createdAt");
          movie.should.not.have.property("updatedAt");
          movie.should.not.have.property("ordered");
        });
      })
      .end(done);
  });

  it("should return 500 and an error message when Python API request fails", function (done) {
    const title = "testTitle";

    // Intercept the request to the Python API and respond with an error
    nock(`http://localhost:${process.env.PYTHON_PORT}`)
      .get(`/recommend/${title}`)
      .replyWithError("Error");

    request
      .get(`/api/movies/recommend/${title}`)
      .expect(500)
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.error.should.equal("Error fetching data from Python API");
      })
      .end(done);
  });
});

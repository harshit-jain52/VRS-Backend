import * as chai from "chai";
import supertest from "supertest";
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
  it("should list all movies on /api/movies GET", function (done) {
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
        });
      })
      .end(done);
  });

  it("should return 400 and an error message for an invalid id", function (done) {
    request
      .get("/api/movies/invalid-id")
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.error.should.equal("No such movie found");
      })
      .end(done);
  });

  it("should return 400 and an error message for a non-existent id", function (done) {
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

  it("should return movie details for a valid id", function (done) {
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
      })
      .end(done);
  });
});

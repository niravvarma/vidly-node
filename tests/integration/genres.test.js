const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    //remove the data after tests run
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("return all genres", async () => {
      //Create a dummy collection
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("return single genre details if valid id is passed", async () => {
      const genre = new Genre({ name: "genre3" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with given id is passed", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // define happy path and then in each test, we change one parameter that clearly aligns
    // with the name of the test
    let token;
    let genreName;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: genreName });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      genreName = "Genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      genreName = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is more than 50 characters", async () => {
      genreName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "Genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "Genre1" });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Genre1");
    });
  });

  describe("PUT /", () => {
    let token;
    let genreName;
    let genreId;
    let genre;
    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({ name: genreName });
    };
    beforeEach(async () => {
      genre = new Genre({ name: "genre3" });
      await genre.save();
      genreId = genre._id;
      token = new User().generateAuthToken();
      genreName = "Genre1"; //updated name
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      genreName = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is more than 50 characters", async () => {
      genreName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if invalid id is passed", async () => {
      genreId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if id passed is not correct", async () => {
      genreId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should save the genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: genreName });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", genreName);
    });
  });

  describe("DELETE /", () => {
    let token;
    let genreId;
    let genre;
    let user;
    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + genreId)
        .set("x-auth-token", token);
    };
    beforeEach(async () => {
      user = new User({ _id: mongoose.Types.ObjectId(), isAdmin: true });
      genre = new Genre({ name: "genre3" });
      await genre.save();
      genreId = genre._id;
      token = user.generateAuthToken();
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 403 if client is logged in but not admin", async () => {
      user.isAdmin = false;
      token = user.generateAuthToken(); //because token contains info if the user is admin or not
      const res = await exec();
      expect(res.status).toBe(403);
    });
    it("should return 404 if invalid id is passed", async () => {
      genreId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should return 404 if id passed is not correct", async () => {
      genreId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should return null genre object if successfully deleted", async () => {
      await exec();
      const genreInDB = await Genre.findById(genreId).exec();
      expect(genreInDB).toBeNull();
    });
    it("should return genre object if successfully deleted", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});

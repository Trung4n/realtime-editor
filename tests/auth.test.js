import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import e from "cors";

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Auth API", () => {
  it("Testcase 1", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      username: "Tester",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
    // expect(res.body.token).toBeDefined();
  });

  it("Testcase 2", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("Testcase 3", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.token).toBeUndefined();
  });
  // validate format
  it("Testcase 4", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      username: "Tester",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid email");
  });
  it("Testcase 5", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "new@example.com",
      username: "Tester",
      password: "123", // too short
    });
  });
  it("Testcase 6", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "new2@example.com",
      // username: "Tester",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Username is required");
  });
  it("Testcase 7", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Password is required");
  });
  it("Testcase 8", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "emoji@example.com",
      username: "Tester🔥",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Username can only contain letters, numbers, and underscore"
    );
  });
  it("Testcase 9", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "emoji@example.com",
      username: "Tester        ",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe("Tester");
  });
  it("Testcase 10", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "emoji@example.com",
      username: "T        ",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Username must be between 3 and 20 characters long"
    );
  });

  // security tests
  it("Testcase 11", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "xss@example.com",
      username: "<script>alert('hack')</script>",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toMatch(
      "Username can only contain letters, numbers, and underscore"
    );
  });

  it("Testcase 12", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: { $gt: "" },
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
  });
  it("Testcase 13", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: { $ne: "test@example.com" },
        password: "123456",
      });
    expect(res.statusCode).toBe(400);
  });
});

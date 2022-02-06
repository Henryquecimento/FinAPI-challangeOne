import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

describe("Create User Controller", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a user if email already exists", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    });

    expect(response.status).toBe(400);
  });
});

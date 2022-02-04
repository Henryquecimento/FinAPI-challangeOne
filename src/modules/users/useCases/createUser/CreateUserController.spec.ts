import createConnection from "../../../../database/index";
import request from "supertest";
import { Connection } from "typeorm";

import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import { app } from "../../../../app";

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
});

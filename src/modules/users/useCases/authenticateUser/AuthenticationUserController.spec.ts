import createConnection from "../../../../database/index";
import request from "supertest";
import { Connection } from "typeorm";

import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(`INSERT INTO USERS(id, name, email, password, created_at, updated_at)
    values('${id}', 'admin', 'admin@admin.com', '${password}', now(), now())
  `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Shound be able to create user authentication", async () => {
    const responseSession = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com",
      password: "admin",
    });

    expect(responseSession.status).toBe(200);
    expect(responseSession.body).toHaveProperty("token");
    expect(responseSession.body.user.email).toEqual("admin@admin.com");
  });

  it("Shound not be able to authenticate user with incorrect email", async () => {
    const responseSession = await request(app).post("/api/v1/sessions").send({
      email: "incorrectAdmin@admin.com",
      password: "admin",
    });

    expect(responseSession.status).toBe(401);
  });

  it("Shound not be able to authenticate user with incorrect password", async () => {
    const responseSession = await request(app).post("/api/v1/sessions").send({
      email: "admin@admin.com",
      password: "incorrectPassword",
    });

    expect(responseSession.status).toBe(401);
  });
});

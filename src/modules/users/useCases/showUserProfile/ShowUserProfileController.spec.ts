import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
describe("Show User Profile Controller", () => {
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

  it("Should be able to show user profile", async () => {
    const responseSession = await request(app).post("/api/v1/sessions").send({
      name: "admin",
      email: "admin@admin.com",
      password: "admin",
    });

    const { token } = responseSession.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(responseSession.body.user.id);
  });
});

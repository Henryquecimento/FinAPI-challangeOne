import { OperationType } from "@modules/statements/enums/OperationType";
import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
describe("Create Statement Controller", () => {
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

  it("Should not be able to create an statement for a non-existing user", async () => {
    const responseSession = await request(app).post("/api/v1/deposit").send({
      name: "admin",
      email: "admin@admin.com",
      password: "admin",
    });

    const { token } = responseSession.body;

    const response = await request(app)
      .post("/api/v1/deposit")
      .send({
        user_id: "nonExistent_user_id",
        type: OperationType.DEPOSIT,
        amount: 800,
        description: "Add deposit test",
      })
      .set({
        Authentication: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });

  it("Should be able to create an statement of deposit type", async () => {
    const responseSession = await request(app).post("/api/v1/sessions").send({
      name: "admin",
      email: "admin@admin.com",
      password: "admin",
    });

    const { token } = responseSession.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 850.45,
        description: "Add deposit test",
      });

    expect(response.status).toBe(201);
  });

  it("Should be able to create an statement of withdraw type", async () => {
    const responseSession = await request(app).post("/api/v1/sessions").send({
      name: "admin",
      email: "admin@admin.com",
      password: "admin",
    });

    const { token } = responseSession.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 850.45,
        description: "Withdraw test",
      });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create an statement of withdraw type if funds is insufficient", async () => {
    const responseSession = await request(app).post("/api/v1/sessions").send({
      name: "admin",
      email: "admin@admin.com",
      password: "admin",
    });

    const { token } = responseSession.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 125.45,
        description: "Withdraw test",
      });

    expect(response.status).toEqual(400);
  });
});

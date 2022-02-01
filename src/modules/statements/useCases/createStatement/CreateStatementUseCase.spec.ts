import { OperationType } from "@modules/statements/enums/OperationType";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUsersUseCase: CreateUserUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create a Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUsersUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be able to make a deposit", async () => {
    const user = await createUsersUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Add test deposit",
    });

    expect(deposit).toHaveProperty("id");
    expect(deposit).toHaveProperty("type");
    expect(deposit).toHaveProperty("amount");
  });

  it("Should be able to make a withdraw", async () => {
    const user = await createUsersUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Add test deposit",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 550,
      description: "Withdraw test",
    });

    expect(withdraw).toHaveProperty("id");
    expect(withdraw).toHaveProperty("type");
    expect(withdraw).toHaveProperty("amount");
  });
});

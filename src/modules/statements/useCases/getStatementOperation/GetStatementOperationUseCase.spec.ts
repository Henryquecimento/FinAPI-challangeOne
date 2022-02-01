import { OperationType } from "@modules/statements/enums/OperationType";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUsersUseCase: CreateUserUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUsersUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be able to get a deposit statement operation", async () => {
    const user = await createUsersUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    const depositStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Add test deposit",
    });

    const operationStatement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: depositStatement.id,
    });

    expect(operationStatement).toHaveProperty("id");
  });

  it("Should be able to get a withdraw statement operation", async () => {
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

    const withdrawStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 850,
      description: "Withdraw test",
    });

    const operationStatement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: withdrawStatement.id,
    });

    expect(operationStatement).toHaveProperty("id");
  });
});

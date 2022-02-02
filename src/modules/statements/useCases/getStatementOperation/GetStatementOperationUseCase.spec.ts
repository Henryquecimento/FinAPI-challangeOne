import { OperationType } from "@modules/statements/enums/OperationType";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: depositStatement.id,
    });

    expect(statementOperation).toHaveProperty("id");
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: withdrawStatement.id,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("Should not be able to get a statement operation for non-existent user", async () => {
    expect(async () => {
      const depositStatement = await statementRepositoryInMemory.create({
        user_id: "nonExistent_user_id",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "Add test deposit",
      });

      if (!depositStatement.id) fail("Statement Id is probably undefined");

      await getStatementOperationUseCase.execute({
        user_id: "nonExistent_user_id",
        statement_id: depositStatement.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a non-existent statement operation from user", async () => {
    expect(async () => {
      const user = await createUsersUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      });

      if (!user.id) fail("User Id is probably undefined");

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "nonExistent_statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "test",
    });

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: "test",
    });

    expect(auth).toHaveProperty("token");
  });

  it("Should not be able to authenticate an user with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "test",
      });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrongPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});

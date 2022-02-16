import { inject, injectable } from "tsyringe";
import { OperationType } from "@modules/statements/enums/OperationType";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateTransferOperationError } from "./CreateTransferStatementError";
import { ICreateTransferStatementDTO } from "./ICreateTransferStatementDTO";

@injectable()
class CreateTransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    sender_id,
    receiver_id,
    amount,
    description,
  }: ICreateTransferStatementDTO) {
    const userSender = await this.usersRepository.findById(sender_id);
    const userReceiver = await this.usersRepository.findById(receiver_id);

    if (!userSender && !userReceiver)
      throw new CreateTransferOperationError.UserNotFound();

    if (sender_id === receiver_id)
      throw new CreateTransferOperationError.CanNotTrasferToYourself();

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (amount > balance)
      throw new CreateTransferOperationError.InsufficientFunds();

    await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    });
  }
}

export { CreateTransferStatementUseCase };

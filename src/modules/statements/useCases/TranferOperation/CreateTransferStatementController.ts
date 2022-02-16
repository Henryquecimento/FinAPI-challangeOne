import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";

class CreateTransferStatementController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { receiver_id } = request.params;

    const createTransferStatementUseCase = container.resolve(
      CreateTransferStatementUseCase
    );

    const transferStetement = await createTransferStatementUseCase.execute({
      sender_id,
      receiver_id,
      amount,
      description,
    });

    return response.json(transferStetement);
  }
}

export { CreateTransferStatementController };

import { AppError } from "@shared/errors/AppError";

export namespace CreateTransferOperationError {
  export class CanNotTrasferToYourself extends AppError {
    constructor() {
      super("You can not transfer to yourself", 400);
    }
  }

  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient Funds", 400);
    }
  }
}

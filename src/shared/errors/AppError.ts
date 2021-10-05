class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly stack: string;
  //constructor(message: string, statusCode: number);
  constructor(message: string, statusCode = 400, stack?: string) {
    this.message = message;
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    }
  }
}

export default AppError;

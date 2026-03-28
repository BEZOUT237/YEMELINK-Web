import { ValidationError } from 'express-validator';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const validateRequest = (errors: ValidationError[]) => {
  if (errors.length > 0) {
    const message = errors.map((e) => e.msg).join(', ');
    throw new ApiError(400, message);
  }
};

export const asyncHandler =
  (fn: Function) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

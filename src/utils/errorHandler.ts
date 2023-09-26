export default class AppError extends Error {
    error: boolean;
    isOperational: boolean;
    constructor(
        public statusCode: number = 500,
        public message: string
    ) {
        super(message);
        this.error = true;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

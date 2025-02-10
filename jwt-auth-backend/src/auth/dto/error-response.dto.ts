export class ErrorResponseDto {
    constructor(
      public statusCode: number,
      public message: string,
      public error?: string
    ) {}
  }
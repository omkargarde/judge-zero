class ApiResponse<T> {
  public message: string;
  public statusCode: number;
  public success: boolean;
  protected data: string;

  public constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = JSON.stringify(data);
    this.message = message;
    this.success = statusCode < 400;
  }
}
export { ApiResponse };

class ApiResponse<T> {
  public message: string;
  public statusCode: number;
  public success: boolean;
  protected data: string;
  /**
   * Constructs an ApiResponse instance.
   *
   * @param statusCode - HTTP status code of the response.
   * @param data - The data to be included in the response.
   * @param message - Optional message providing additional information about the response. Defaults to "Success".
   */
  public constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = JSON.stringify(data);
    this.message = message;
    this.success = statusCode < 400;
  }
}
export { ApiResponse };

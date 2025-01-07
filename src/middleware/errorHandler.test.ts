import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import errorHandler from './errorHandler'; 

describe('Error Handler Middleware', () => {
  const mockRequest = {} as Request; // Create a mock request object
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res); // Chainable mock for response status
    res.json = jest.fn().mockReturnValue(res); // Mock for response json
    return res;
  };
  const mockNext = jest.fn() as NextFunction;

  it('should respond with error message and status code', () => {
    const mockError = { statusCode: 404, message: 'Not Found' }; // Custom error object

    const res = mockResponse(); // Create a response object

    errorHandler(mockError, mockRequest, res, mockNext); // Call the error handler

    expect(res.status).toHaveBeenCalledWith(404); // Check for correct status code
    expect(res.json).toHaveBeenCalledWith({ message: 'Not Found' }); // Validate the error message
  });

  it('should respond with internal server error message for unspecified errors', () => {
    const mockError = { message: 'Some error occurred' }; // Error without a statusCode

    const res = mockResponse(); // Create a response object

    errorHandler(mockError, mockRequest, res, mockNext); // Call the error handler

    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR); // Default to 500
    expect(res.json).toHaveBeenCalledWith({ message: 'An error occurred on the server' }); // Default error message
  });
});
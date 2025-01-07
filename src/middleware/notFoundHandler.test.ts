import { Request, Response, NextFunction } from 'express';
import notFoundHandler from './notFoundHandler'; 
import NotFoundError from '../errors/notFoundError';

describe('NotFound Handler Middleware', () => {
  it('should call next with a NotFoundError', () => {
    const mockRequest = {} as Request; // Create a mock request object
    const mockResponse = {} as Response; // Create a mock response object
    const mockNext = jest.fn(); // Mock the next function

    notFoundHandler(mockRequest, mockResponse, mockNext); // Call the middleware

    expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError)); // Verify next was called with a NotFoundError
    expect(mockNext).toHaveBeenCalledWith(new NotFoundError('Page not found')); // Check for specific message
  });
});
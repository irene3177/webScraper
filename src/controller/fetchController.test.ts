import { Request, Response, NextFunction } from 'express';
import fetchController from './fetchController'; // Adjust the path as necessary
import { fetchAndProcessHtml } from '../services/htmlService'; // Adjust the path as necessary
import { createError } from '../utils/errorUtils';

jest.mock('../services/htmlService', () => ({
  fetchAndProcessHtml: jest.fn(),
}));

jest.mock('../utils/errorUtils', () => ({
  createError: jest.fn((message: string, statusCode: number) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }),
}));

describe('fetchUrl Controller', () => {
  const { fetchUrl } = fetchController;
  const mockRequest = (body: any) => ({ body } as Request);
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully process valid requests', async () => {
    const req = mockRequest({ targetUrl: 'http://example.com', linksLimit: 10 });
    const res = mockResponse();

    const processedResult = { links: ['http://example.com/page'], htmlFilePath: 'path/to/file' };
    (fetchAndProcessHtml as jest.Mock).mockResolvedValue(processedResult);

    await fetchUrl(req, res, mockNext);

    expect(fetchAndProcessHtml).toHaveBeenCalledWith('http://example.com', 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(processedResult);
  });

  it('should handle missing targetUrl', async () => {
    const req = mockRequest({ linksLimit: 10 });
    const res = mockResponse();

    await fetchUrl(req, res, mockNext);

    expect(createError).toHaveBeenCalledWith('Target URL is required', 400);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle invalid URL format', async () => {
    const req = mockRequest({ targetUrl: 'invalid-url', linksLimit: 5 });
    const res = mockResponse();

    await fetchUrl(req, res, mockNext);

    expect(createError).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle invalid linksLimit', async () => {
    const req = mockRequest({ targetUrl: 'http://example.com', linksLimit: 'invalid' });
    const res = mockResponse();

    await fetchUrl(req, res, mockNext);

    expect(createError).toHaveBeenCalledWith('linksLimit must be a non-negative integer', 400);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
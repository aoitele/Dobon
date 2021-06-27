import { NextApiRequest, NextApiResponse } from 'next'
import httpMocks from 'node-mocks-http'
import handler from '../../pages/api/hello'

describe("api/hello", () => {
    it('400', async() => {
        expect.assertions(1);
        const mockReq = httpMocks.createRequest<NextApiRequest>({
            query: {
                status: "400",
            }
        });
        const mockRes = httpMocks.createResponse<NextApiResponse>();

        handler(mockReq, mockRes);
        expect(mockRes.statusCode).toEqual(400);
    })

    it('302', async() => {
        expect.assertions(2);
        const mockReq = httpMocks.createRequest<NextApiRequest>({
            query: {
                status: "302",
            }
        });
        const mockRes = httpMocks.createResponse<NextApiResponse>();

        handler(mockReq, mockRes);
        expect(mockRes.statusCode).toEqual(302);
        expect(mockRes._getRedirectUrl()).toEqual("/redirect302");
    })

    it('200', async() => {
        expect.assertions(2);
        const mockReq = httpMocks.createRequest<NextApiRequest>({
            query: {
                status: "200",
            }
        });
        const mockRes = httpMocks.createResponse<NextApiResponse>();

        handler(mockReq, mockRes);
        expect(mockRes.statusCode).toEqual(200);
        expect(mockRes._getJSONData()).toEqual({ name: 'John Doe' });
    })
})
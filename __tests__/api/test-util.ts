import { NextApiRequest, NextApiResponse } from "next";

export function mockRequestResponse(method: string, body?: any, query?: any) {
  const req = {
    method,
    body,
    query,
  } as unknown as NextApiRequest;

  const resData: any = {};

  const res = {
    status(code: number) {
      resData.status = code;
      return this;
    },
    json(data: any) {
      resData.json = data;
      return resData;
    },
    end() {
      return resData;
    },
  } as unknown as NextApiResponse;
  return { req, res, resData };
}

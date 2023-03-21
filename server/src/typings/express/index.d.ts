declare global {
  namespace Express {
    interface Request {
      email: string;
    }
  }
}
export {};
// import * as Express from "express";

// declare module "Express" {
//   interface Request {
//     signedCookies?: unknown;
//   }
// }

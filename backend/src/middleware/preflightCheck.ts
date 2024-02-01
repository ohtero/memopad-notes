import { Request, Response, NextFunction } from 'express';

export default function checkPreflightOptions(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    console.log('preflight request detected');
    res.status(200).end();
  } else {
    next();
  }
}

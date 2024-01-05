import { NextFunction, Request, Response } from 'express';
import { pool } from '../..';

//* Handles connecting to db and connection error so it doesn't need to be separately defined in all db queries.
export async function connectToDb(req: Request, res: Response, next: NextFunction) {
  try {
    const client = await pool.connect();
    req.dbClient = client;
    next();
  } catch (err) {
    console.error('Failed db connection:', err);
    res.status(500).json('Could not connect to database.');
    return;
  }
}

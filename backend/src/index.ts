import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import { listRouter } from './routes/listRouter';
import { connectToDb } from './middleware/connectToDb';
import checkPreflightOptions from './middleware/preflightCheck';

const app = express();

dotenv.config();

const port = process.env.PORT || 4000;
const connectionString = process.env.PGHOST;

const { Pool } = pg;

export const pool = new Pool({
  connectionString: connectionString,
  max: 10,
  idleTimeoutMillis: 100000,
});

pool.on('error', (err) => {
  console.error(err);
  process.exit(-1);
});

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PATCH, DELETE',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(checkPreflightOptions);

app.use('/lists', connectToDb, listRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));

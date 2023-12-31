import { Request, Response } from 'express';
import { PoolClient } from 'pg';

declare module 'express' {
  interface Request {
    dbClient?: PoolClient;
  }
}

async function getAllLists(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  try {
    const listData = await client.query('SELECT * FROM lists');
    res.json(listData.rows);
  } catch (err) {
    res.json('Could not retrieve list data.').status(500);
    console.log('Could not send list data', err);
  } finally {
    client.release();
  }
}

async function getSingleListItem(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  const { listId } = req.body;
  try {
    const listData = await client.query(`SELECT list_item_id, list_item_value, completed FROM list_items WHERE list_id = ${listId}`);
    res.json(listData.rows);
  } catch (err) {
    console.log('Could not send list information', err);
  } finally {
    client.release();
  }
}

async function createNewList(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  try {
    const listData = await client.query('INSERT INTO lists (list_name) VALUES ($1) RETURNING *', ['Uusi lista']);
    res.json(listData.rows);
  } catch (err) {
    console.log('Could not create new list', err);
  } finally {
    client.release();
  }
}

async function deleteList(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  const { listId } = req.body;
  try {
    const listData = await client.query(`DELETE FROM lists WHERE (list_id) = ${listId} RETURNING *`);
    res.json(listData.rows).status(200);
  } catch (err) {
    console.error('Error when deleting list', err);
  } finally {
    client.release();
  }
}

async function addListItem(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  const { list_id, list_item_id, list_item_value, completed } = req.body;
  try {
    await client.query('INSERT INTO list_items (list_id, list_item_id, list_item_value, completed) VALUES ($1, $2, $3, $4)', [
      list_id,
      list_item_id,
      list_item_value,
      completed,
    ]);
    res.json('List saved').status(200);
  } catch (err) {
    console.error('Error saving list item', err);
  } finally {
    client.release();
  }
}

async function deleteListItem(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  const { list_item_id } = req.body;
  try {
    await client.query('DELETE FROM list_items WHERE (list_item_id) = ($1)', [list_item_id]);
    res.send().status(200);
  } catch (err) {
    console.error('Error deleting list item', err);
  } finally {
    client.release();
  }
}

async function updateListItem(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  const { list_item_id, list_item_value } = req.body;
  try {
    await client.query('UPDATE list_items SET list_item_value = ($2) WHERE (list_item_id) = ($1)', [list_item_id, list_item_value]);
    res.send().status(200);
  } catch (err) {
    console.error('Error updating list item', err);
  } finally {
    client.release();
  }
}

async function updateCompletionState(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  const { list_item_id, completed } = req.body;
  try {
    await client.query('UPDATE list_items SET completed = ($2) WHERE list_item_id = ($1)', [list_item_id, completed]);
    res.send().status(200);
  } catch (err) {
    console.log('Error updating list completion state: ', err);
    res.send().status(500);
  } finally {
    client.release();
  }
}

async function updateListName(req: Request, res: Response) {
  const client = req.dbClient as PoolClient;
  const { list_id, list_name } = req.body;
  try {
    await client.query('UPDATE lists SET list_name = ($2) WHERE (list_id) = ($1)', [list_id, list_name]);
    res.send().status(200);
  } catch (err) {
    console.error('Error updating list item', err);
    res.send().status(500);
  } finally {
    client.release();
  }
}

export {
  getAllLists,
  getSingleListItem,
  createNewList,
  deleteList,
  addListItem,
  deleteListItem,
  updateListItem,
  updateCompletionState,
  updateListName,
};

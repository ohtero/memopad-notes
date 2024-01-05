import express from 'express';
import {
  addListItem,
  createNewList,
  deleteList,
  deleteListItem,
  getAllLists,
  getSingleList,
  updateListItem,
  updateListName,
} from '../controllers/listController';

const listRouter = express.Router();

listRouter.get('/getAllLists', getAllLists);
listRouter.post('/singleList', getSingleList);
listRouter.post('/newList', createNewList);
listRouter.post('/deleteList', deleteList);
listRouter.post('/addListItem', addListItem);
listRouter.post('/deleteListItem', deleteListItem);
listRouter.post('/updateListItem', updateListItem);
listRouter.post('/updateListName', updateListName);

export { listRouter };

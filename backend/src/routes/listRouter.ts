import express from 'express';
import {
  addListItem,
  createNewList,
  deleteList,
  deleteListItem,
  getAllLists,
  getSingleListItem,
  updateCompletionState,
  updateListItem,
  updateListName,
} from '../controllers/listController';

const listRouter = express.Router();

listRouter.get('/getAllLists', getAllLists);
listRouter.post('/singleList', getSingleListItem);
listRouter.post('/newList', createNewList);
listRouter.post('/deleteList', deleteList);
listRouter.post('/addListItem', addListItem);
listRouter.post('/deleteListItem', deleteListItem);
listRouter.post('/updateListItem', updateListItem);
listRouter.post('/updateListName', updateListName);
listRouter.post('/updateCompletionState', updateCompletionState);

export { listRouter };

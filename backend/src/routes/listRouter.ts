import express from 'express';
import {
  addListItem,
  createNewList,
  deleteList,
  deleteListItem,
  getAllLists,
  getSingleList,
  updateCompletionState,
  updateListItem,
  updateListName,
  updateItemIndex,
} from '../controllers/listController';

const listRouter = express.Router();

listRouter.get('/', getAllLists);
listRouter.post('/', createNewList);
listRouter.get('/:list', getSingleList);
listRouter.delete('/:list', deleteList);
listRouter.patch('/:list', updateListName);
listRouter.post('/:list', addListItem);
listRouter.delete('/:list/:item', deleteListItem);
listRouter.patch('/:list/:item', updateListItem);
listRouter.patch('/:list/:item/order', updateItemIndex);
listRouter.patch('/:list/:item/:completion', updateCompletionState);

export { listRouter };

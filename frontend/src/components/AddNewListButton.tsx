import { useNavigate } from 'react-router-dom';
import { modifyRequest as newListRequest } from '../utils/modifyRequest';
import { MenuButton } from './UI/Button';

type AddNewListButtonProps = {
  handleClick: () => void;
};

type ListId = {
  list_id: number;
};

export default function AddNewListButton({ handleClick }: AddNewListButtonProps) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  async function createNewList() {
    const res = await newListRequest<ListId>(`${apiUrl}/lists`);
    if (!res.success) {
      console.log(res.error);
    }
    if (res.data) {
      const id = res.data.list_id;
      navigate(`/list/${id}`, { state: { listId: id, listName: 'Uusi lista', showInput: true } });
      handleClick();
    }
  }

  return <MenuButton handleClick={() => void createNewList()}>Add List</MenuButton>;
}

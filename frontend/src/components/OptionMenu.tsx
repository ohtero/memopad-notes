import styled from 'styled-components';
import { MenuButton } from './UI/Button';
import { useNavigate } from 'react-router-dom';
import { modifyRequest as newListRequest } from '../utils/modifyRequest';

type ListId = {
  list_id: number;
};

const apiUrl = import.meta.env.VITE_API_URL;

export function OptionMenu() {
  const navigate = useNavigate();

  async function createNewList() {
    const res = await newListRequest<ListId>(`${apiUrl}/lists`);
    if (!res.success) {
      console.log(res.error);
    }
    if (res.data) {
      const id = res.data.list_id;
      navigate(`/list/${id}`, { state: { listId: id, listName: 'Uusi lista', showInput: true } });
    }
  }

  return (
    <Menu>
      <MenuButton handleClick={() => navigate('/')}>My Lists</MenuButton>
      <MenuButton
        handleClick={() => {
          void createNewList();
        }}
      >
        Add List
      </MenuButton>
    </Menu>
  );
}

const Menu = styled.nav`
  height: fit-content;
  grid-row: list-footer-start / list-footer-end;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  // background: HSLA(${(props) => props.theme.colors.primary}, 1);
`;

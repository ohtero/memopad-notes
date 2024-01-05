import styled from 'styled-components';
import { MenuButton } from './UI/Button';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../utils/fetchData';
import { ListData } from '../types';
import { isList } from '../utils/typeGuard';
import { useListContext } from '../context/listContext';

export function OptionMenu() {
  const navigate = useNavigate();
  const { addListData } = useListContext();

  async function createNewList() {
    const options = {
      method: 'POST',
    };

    try {
      const data = await fetchData<ListData[]>('http://localhost:4000/lists/newList', options);
      if (data !== undefined && isList(data)) {
        const id = data[0].list_id;
        addListData(data);
        navigate(`/list/${id}`);
      }
    } catch (err) {
      console.error('Could not create new list: ', err);
    }
  }

  return (
    <Menu>
      <MenuButton handleClick={() => navigate('/')}>Listat</MenuButton>
      <MenuButton
        handleClick={() => {
          void createNewList();
        }}
      >
        Luo lista
      </MenuButton>
    </Menu>
  );
}

const Menu = styled.nav`
  grid-row: 2 / 3;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.menuBackground};
`;

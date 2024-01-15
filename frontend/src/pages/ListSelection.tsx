import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../utils/fetchData';
import { ListData } from '../types';
import { useListContext } from '../context/listContext';
import { isList } from '../utils/typeGuard';
import { Modal } from '../components/UI/Modal';
import { DeleteIcon } from '../assets/Icons';
import { MenuButton } from '../components/UI/Button';
import { Paragraph } from '../components/UI/Paragraph';

export type FocusedList = {
  listName: string;
  listId: number;
};

export function ListSelection() {
  const { listData, updateListData } = useListContext();
  const [listComponents, setListComponents] = useState<React.ReactNode[]>([]);
  const [focusedList, setFocusedList] = useState<FocusedList>({ listName: '', listId: 0 });

  const dialogRef = useRef<HTMLDialogElement>(null);

  const navigate = useNavigate();

  const navigateCallback = useCallback(
    (listId: number) => {
      navigate(`/list/${listId}`);
    },
    [navigate]
  );

  async function deleteTargetList(id: number) {
    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    };
    try {
      const data = await fetchData<ListData[]>(`http://localhost:4000/lists/${id}`, options);
      if (data !== undefined && isList(data)) {
        const newList = listData.filter((list: ListData) => list.list_id !== id);
        updateListData(newList);
      }
    } catch (err) {
      console.error('Could not delete list', err);
    }
  }

  useEffect(() => {
    function createListEntries(data: ListData[]) {
      const components = data.map(({ list_id, list_name }) => {
        return (
          <ListItem key={list_id}>
            <ListSelectorButton onClick={() => navigateCallback(list_id)}>{list_name}</ListSelectorButton>
            <ListDeleteButton
              onClick={() => {
                setFocusedList({ listName: list_name, listId: list_id });
                dialogRef.current?.showModal();
              }}
            >
              <DeleteIcon $dark height={'2rem'} />
            </ListDeleteButton>
          </ListItem>
        );
      });
      return components;
    }
    const entries = createListEntries(listData as ListData[]);
    setListComponents(entries);
  }, [listData, navigateCallback]);

  useEffect(() => {
    async function getLists() {
      try {
        const data = await fetchData<ListData[] | string>('http://localhost:4000/lists');
        if (data !== undefined && isList(data)) {
          updateListData(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    void getLists();
  }, [navigateCallback, updateListData]);

  return (
    <>
      <ListSelector>{listComponents}</ListSelector>
      <Modal ref={dialogRef}>
        <Paragraph>Haluatko poistaa listan</Paragraph>
        <Paragraph $bold>{focusedList.listName}?</Paragraph>
        <ButtonWrapper>
          <MenuButton
            handleClick={() => {
              void deleteTargetList(focusedList.listId);
              dialogRef.current?.close();
            }}
          >
            Poista
          </MenuButton>
          <MenuButton
            handleClick={() => {
              dialogRef.current?.close();
            }}
          >
            Peruuta
          </MenuButton>
        </ButtonWrapper>
      </Modal>
    </>
  );
}

export const ListSelector = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin-top: 0.5rem;
  gap: 0.75rem;
  list-style: none;
`;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  border: 0;
  border-radius: 5px;
  font-size: 1rem;
  background: ${(props) => props.theme.colors.secondary};
  box-shadow: ${(props) => props.theme.shadows.extraSmall};
  &:hover {
    background: ${(props) => props.theme.colors.highlight};
  }
`;

const ListSelectorButton = styled.button`
  display: flex;
  width: 100%;
  padding: 0.7rem;
  border: 0;
  border-radius: 5px 0 0 5px;
  font-size: 1rem;
  text-align: start;
  background: inherit;
`;

const ListDeleteButton = styled(ListSelectorButton)`
  width: fit-content;
  border-radius: 0 5px 5px 0;
  &:hover {
    cursor: pointer;
  }
  &:active {
    color: #bbb;
    text-shadow: none;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 0.5rem;

  & button:first-child {
    margin-bottom: 0.5rem;
  }
`;

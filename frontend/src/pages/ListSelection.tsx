import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { ListData } from '../typings/types';
import { Modal } from '../components/UI/Modal';
import { DeleteIcon } from '../assets/Icons';
import { MenuButton } from '../components/UI/Button';
import { Paragraph } from '../components/UI/Paragraph';
import { isList } from '../utils/typeGuard';

export type FocusedList = {
  listName: string;
  listId: number;
};

export function ListSelection() {
  const { data, error, isPending, setFetchParams } = useFetch({ method: 'GET', operation: 'getLists' });
  const [focusedList, setFocusedList] = useState<FocusedList>({ listName: '', listId: 0 });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  function deleteTargetList(listId: number) {
    setFetchParams({ method: 'DELETE', operation: 'deleteList', listId: listId });
  }

  function navigateToList(listId: number, listName: string) {
    navigate(`/list/${listId}`, { state: { listName: listName } });
  }

  function createListEntries(data: ListData[]) {
    const listComponents = data.map(({ list_id, list_name }) => {
      return (
        <ListItem key={list_id} id={list_id} target={focusedList.listId} $pending={isPending}>
          <ListSelectorButton onClick={() => navigateToList(list_id, list_name)}>{list_name}</ListSelectorButton>
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
    return listComponents;
  }

  return (
    <>
      {data ? (
        <ListSelector>{isList(data) && createListEntries(data)}</ListSelector>
      ) : isPending ? (
        <p>Ladataan listoja...</p>
      ) : error ? (
        <p>Listojen lataaminen epäonnistui</p>
      ) : null}
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
const ListItem = styled.li<{ $pending: boolean; target: number | null; id: number }>`
  display: flex;
  align-items: center;
  width: 100%;
  border: 0;
  border-radius: 5px;
  font-size: 1rem;
  opacity: ${(props) => (props.$pending && props.id === props.target ? '50%' : '100%')};
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

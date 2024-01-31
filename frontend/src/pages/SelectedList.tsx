import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { ListItem } from '../typings/types';
import { Item } from '../components/ListItem';
import { ListSelector } from './ListSelection';
import { Button, MenuButton } from '../components/UI/Button';
import { ChevronDownIcon, ChevronUpIcon, EditIcon } from '../assets/Icons';
import { Modal } from '../components/UI/Modal';
import { Paragraph } from '../components/UI/Paragraph';
import { Device } from '../assets/breakpoints';
import { isListValueArray } from '../utils/typeGuard';
import { modifyRequest } from '../utils/modifyRequest';

const apiUrl = import.meta.env.VITE_API_URL;

type State = {
  state: { listName: string; showInput: boolean };
};

function toInt(value: string | undefined) {
  if (value) {
    return parseInt(value);
  }
}

export function SelectedList() {
  const { id } = useParams();
  const listId = toInt(id);
  const { state } = useLocation() as State;
  const { data, isPending, error, setFetchParams } = useFetch({ method: 'GET', operation: 'getSingleList', listId: toInt(id) });

  const [listName, setListName] = useState<string>(state.listName);
  const [editableListName, setEditableListName] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(state.showInput || false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleInputVisibility(state: boolean) {
    !state ? setShowInput(true) : setShowInput(false);
  }

  function createListItem() {
    if (inputValue.trim().length > 0) {
      const itemId: string = crypto.randomUUID();
      const newItem: ListItem = { list_item_id: itemId, list_item_value: inputValue, completed: false };
      void postListItem(newItem);
    }
    setInputValue('');
  }

  function postListItem(newItem: ListItem) {
    setFetchParams({ method: 'POST', operation: 'postListItem', body: newItem, listId: listId });
  }

  function deleteListItem(itemId: string) {
    setFetchParams({ method: 'DELETE', operation: 'deleteListItem', listId: listId, itemId: itemId });
  }

  function createListComponents(items: ListItem[]) {
    if (items) {
      const components: React.ReactNode[] = items.map(({ list_item_id, list_item_value, completed }) => {
        return (
          <Item
            key={list_item_id}
            listId={id as string}
            itemId={list_item_id}
            value={list_item_value}
            completed={completed}
            handleClick={() => void deleteListItem(list_item_id)}
          />
        );
      });
      return components;
    }
  }

  async function updateListName(name: string, oldName: string) {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ list_name: name }),
    };

    const res = await modifyRequest<string>(apiUrl + `/lists/${id}`, options);
    if (!res.success) {
      console.error('Could not update list name', res.error);
      setListName(oldName);
    }
  }

  return (
    <>
      {data ? (
        <>
          <TopWrapper>
            <Header>
              <ListNameWrapper>
                <ListName>{listName}</ListName>
                <EditNameButton
                  onClick={() => {
                    setEditableListName(listName);
                    dialogRef.current?.showModal();
                  }}
                >
                  <EditIcon height={'1.25rem'} />
                </EditNameButton>
              </ListNameWrapper>
              <ShowInputButton onClick={() => toggleInputVisibility(showInput)}>
                {!showInput ? <ChevronDownIcon /> : <ChevronUpIcon />}
              </ShowInputButton>
            </Header>
            {showInput && (
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="Lisää listaan..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createListItem()}
                />
                <AddButton onClick={() => createListItem()}>lisää</AddButton>
              </InputWrapper>
            )}
          </TopWrapper>
          <ItemsList>{isListValueArray(data) && createListComponents(data)}</ItemsList>
        </>
      ) : isPending ? (
        <p>Ladataan listaa</p>
      ) : error ? (
        <p>Virhe</p>
      ) : null}

      <Modal ref={dialogRef}>
        <Paragraph $bold>Muokkaa nimeä</Paragraph>
        <ListNameInput value={editableListName} onChange={(e) => setEditableListName(e.target.value)} />
        <MenuButton
          handleClick={() => {
            void updateListName(editableListName, listName);
            setListName(editableListName);
            dialogRef.current?.close();
          }}
        >
          Vahvista
        </MenuButton>
        <MenuButton handleClick={() => dialogRef.current?.close()}>Peruuta</MenuButton>
      </Modal>
    </>
  );
}

const TopWrapper = styled.div`
  box-shadow: ${(props) => props.theme.shadows.bottomSmall};
  background: ${(props) => props.theme.colors.menuBackground};
  padding: 0.5rem 0;
  @media (max-width: ${Device.sm}) {
    font-size: clamp(0.8rem, 4vw, 1rem);
    padding: clamp(0.1rem, 2vw, 0.5rem) 0;
  }
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 0 0.7rem;
`;

const ListNameWrapper = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  gap: 1rem;
`;

const ListName = styled.h3`
  color: ${(props) => props.theme.colors.offWhite};
`;

const EditNameButton = styled.button`
  border: 0;
  background: none;
  padding: 0;
`;

const ShowInputButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: fit-content;
  padding: 0;
  background: inherit;
  &:hover {
    background: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  gap: 0.25rem;
  height: fit-content;
  background: ${(props) => props.theme.colors.menuBackground};
`;
const Input = styled.input`
  flex-basis: 100%;
  border-radius: 5px;
  font-size: 1rem;
  padding: 0.5rem;
  height: fit-content;
  @media (max-width: ${Device.sm}) {
    font-size: clamp(0.8rem, 4vw, 1rem);
    padding: clamp(0.25rem, 2vw, 0.5rem);
  }
`;
const AddButton = styled(Button)`
  padding: 0.5rem 1rem;
  flex-basis: fit-content;
  @media (max-width: ${Device.sm}) {
    font-size: clamp(0.8rem, 4vw, 1rem);
    padding: clamp(0.25rem, 2vw, 0.5rem) 1rem;
  }
`;
const ItemsList = styled(ListSelector)``;

const ListNameInput = styled.input`
  font-size: 1rem;
  padding: 0.5rem;
  margin: 1rem 0;
  background: ${(props) => props.theme.colors.offWhite};
  border: 2px solid ${(props) => props.theme.colors.secondary};
  border-radius: 5px;
`;

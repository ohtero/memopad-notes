import { useState, useRef, useEffect } from 'react';
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
import { useListNameContext } from '../context/ListNameContext';

const apiUrl = import.meta.env.VITE_API_URL;

type State = {
  state: { listId: number; listName: string; showInput: boolean };
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
  const { data, isPending, error, reFetch } = useFetch({});

  const [listName, setListName] = useState<string>(state.listName);
  const [editableListName, setEditableListName] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(state.showInput || false);
  const { updateListNameContext } = useListNameContext();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const addItemBtnRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    reFetch({ method: 'GET', operation: 'getSingleList', listId: toInt(id) });
    setListName(state.listName);
    setShowInput(state.showInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    reFetch({ method: 'POST', operation: 'postListItem', body: newItem, listId: listId });
  }

  function deleteListItem(itemId: string) {
    reFetch({ method: 'DELETE', operation: 'deleteListItem', listId: listId, itemId: itemId });
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
    try {
      const res = await fetch(apiUrl + `/lists/${id}`, options);
      if (!res.ok) {
        setListName(oldName);
        throw new Error(res.statusText);
      }
      typeof listId === 'number' && updateListNameContext({ listId: listId, listName: name });
    } catch (err) {
      console.log(err);
    }
  }

  function handleItemAdd() {
    createListItem();
    if (addItemBtnRef.current) {
      addItemBtnRef.current.focus();
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
              </ListNameWrapper>
              <TopButtonWrapper>
                <EditNameButton
                  onClick={() => {
                    setEditableListName(listName);
                    dialogRef.current?.showModal();
                  }}
                >
                  <EditIcon height={'1.25rem'} />
                </EditNameButton>
                <ShowInputButton onClick={() => toggleInputVisibility(showInput)}>
                  {!showInput ? <ChevronDownIcon /> : <ChevronUpIcon />}
                </ShowInputButton>
              </TopButtonWrapper>
            </Header>
            {showInput && (
              <InputWrapper>
                <Input
                  ref={addItemBtnRef}
                  type="text"
                  placeholder="Lisää listaan..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createListItem()}
                />
                <AddButton onClick={() => handleItemAdd()}>lisää</AddButton>
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
  // flex-basis: fit-content;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 1rem;
`;

const ListName = styled.h3`
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
`;

const TopButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  gap: 1rem;
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
  background: none;
  box-shadow: none;
  border: none;
  &:hover {
    background: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  gap: 0.25rem;
  height: fit-content;
`;

const Input = styled.input`
  flex-basis: 100%;
  border-radius: 3px;
  font-size: 1rem;
  padding: 0.5rem;
  height: fit-content;
  background: HSLA(${(props) => props.theme.colors.secondaryLight}, 1);
  @media (max-width: ${Device.sm}) {
    font-size: clamp(0.8rem, 4vw, 1rem);
    padding: clamp(0.25rem, 2vw, 0.5rem);
  }
`;
const AddButton = styled(Button)`
  padding: 0.5rem 1rem;
  flex-basis: fit-content;
  box-shadow: none;
  @media (max-width: ${Device.sm}) {
    font-size: clamp(0.8rem, 4vw, 1rem);
    padding: clamp(0.25rem, 2vw, 0.5rem) 1rem;
  }
`;
const ItemsList = styled(ListSelector)`
  height: 100%;
  overflow-y: auto;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem 0;
  border-top: 2px solid HSLA(${(props) => props.theme.colors.primary}, 1);
  border-bottom: 2px solid HSLA(${(props) => props.theme.colors.primary}, 1);
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 12px;
  }
`;

const ListNameInput = styled.input`
  font-size: 1rem;
  padding: 0.5rem;
  margin: 1rem 0;
  // background: HSLA$(${(props) => props.theme.colors.secondaryLight}, 1);
  // border: 2px solid ${(props) => props.theme.colors.secondary};
  border-radius: 5px;
`;

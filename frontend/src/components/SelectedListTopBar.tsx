import styled from 'styled-components';
import { useRef, useState, useEffect } from 'react';
import { EditIcon, ChevronDownIcon, ChevronUpIcon } from '../assets/Icons';
import { useListNameContext } from '../context/ListNameContext';
import { Modal } from '../components/UI/Modal';
import { MenuButton } from '../components/UI/Button';
import { Paragraph } from '../components/UI/Paragraph';
import { Button } from '../components/UI/Button';

import { FetchParams, ListItem } from '../typings/types';

type TopBarProps = {
  listItems: ListItem[];
  listNameFromState: string;
  listId: number | undefined;
  inputVisibility?: boolean;
  reFetch: (params: FetchParams) => void;
};

export function SelectedListTopBar(props: TopBarProps) {
  const { listItems, listNameFromState, listId, inputVisibility, reFetch } = props;

  const apiUrl = import.meta.env.VITE_API_URL;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addItemBtnRef = useRef<HTMLInputElement>(null);

  const { updateListNameContext } = useListNameContext();

  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean | undefined>(inputVisibility || false);
  const [listName, setListName] = useState<string>(listNameFromState);
  const [editableListName, setEditableListName] = useState<string>('');
  useEffect(() => {
    setListName(listNameFromState);
    setShowInput(inputVisibility ? inputVisibility : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  function createListItem() {
    if (inputValue.trim().length > 0) {
      const itemId: string = crypto.randomUUID();
      const newItem: ListItem = { list_item_id: itemId, list_item_value: inputValue, index: listItems.length, completed: false };
      void postListItem(newItem);
    }
    setInputValue('');
  }

  function postListItem(newItem: ListItem) {
    reFetch({ method: 'POST', operation: 'postListItem', body: newItem, listId: listId });
  }

  function toggleInputVisibility(state: boolean) {
    !state ? setShowInput(true) : setShowInput(false);
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
      const res = await fetch(apiUrl + `/lists/${listId}`, options);
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
              <EditIcon height={'1.5rem'} />
            </EditNameButton>
            <ShowInputButton onClick={() => typeof showInput === 'boolean' && toggleInputVisibility(showInput)}>
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
  min-width: calc(35vw + 2rem);
  // max-width: 47rem;
  width: 100%;
  border-bottom: 2px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
  z-index: 2;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const ListNameWrapper = styled.div`
  display: flex;
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
  padding: 0.5rem 0.5rem 0 0.5rem;
  gap: 0.25rem;
  height: 3.5rem;
`;

const AddButton = styled(Button)`
  padding: 0.5rem 1.5rem;
  flex-basis: fit-content;
  box-shadow: none;
  height: 100%;
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
`;

export const Input = styled.input`
  flex-basis: 100%;
  min-height: 100%;
  border-radius: 3px;
  font-size: 1rem;
  padding: 0.5rem;
  height: 100%;
  border: none;
  background: HSLA(${(props) => props.theme.colors.secondaryLight}, 1);
  &:focus {
    outline: 3px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
    outline-offset: -3px;
  }
`;

const ListNameInput = styled(Input)`
  font-size: 1rem;
  padding: 0.5rem;
  margin: 1rem 0;
  background: white;
  // border: 1px solid HSLA(${(props) => props.theme.colors.secondary}, 1);
  border-radius: 3px;
`;

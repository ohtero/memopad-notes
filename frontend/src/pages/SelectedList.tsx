import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { fetchData } from '../utils/fetchData';
import { useListContext } from '../context/listContext';
import { ListData, ListItemType } from '../typings/types';
import { ListItem } from '../components/ListItem';
import { isListValues, isString } from '../utils/typeGuard';
import { ListSelector } from './ListSelection';
import { Button, MenuButton } from '../components/UI/Button';
import { ChevronDownIcon, ChevronUpIcon, EditIcon } from '../assets/Icons';
import { Modal } from '../components/UI/Modal';
import { Paragraph } from '../components/UI/Paragraph';
import { Device } from '../assets/breakpoints';

const apiUrl = import.meta.env.VITE_API_URL;

export function SelectedList() {
  const [listName, setListName] = useState<string>('');
  const [editableListName, setEditableListName] = useState<string>('');
  const [items, setItems] = useState<ListItemType[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);

  const { id } = useParams();
  const { listData } = useListContext();

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    async function getListItems() {
      try {
        const data = await fetchData<ListItemType[] | undefined>(apiUrl + `/lists/${id}`, options);
        if (data !== undefined && isListValues(data)) {
          setItems([...items, ...data]);
        }
      } catch (err) {
        console.error('failed to fetch list data', err);
      }
    }
    void getListItems();
    const selectedListName = getListName(id, listData as ListData[]);
    selectedListName && setListName(selectedListName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getListName(listId: string | undefined, lists: ListData[]) {
    if (isString(listId)) {
      const selectedList = lists.filter((list) => list.list_id === parseInt(listId));
      return selectedList[0].list_name;
    }
  }

  function createListComponents() {
    const components: React.ReactNode[] = items.map(({ list_item_id, list_item_value, completed }) => {
      return (
        <ListItem
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

  function toggleInputVisibility(state: boolean) {
    !state ? setShowInput(true) : setShowInput(false);
  }

  function createListItem() {
    if (inputValue.trim().length > 0) {
      const itemId: string = crypto.randomUUID();
      const newItem: ListItemType = { list_item_id: itemId, list_item_value: inputValue, completed: false };
      setItems([...items, newItem]);
      void postListItem(newItem);
    }
    setInputValue('');
  }

  async function postListItem(newItem: ListItemType) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(newItem),
    };
    try {
      await fetch(apiUrl + `/lists/${id}`, options);
    } catch (err) {
      console.log('Failed to save item to database', err);
    }
  }

  async function deleteListItem(itemId: string) {
    const filteredItems = items.filter((item) => item.list_item_id !== itemId);
    setItems(filteredItems);
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
      };
      await fetch(apiUrl + `/lists/${id}/${itemId}`, options);
    } catch (err) {
      console.error('Could not delete list item'), err;
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
      const res = await fetch(apiUrl + `lists/${id}`, options);
      res.ok && console.log('updated');
    } catch (err) {
      console.error('Could not update list name', err);
      setListName(oldName);
    }
  }

  return (
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
          <ShowInputButton onClick={() => toggleInputVisibility(showInput)}>{!showInput ? <ChevronDownIcon /> : <ChevronUpIcon />}</ShowInputButton>
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
      <ItemsList>{createListComponents()}</ItemsList>
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

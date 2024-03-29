import { useEffect, useRef, useState } from 'react';
import { useListNameContext } from '../context/ListNameContext';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { ListData } from '../typings/types';
import { Modal } from '../components/UI/Modal';
import { DeleteIcon } from '../assets/Icons';
import { MenuButton } from '../components/UI/Button';
import { Paragraph } from '../components/UI/Paragraph';
import { isList } from '../utils/typeGuard';
import AddNewListButton from '../components/AddNewListButton';
import { Device } from '../assets/breakpoints';
import { DesktopView, MobileView } from '../config/screensize';

export type FocusedList = {
  listName: string;
  listId: number;
};

export function ListSelection() {
  const { data, error, isPending, reFetch } = useFetch({ method: 'GET', operation: 'getLists' });
  const [listIdData, setListIdData] = useState<ListData[]>();
  const [focusedList, setFocusedList] = useState<FocusedList>({ listName: '', listId: 0 });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { targetListData } = useListNameContext();

  useEffect(() => {
    isList(data) && setListIdData(data);
  }, [data]);

  useEffect(() => {
    if (listIdData && targetListData) {
      const newListIdData = listIdData.map((list) => {
        if (list.list_id === targetListData.listId) {
          return { ...list, list_name: targetListData.listName };
        }
        return list;
      });
      setListIdData(newListIdData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetListData]);

  function deleteTargetList(listId: number) {
    reFetch({ method: 'DELETE', operation: 'deleteList', listId: listId });
    const comparisonPath = /^\/list\/(.*)$/;
    const isListPath = comparisonPath.test(pathname);
    isListPath && navigate('/');
  }

  function navigateToList(listId: number, listName: string) {
    navigate(`/list/${listId}`, { state: { listName: listName } });
  }

  function handleDelClick(listName: string, listId: number) {
    setFocusedList({ listName: listName, listId: listId });
    dialogRef.current?.showModal();
  }

  function createListEntries(data: ListData[]) {
    const listComponents = data.map(({ list_id, list_name }) => {
      return (
        <ListItem key={list_id} id={list_id} target={focusedList.listId} $pending={isPending}>
          <ListSelectorButton onClick={() => navigateToList(list_id, list_name)} value={list_name}>
            {list_name}
          </ListSelectorButton>
          <ListDeleteButton onClick={() => handleDelClick(list_name, list_id)}>
            <DeleteIcon $dark height={'2.25rem'} />
          </ListDeleteButton>
        </ListItem>
      );
    });
    return listComponents;
  }

  function syncLists() {
    reFetch({ method: 'GET', operation: 'getLists' });
  }

  return (
    <>
      <ComponentWrapper>
        <TopWrapper>
          <DesktopView>
            <AddNewListButton handleClick={syncLists} />
          </DesktopView>
          <MobileView>
            <Header>My Lists</Header>
          </MobileView>
        </TopWrapper>
        {listIdData ? (
          <ListSelector>{isList(listIdData) && createListEntries(listIdData)}</ListSelector>
        ) : isPending ? (
          <p>Ladataan listoja...</p>
        ) : error ? (
          <p>Listojen lataaminen epäonnistui</p>
        ) : null}
        <Modal ref={dialogRef}>
          <Paragraph>Haluatko poistaa listan</Paragraph>
          <Paragraph $bold>{focusedList.listName}?</Paragraph>
          <DelButtonWrapper>
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
          </DelButtonWrapper>
        </Modal>
      </ComponentWrapper>
    </>
  );
}

const ComponentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  height: 80svh;
  min-width: calc(19vw + 1rem);
  backdrop-filter: blur(5px);
  width: fit-content;
  background: HSLA(${(props) => props.theme.colors.primary}, 0.2);
  padding-bottom: 1rem;
  overflow: hidden;
  @media (max-width: ${Device.sm}) {
    background: none;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  height: 3.75rem;
  @media (max-width: ${Device.sm}) {
    padding: 1.025rem;
    margin: 0;
  }
`;

const Header = styled.h3`
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
`;

export const ListSelector = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 1rem;
  padding-top: 0.75rem;
  gap: 0.5rem;
  border-top: 2px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
  border-bottom: 2px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 12px;
  }
`;
const ListItem = styled.li<{ $pending: boolean; target: number | null; id: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 18vw;
  max-width: 25rem;
  flex-grow: 0;
  border-radius: 3px;
  font-size: 1rem;
  padding: 0.5rem;
  opacity: ${(props) => (props.$pending && props.id === props.target ? '50%' : '100%')};
  background: HSLA(${(props) => props.theme.colors.secondaryLight}, 1);
  border: 2px solid HSLA(${(props) => props.theme.colors.primary}, 0.25);
  &:hover {
    background: HSLA(${(props) => props.theme.colors.highlight}, 1);
  }

  @media (max-width: ${Device.sm}) {
    width: calc(98vw - 1rem);
    max-width: none;
  }
`;

const ListSelectorButton = styled.button`
  display: flex;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 5px 0 0 5px;
  font-size: 1rem;
  text-align: start;
  align-items: center;
  background: inherit;
  overflow: hidden;
  color: HSLA(${(props) => props.theme.colors.primaryDark}, 1);
`;

const ListDeleteButton = styled(ListSelectorButton)`
  width: fit-content;
  border-radius: 0;
  padding-left: 0.5rem;
  border-left: 1px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
  &:hover {
    cursor: pointer;
  }
  &:active {
    color: #bbb;
    text-shadow: none;
  }
`;

const DelButtonWrapper = styled.div`
  margin-top: 0.5rem;

  & button:first-child {
    margin-bottom: 0.5rem;
  }
`;

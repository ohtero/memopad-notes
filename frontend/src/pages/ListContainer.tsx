import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { SelectedListItems } from '../components/SelectedListItems';
import { Device } from '../assets/breakpoints';
import { SelectedListTopBar } from '../components/SelectedListTopBar';
import { ListItem } from '../typings/types';
import { useFetch } from '../hooks/useFetch';
import { isListValueArray } from '../utils/typeGuard';

type State = {
  state: { listId: number; listName: string; showInput: boolean };
};

export function ListContainer() {
  const { id } = useParams();
  const listId = toInt(id);
  const { state } = useLocation() as State;

  const [listItems, setListItems] = useState<ListItem[] | []>([]);

  const { data, isPending, error, reFetch } = useFetch({ method: 'GET', operation: 'getSingleList', listId: toInt(id) });

  useEffect(() => {
    reFetch({ method: 'GET', operation: 'getSingleList', listId: toInt(id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    isListValueArray(data) && setListItems(data);
  }, [data]);

  function toInt(value: string | undefined) {
    if (value) {
      return parseInt(value);
    }
  }

  function deleteListItem(itemId: string) {
    reFetch({ method: 'DELETE', operation: 'deleteListItem', listId: listId, itemId: itemId });
  }

  function updateListItemOrder(orderedItems: ListItem[]) {
    setListItems(orderedItems);
  }

  return (
    <>
      <SelectedListItemsContainer>
        <SelectedListTopBar
          listItems={listItems}
          listNameFromState={state.listName}
          reFetch={reFetch}
          listId={listId}
          inputVisibility={state.showInput}
        />
        <Wrapper>
          <DraggableContainer>
            <SelectedListItems
              listItems={listItems}
              listId={listId}
              handleItemDelete={deleteListItem}
              updateListItems={updateListItemOrder}
              isPending={isPending}
              error={error}
            />
          </DraggableContainer>
        </Wrapper>
      </SelectedListItemsContainer>
    </>
  );
}

const SelectedListItemsContainer = styled.div`
  grid-row: main-start / main-end;
  grid-column: mid-start / mid-end;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  background: HSLA(${(props) => props.theme.colors.primary}, 0.2);
  padding-bottom: 1rem;
  @media (max-width: ${Device.sm}) {
    width: 100%;
    padding-bottom: 0;
  }
  z-index: 2;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  border-bottom: 2px solid HSLA(${(props) => props.theme.colors.primary}, 0.5);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 12px;
  }
  @media (max-width: ${Device.sm}) {
    padding: 0;
    border-bottom: none;
  }
`;

const DraggableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: fit-content;
  list-style: none;
  padding: 0;
`;

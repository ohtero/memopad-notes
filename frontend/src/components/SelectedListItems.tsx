import { useState } from 'react';
import styled from 'styled-components';
import { ListItem } from '../typings/types';
import Item from './ListItem';
import { isListValueArray } from '../utils/typeGuard';
import { SortableListItem } from './SortableListItem';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor, restrictToParentElement } from '@dnd-kit/modifiers';

type SelectedListItemsProps = {
  listItems: ListItem[];
  listId: number | undefined;
  handleItemDelete: (itemId: string) => void;
  updateListItems: (listItems: ListItem[]) => void;
  updateItemValue?: (itemId: string, newValue: string) => void;
  isPending: boolean;
  error: string | null;
};

export function SelectedListItems(props: SelectedListItemsProps) {
  const { listItems, listId, handleItemDelete, isPending, error, updateListItems, updateItemValue } = props;

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <>
      {listItems ? (
        <DndContext
          sensors={sensors}
          modifiers={[restrictToFirstScrollableAncestor, restrictToParentElement]}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={listItems.map((item) => item.list_item_id)} strategy={verticalListSortingStrategy}>
            <ItemsList>
              {isListValueArray(listItems) &&
                listItems.map((item) => (
                  <SortableListItem
                    key={item.list_item_id}
                    listId={listId ? listId : NaN}
                    itemId={item.list_item_id}
                    value={item.list_item_value}
                    completed={item.completed}
                    handleClick={() => handleItemDelete(item.list_item_id)}
                    updateItemValue={updateItemValue}
                    activeId={activeId}
                  />
                ))}
            </ItemsList>
          </SortableContext>
          <DragOverlay wrapperElement="ul" className="overlay" style={{ zIndex: '1' }}>
            {activeId
              ? isListValueArray(listItems) &&
                listItems.map(
                  (item) =>
                    item.list_item_id === activeId && (
                      <Item
                        itemId={item.list_item_id}
                        key={item.list_item_id}
                        listId={listId ? listId : NaN}
                        value={item.list_item_value}
                        completed={item.completed}
                        handleClick={() => handleItemDelete(item.list_item_id)}
                      />
                    )
                )
              : null}
          </DragOverlay>
        </DndContext>
      ) : isPending ? (
        <p>Ladataan listaa</p>
      ) : error ? (
        <p>Virhe</p>
      ) : null}
    </>
  );

  async function patchItemIndex(listId: number, itemId: UniqueIdentifier, oldIndex: number, newIndex: number) {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ list_item_id: itemId, list_id: listId, oldIndex: oldIndex, newIndex: newIndex }),
    };

    try {
      const res = await fetch(`${apiUrl}/lists/${listId}/${itemId}/order`, options);
      const data = (await res.json()) as object | string;
      if (res.status === 500) {
        throw new Error(data as string);
      }
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = listItems.findIndex((item) => item.list_item_id === active.id);
      const newIndex = listItems.findIndex((item) => item.list_item_id === over?.id);
      const orderedItems = arrayMove(listItems, oldIndex, newIndex);
      updateListItems(orderedItems);
      listId && activeId && void patchItemIndex(listId, activeId, oldIndex, newIndex);
    }
    setActiveId(null);
  }
}

const ItemsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
  width: fit-content;
`;

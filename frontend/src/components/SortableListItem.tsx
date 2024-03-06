import { UniqueIdentifier } from '@dnd-kit/core';
import Item from './ListItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ListItemsProps = {
  listId: number;
  itemId: string;
  value: string;
  completed: boolean;
  handleClick: () => void;
  activeId: UniqueIdentifier | null;
};

export function SortableListItem({ listId, itemId, value, completed, handleClick, activeId }: ListItemsProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: itemId });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      listId={listId}
      itemId={itemId}
      value={value}
      completed={completed}
      handleClick={handleClick}
      activeId={activeId}
    />
  );
}

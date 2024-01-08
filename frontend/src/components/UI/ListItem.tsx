import { useState } from 'react';
import styled from 'styled-components';
import { DeleteIcon } from '../../assets/Icons';

type ListItemProps = {
  id: string;
  value: string;
  handleClick: () => void;
};

export function ListItem({ id, value, handleClick }: ListItemProps) {
  const [itemValue, setItemValue] = useState<string>(value);

  async function updateItem() {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ list_item_id: id, list_item_value: itemValue }),
    };
    try {
      const res = await fetch('http://localhost:4000/lists/updateListItem', options);
      res.ok && console.log('updated');
    } catch (err) {
      console.error('Could not update list item', err);
    }
  }

  return (
    <ItemContainer>
      <ItemText value={itemValue} onChange={(e) => setItemValue(e.target.value)} onBlur={() => void updateItem()} />
      <DeleteButton onClick={handleClick}>
        <DeleteIcon height={'1.25rem'} />
      </DeleteButton>
    </ItemContainer>
  );
}

const ItemContainer = styled.div``;
const ItemText = styled.input``;
const DeleteButton = styled.button``;

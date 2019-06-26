import * as React from 'react';

import { Comment } from '../../../../__mocks__/types';
import { useItem } from '../useItem';

interface ItemComponentProps {
    id: string;
}

const ItemComponent: React.FunctionComponent<ItemComponentProps> = ({ id }) => {
    const item = useItem<Comment>('comments', id);

    return item ? <p>{item.attributes.body}</p> : null;
};

export default ItemComponent;

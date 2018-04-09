import * as React from 'react';
import { Response } from 'ts-json-api/types/structure';
import { Comment } from '../mocks/types';

type Props = {
    id?: string;
    data: Comment | undefined;
};

const ItemComponent: React.StatelessComponent<Props> = ({ data }) =>
    data ? <p>{data.attributes.body}</p> : null;

export default ItemComponent;

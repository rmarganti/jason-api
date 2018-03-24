import * as React from 'react';
import { CommentResource } from '../mocks/types';

type Props = {
    data: CommentResource;
};

const ItemComponent: React.StatelessComponent<Props> = ({ data }) => (
    <div>{data && <p>{data.attributes.body}</p>}</div>
);

export default ItemComponent;

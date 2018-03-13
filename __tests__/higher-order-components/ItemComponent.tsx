import React, { SFC } from 'react';
import { iResourceObject } from 'ts-json-api';

type Props = {
    data: iResourceObject;
};

const ItemComponent: SFC<Props> = ({ data }) => (
    <div>{data && <p>{data.attributes.body}</p>}</div>
);

export default ItemComponent;

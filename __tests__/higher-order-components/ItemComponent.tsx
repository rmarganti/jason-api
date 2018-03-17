import * as React from 'react';
import { iResourceObject } from 'ts-json-api';

type Props = {
    data: iResourceObject;
};

const ItemComponent: React.StatelessComponent<Props> = ({ data }) => (
    <div>{data && <p>{data.attributes.body}</p>}</div>
);

export default ItemComponent;

import * as React from 'react';

const ItemComponent = ({ data, ...rest }) => (
    <div>{data && <p>{data.body}</p>}</div>
);

export default ItemComponent;

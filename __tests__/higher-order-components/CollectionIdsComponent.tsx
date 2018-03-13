import React, { SFC } from 'react';
import { iResourceObject } from 'ts-json-api';

type Props = {
    ids: string[];
};

const CollectionIdsComponent: SFC<Props> = ({ ids }) => (
    <div>
        { ids.map(id => <p key={id}>{ id }</p>) }
    </div>
);

export default CollectionIdsComponent;

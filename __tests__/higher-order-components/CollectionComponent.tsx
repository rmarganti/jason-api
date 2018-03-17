import * as React from 'react';
import { iResourceObject } from 'ts-json-api';

type Props = {
    data: iResourceObject[];
};

const CollectionComponent: React.StatelessComponent<Props> = ({ data }) => (
    <div>
        {data.map(article => (
            <p key={article.id}>{article.attributes.title}</p>
        ))}
    </div>
);

export default CollectionComponent;

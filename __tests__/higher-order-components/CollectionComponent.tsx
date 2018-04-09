import * as React from 'react';
import { Response } from 'ts-json-api/types/structure';
import { Article } from '../mocks/types';

type CollectionProps = {
    data: Article[] | undefined;
    isLoading?: boolean;
};

const CollectionComponent: React.StatelessComponent<CollectionProps> = ({
    data,
}) => (
    <div>
        {data.map(article => (
            <p key={article.id}>{article.attributes.title}</p>
        ))}
    </div>
);

export default CollectionComponent;

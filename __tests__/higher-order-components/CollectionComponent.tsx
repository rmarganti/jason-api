import * as React from 'react';
import { Response } from 'ts-json-api/types/structure';
import { Article } from '../mocks/types';
import { WithQueryInjectedProps } from '../../src/higher-order-components/withQuery';

type CollectionProps = WithQueryInjectedProps<Article[]>;

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

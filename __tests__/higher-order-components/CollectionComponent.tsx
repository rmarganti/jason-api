import * as React from 'react';
import { iResponse } from 'ts-json-api';
import { ArticleResource } from '../mocks/types';

type ResponseWithLoadingState = {
    data: any;
    isLoading: boolean;
} & iResponse<ArticleResource[]>;

const CollectionComponent: React.StatelessComponent<
    ResponseWithLoadingState
> = ({ data }) => (
    <div>
        {data.map(article => (
            <p key={article.id}>{article.attributes.title}</p>
        ))}
    </div>
);

export default CollectionComponent;

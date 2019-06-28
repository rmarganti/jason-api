// External Dependencies
import * as React from 'react';

// JasonAPI
import { useRequestResponse } from '../../../src';

// Internal Dependencies
import { getArticle } from '../actions';
import { Article } from '../types';
import Comments from './Comments';

const Article = () => {
    const { data, errors, isLoading, refetch } = useRequestResponse<Article>({
        action: getArticle('1'),
        expandResourceObjects: true,
    });

    return !data && isLoading ? (
        <p>Loading</p>
    ) : errors ? (
        <div>Errors!</div>
    ) : data ? (
        <div>
            <h1>{data.attributes.title}</h1>
            {isLoading && <p>Refreshing...</p>}
            <p>{data.attributes.body}</p>
            <Comments comments={data.relationships.comments.data} />
            <button onClick={refetch}>Refetch</button>
        </div>
    ) : null;
};

export default Article;

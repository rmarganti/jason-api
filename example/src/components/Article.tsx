import * as React from 'react';

import { useRequestResponse } from '../../../src'; // JasonApi

import { getArticle } from '../actions';
import { Article } from '../types';
import Comment from './Comment';

const Article = () => {
    const result = useRequestResponse<Article>({
        action: getArticle('1'),
        expandResourceObjects: true,
    });

    return result.isLoading ? (
        <p>Loading</p>
    ) : result.errors ? (
        <div>Errors!</div>
    ) : result.data ? (
        <div>
            <h1>{result.data.attributes.title}</h1>
            <p>{result.data.attributes.body}</p>
            <div>
                <h2>Comments</h2>
                <ul>
                    {result.data.relationships.comments.data.map(comment => (
                        <Comment key={comment.id} id={comment.id} />
                    ))}
                </ul>
            </div>
        </div>
    ) : null;
};

export default Article;

import { Response } from 'ts-json-api';

import { Article } from './types';

export const articleResponse: Response<Article> = {
    links: {
        self: 'http://example.com/articles/1',
    },
    // @ts-ignore
    data: {
        type: 'articles',
        id: '1',
        attributes: {
            title: 'JSON API paints my bikeshed!',
        },
        relationships: {
            author: {
                links: {
                    self: 'http://example.com/articles/1/relationships/author',
                    related: 'http://example.com/articles/1/author',
                },
                data: {
                    type: 'people',
                    id: '9',
                },
            },
            comments: {
                links: {
                    self:
                        'http://example.com/articles/1/relationships/comments',
                    related: 'http://example.com/articles/1/comments',
                },
                data: [
                    // @ts-ignore
                    {
                        type: 'comments',
                        id: '5',
                    },
                    // @ts-ignore
                    {
                        type: 'comments',
                        id: '12',
                    },
                ],
            },
        },
        links: {
            self: 'http://example.com/articles/1',
        },
    },
    included: [
        {
            type: 'people',
            id: '9',
            attributes: {
                firstName: 'Dan',
                lastName: 'Gebhardt',
                twitter: 'dgeb',
            },
            links: {
                self: 'http://example.com/people/9',
            },
        },
        {
            type: 'comments',
            id: '5',
            attributes: {
                body: 'First!',
            },
            relationships: {
                author: {
                    data: {
                        type: 'people',
                        id: '2',
                    },
                },
            },
            links: {
                self: 'http://example.com/comments/5',
            },
        },
        {
            type: 'comments',
            id: '12',
            attributes: {
                body: 'I like XML better',
            },
            relationships: {
                author: {
                    data: {
                        type: 'people',
                        id: '9',
                    },
                },
            },
            links: {
                self: 'http://example.com/comments/12',
            },
        },
    ],
};

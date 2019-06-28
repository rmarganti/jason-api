import { ResponseWithData } from 'ts-json-api';

import { Comment } from '../src/types';

export const mockCommentResponse: ResponseWithData<Comment> = {
    data: {
        type: 'comments',
        id: '8',
        attributes: {
            body: 'New Comment',
        },
        relationships: {
            author: {
                data: {
                    type: 'people',
                    id: '44',
                },
            },
        },
        links: {
            self: 'http://example.com/comments/8',
        },
    },
    included: [
        {
            type: 'people',
            id: '44',
            attributes: {
                firstName: 'Rob',
                lastName: 'Theblob',
                twitter: 'robtheblob',
            },
            links: {
                self: 'http://example.com/people/44',
            },
        },
    ],
};

import { ResponseWithData } from 'ts-json-api';

import { Comment } from './types';

export const commentResponse: ResponseWithData<Comment> = {
    data: {
        type: 'comments',
        id: '44',
        attributes: {
            body: 'This is a terrible comment',
        },
        relationships: {
            author: {
                data: {
                    type: 'people',
                    id: '9',
                },
            },
        },
    },
};

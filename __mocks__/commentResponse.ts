import { Response } from 'ts-json-api/types';

import { Comment } from './types';

export const commentResponse: Response<Comment> = {
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

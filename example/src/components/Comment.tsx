// External Dependencies
import * as React from 'react';

// JasonAPI
import { useItem } from '../../../src';

// Internal Dependencies
import { Comment as CommentType } from '../types';
import Author from './Author';

interface CommentProps {
    id: string;
}

const Comment: React.SFC<CommentProps> = ({ id }) => {
    const comment = useItem<CommentType>('comments', id);

    if (!comment) {
        return null;
    }

    return (
        <li>
            {comment.attributes.body} -{' '}
            <Author id={comment.relationships.author.data.id} />
        </li>
    );
};

export default Comment;

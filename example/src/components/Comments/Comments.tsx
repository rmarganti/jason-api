// External Dependencies
import * as React from 'react';
import { ResourceIdentifier } from 'ts-json-api';

// Internal Dependencies
import { Comment as CommentType } from '../../types';
import Comment from '../Comment';

interface CommentsProps {
    comments: ResourceIdentifier<CommentType>[];
    isLoading: boolean;
    onAddComment: () => void;
}

const Comments: React.SFC<CommentsProps> = ({
    comments,
    isLoading,
    onAddComment,
}) => (
    <div>
        <h2>Comments</h2>
        <ul>
            {comments.map(comment => (
                <Comment key={comment.id} id={comment.id} />
            ))}
        </ul>
        <button onClick={onAddComment}>
            {isLoading ? 'Adding comment…' : 'Add Comment'}
        </button>
    </div>
);

export default Comments;

// External Dependencies
import * as React from 'react';
import { ResponseWithData, ResourceIdentifier } from 'ts-json-api';

// JasonAPI
import { useRequest } from '../../../src';

// Internal Dependencies
import { addComment } from '../actions';
import { Comment as CommentType } from '../types';
import Comment from './Comment';

interface CommentsProps {
    comments: ResourceIdentifier<CommentType>[];
}

const Comments: React.SFC<CommentsProps> = ({ comments }) => {
    const [internalComments, setComments] = React.useState(comments);
    const doAddComment = useRequest(() => addComment());
    const doAddCommentAndUpdateLocal = React.useCallback(() => {
        doAddComment().then(response => {
            setComments(currentComments => {
                const typedResponse = response as ResponseWithData<CommentType>;

                // @ts-ignore
                const newComment: CommentType = {
                    type: 'comments',
                    id: typedResponse.data.id,
                };

                return [...currentComments, newComment];
            });
        });
    }, []);

    return (
        <div>
            <h2>Comments</h2>
            <ul>
                {internalComments.map(comment => (
                    <Comment key={comment.id} id={comment.id} />
                ))}
            </ul>
            <button onClick={doAddCommentAndUpdateLocal}>Add Comment</button>
        </div>
    );
};

export default Comments;

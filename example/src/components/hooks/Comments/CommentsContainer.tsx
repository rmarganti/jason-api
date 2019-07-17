// External Dependencies
import * as React from 'react';
import { ResponseWithData, ResourceIdentifier } from 'ts-json-api';

// JasonAPI
import { useRequest } from '../../../../../src';

// Internal Dependencies
import { addComment } from '../../../actions';
import { CommentResource } from '../../../types';
import Comments from './Comments';

type CommentIdentifier = ResourceIdentifier<CommentResource>;

interface CommentsProps {
    comments: CommentIdentifier[];
}

const CommentsContainer: React.SFC<CommentsProps> = ({ comments }) => {
    const [internalComments, setComments] = React.useState(comments);

    // Reset local state when props change (Similar to `mapPropsToState`).
    React.useEffect(() => {
        setComments(comments);
    }, [comments]);

    const addNewCommentToLocalState = React.useCallback(response => {
        setComments(currentComments => {
            const typedResponse = response as ResponseWithData<CommentResource>;

            const newComment: CommentIdentifier = {
                type: 'comments',
                id: typedResponse.data.id,
            };

            return [...currentComments, newComment];
        });
    }, []);

    const doAddComment = useRequest({
        action: addComment(),
        onSuccess: addNewCommentToLocalState,
    });

    return (
        <Comments
            comments={internalComments}
            onAddComment={doAddComment.fetch}
            isLoading={doAddComment.isLoading}
        />
    );
};

export default CommentsContainer;

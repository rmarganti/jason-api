// External Dependencies
import * as React from 'react';
import { ResponseWithData, ResourceIdentifier } from 'ts-json-api';

// JasonAPI
import { useRequest } from '../../../../src';

// Internal Dependencies
import { addComment } from '../../actions';
import { Comment as CommentType } from '../../types';
import Comments from './Comments';

interface CommentsProps {
    comments: ResourceIdentifier<CommentType>[];
}

const CommentsContainer: React.SFC<CommentsProps> = ({ comments }) => {
    const [internalComments, setComments] = React.useState(comments);

    // Reset local state when props change (Similar to `mapPropsToState`).
    React.useEffect(() => {
        setComments(comments);
    }, comments);

    const addNewCommentToLocalState = React.useCallback(response => {
        setComments(currentComments => {
            const typedResponse = response as ResponseWithData<CommentType>;

            console.log(typedResponse);

            // @ts-ignore
            const newComment: CommentType = {
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

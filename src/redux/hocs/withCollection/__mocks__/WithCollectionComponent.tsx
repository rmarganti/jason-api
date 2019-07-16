// External dependencies
import * as React from 'react';

// Internal dependencies
import { withCollection, WithCollectionInjectedProps } from '../withCollection';

// Testing dependencies
import { Comment } from '__mocks__/types';

const RequestResponseComponent: React.FunctionComponent<
    WithCollectionInjectedProps<Comment>
> = ({ data }) =>
    data ? (
        <div>
            {data.map(comment => (
                <p key={comment.id}>{comment.attributes.body}</p>
            ))}
        </div>
    ) : null;

export default withCollection<Comment>({
    resourceType: 'comments',
})(RequestResponseComponent);

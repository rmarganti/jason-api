// External dependencies
import * as React from 'react';

// Internal dependencies
import { withItem, WithItemInjectedProps } from '../withItem';

// Testing dependencies
import { Article } from '__mocks__/types';

const RequestResponseComponent: React.FunctionComponent<
    WithItemInjectedProps<Article>
> = ({ data }) =>
    data && data.attributes ? <h1>{data.attributes.title}</h1> : null;

export default withItem<Article>({
    resourceType: 'articles',
    resourceId: '1',
})(RequestResponseComponent);

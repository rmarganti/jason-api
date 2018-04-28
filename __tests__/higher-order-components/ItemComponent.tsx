import * as React from 'react';
import { Comment } from '../mocks/types';
import { WithQueryInjectedProps } from '../../src/higher-order-components/withQuery';

type ExternalProps = {
    id?: string;
};

type Props = WithQueryInjectedProps<Comment> & ExternalProps;

const ItemComponent: React.StatelessComponent<Props> = ({ data }) =>
    data ? <p>{data.attributes.body}</p> : null;

export default ItemComponent;

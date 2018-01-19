import * as PropTypes from 'prop-types';
import * as React from 'react';

const CollectionComponent = ({ data }) => (
    <div>{data.map(article => <p key={article.id}>{article.title}</p>)}</div>
);

CollectionComponent.propTypes = {
    data: PropTypes.array,
};

export default CollectionComponent;

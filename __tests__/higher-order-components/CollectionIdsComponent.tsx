import * as PropTypes from 'prop-types';
import * as React from 'react';

const CollectionIdsComponent = ({ ids }) => (
    <div>
        { ids.map(id => <p key={id}>{ id }</p>) }
    </div>
);

CollectionIdsComponent.propTypes = {
    ids: PropTypes.array,
};

export default CollectionIdsComponent;

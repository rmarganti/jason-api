// External dependencies
import * as React from 'react';

// Internal dependencies
import { useCollection } from '../useCollection';

// Testing dependencies
import { Article } from '../../../../__mocks__/types';

const CollectionComponent: React.FunctionComponent = () => {
    const collection = useCollection<Article>('articles');

    return (
        <div>
            {collection.map(article => (
                <p key={article.id}>{article.attributes.title}</p>
            ))}
        </div>
    );
};

export default CollectionComponent;

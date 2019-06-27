import * as React from 'react';
import { useItem } from '../../../src';
import { Person } from 'src/types';

interface AuthorProps {
    id: string;
}

const Author: React.SFC<AuthorProps> = ({ id }) => {
    const author = useItem<Person>('people', id);

    if (!author) {
        return null;
    }

    return (
        <span>
            {author.attributes.firstName} {author.attributes.lastName}
        </span>
    );
};

export default Author;

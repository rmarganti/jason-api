// External Dependencies
import { ResourceObject, Relationship } from 'ts-json-api';

export interface Article extends ResourceObject {
    type: 'articles';
    attributes: {
        title: string;
        body: string;
    };
    relationships: {
        comments: Relationship<Comment[]>;
    };
}

export interface Comment extends ResourceObject {
    type: 'comments';
    attributes: {
        body: string;
    };
    relationships: {
        author: Relationship<Person>;
    };
}

export interface Person extends ResourceObject {
    type: 'people';
    attributes: {
        firstName: string;
        lastName: string;
        twitter: string;
    };
}

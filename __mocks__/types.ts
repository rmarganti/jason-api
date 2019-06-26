import { ResourceObject, Relationship } from 'ts-json-api';

export interface Article extends ResourceObject {
    type: 'articles';
    attributes: {
        title: string;
    };
    relationships: {
        author: Relationship<People>;
        comments: Relationship<Comment[]>;
    };
}

export interface Comment extends ResourceObject {
    type: 'comments';
    attributes: {
        body: string;
    };
    relationships: {
        author: Relationship<People>;
    };
}

export interface People extends ResourceObject {
    type: 'people';
    attributes: {
        firstName: string;
        lastName: string;
        twitter: string;
    };
}

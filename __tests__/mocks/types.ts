import { ResourceObject, Relationship } from 'ts-json-api';

export interface Article extends ResourceObject {
    type: 'articles';
    attributes: {
        title: string;
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
}

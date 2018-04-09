import * as JsonApi from 'ts-json-api/types/structure';

export interface Article extends JsonApi.ResourceObject {
    type: 'articles';
    attributes: {
        title: string;
    };
    relationships: {
        comments: JsonApi.Relationship<Comment[]>;
    };
}

export interface Comment extends JsonApi.ResourceObject {
    type: 'comments';
    attributes: {
        body: string;
    };
}

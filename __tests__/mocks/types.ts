import * as JsonApi from 'ts-json-api';

type ArticleAttributes = {
    title: string;
};

export type ArticleResource = JsonApi.iResourceObject<
    'articles',
    ArticleAttributes
>;

type CommentAttributes = {
    body: string;
};

export type CommentResource = JsonApi.iResourceObject<
    'comments',
    CommentAttributes
>;

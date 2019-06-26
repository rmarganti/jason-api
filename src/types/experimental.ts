import { Article, Comment } from '../../__mocks__/types';

interface KnownResourceTypes {
    articles: Article;
    comments: Comment;
}

export interface JasonApiState {
    resourceObjects: ResourceObjectsFor<KnownResourceTypes>;
}

type ResourceObjectsFor<T> = {
    x: T;
};

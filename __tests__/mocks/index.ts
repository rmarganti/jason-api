import * as JsonApi from 'ts-json-api';
import * as Resources from './types';

export const initialJsonApiResponse: JsonApi.iResponseWithData<
    Resources.ArticleResource[]
> = require('./initialJsonApiResponse.json');

export const commentJsonResponse: JsonApi.iResponseWithData<
    Resources.CommentResource
> = require('./commentJsonResponse.json');

export const commentsJsonResponse: JsonApi.iResponseWithData<
    Resources.CommentResource[]
> = require('./commentsJsonResponse.json');

export const serverSideRendering = require('./serverSideRendering.json');

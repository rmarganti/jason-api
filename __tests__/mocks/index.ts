import * as JsonApi from 'ts-json-api/types/structure';
import * as Resources from './types';

export const initialJsonApiResponse: JsonApi.ResponseWithData<
    Resources.Article[]
> = require('./initialJsonApiResponse.json');

export const commentJsonResponse: JsonApi.ResponseWithData<
    Resources.Comment
> = require('./commentJsonResponse.json');

export const commentsJsonResponse: JsonApi.ResponseWithData<
    Resources.Comment
> = require('./commentsJsonResponse.json');

export const serverSideRendering = require('./serverSideRendering.json');

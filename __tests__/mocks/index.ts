import { ResponseWithData } from 'ts-json-api';
import * as Resources from './types';

export const initialJsonApiResponse: ResponseWithData<
    Resources.Article[]
> = require('./initialJsonApiResponse.json');

export const commentJsonResponse: ResponseWithData<
    Resources.Comment
> = require('./commentJsonResponse.json');

export const commentsJsonResponse: ResponseWithData<
    Resources.Comment
> = require('./commentsJsonResponse.json');

export const serverSideRendering = require('./serverSideRendering.json');

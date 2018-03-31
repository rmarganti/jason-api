import { AxiosError } from 'axios';
import * as JsonApi from 'ts-json-api';
/**
 * Extract valid JSON API errors from an Axios error response.
 * If the API * did not return valid JSON API response, build
 * one from the known server/client details.
 *
 * @param error
 */
export declare const extractJsonApiErrorFromAxios: (error: AxiosError) => JsonApi.iResponseWithErrors;
/**
 * Take an array of Jason API error objects, and concat
 * them into a single, human-readable string.
 *
 * @param errorJson
 */
export declare const stringifyJsonApiErrors: (errorJson: JsonApi.iResponseWithErrors) => string;

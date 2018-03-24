import { AxiosError } from 'axios';
import { iAttributes, iResourceObject, iResponseWithError } from 'ts-json-api';
/**
 * Extract valid JSON API errors from an Axios error response. If the API
 * did not return valid JSON API response, build a generic one that matches
 * the format.
 *
 * @param error
 */
export declare const extractJsonApiErrorFromAxios: (error: AxiosError) => iResponseWithError<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
export declare const stringifyJsonApiErrors: (errorJson: iResponseWithError<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>) => string;

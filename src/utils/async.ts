import { AxiosError } from 'axios';
import { iJsonApiResponseWithError } from 'ts-json-api';

/**
 * Extract valid JSON API errors from an Axios error response. If the API
 * did not return valid JSON API response, build a generic one that matches
 * the format.
 *
 * @param error
 */
export const extractJsonApiErrorFromAxios = (
    error: AxiosError
): iJsonApiResponseWithError => {
    if (error.response && error.response.data.errors) {
        return error.response.data;
    } else if (error.request) {
        return {
            errors: [
                {
                    status: error.request.status,
                    detail: error.request.statusText,
                },
            ],
        };
    }

    return {
        errors: [
            {
                detail: error.message,
            },
        ],
    };
};

export const stringifyJsonApiErrors = (errorJson: iJsonApiResponseWithError) =>
    errorJson.errors.map(error => error.detail || error.title).join('\n');

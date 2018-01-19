import { iResourceObject, iJsonApiResponseWithData } from 'ts-json-api';

import { iJasonApiState } from './state';

export type FlexiblePayload =
    | iResourceObject
    | iResourceObject[]
    | iJsonApiResponseWithData;

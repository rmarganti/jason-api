import { iResourceObject, iResponseWithData, iResponse } from 'ts-json-api';

import { iJasonApiState } from './state';

export type FlexiblePayload = iResourceObject | iResourceObject[] | iResponse;

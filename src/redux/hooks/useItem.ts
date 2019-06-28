import { useSelector } from 'react-redux';
import { ResourceObject } from 'ts-json-api';

import { getResourceObject } from '../selectors';

export const useItem = <T extends ResourceObject = ResourceObject>(
    resourceType: string,
    resourceId: string
): T | undefined => useSelector(getResourceObject(resourceType, resourceId));

// External dependencies
import { useSelector } from 'react-redux';
import { ResourceObject } from 'ts-json-api';

// Internal dependencies
import { StateWithJasonApi } from '../../types/state';
import { getResourceObject } from '../selectors';

export const useItem = <T extends ResourceObject = ResourceObject>(
    resourceType: string,
    resourceId: string
): T | undefined => useSelector(createItemSelector(resourceType, resourceId));

const createItemSelector = <T extends ResourceObject = ResourceObject>(
    resourceType: string,
    resourceId: string
) => (state: StateWithJasonApi) =>
    getResourceObject<T>(state, resourceType, resourceId);

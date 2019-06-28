import { useSelector } from 'react-redux';
import { ResourceObject } from 'ts-json-api';

import { getResourceObjects } from '../selectors';

export const useCollection = <T extends ResourceObject = ResourceObject>(
    resourceType: string,
    resourceIds?: string[],
    expandResourceObjects?: boolean
): T[] =>
    useSelector(
        getResourceObjects(resourceType, resourceIds, expandResourceObjects)
    );

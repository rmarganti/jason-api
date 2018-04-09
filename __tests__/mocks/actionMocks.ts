import * as pluralize from 'pluralize';
import { AnyAction } from 'redux';

import * as actionTypes from '../../src/redux/actionTypes';
import * as actions from '../../src/redux/actions';

const singularize = word => pluralize(word, 1);

/**
 * Generate action(s) for setting initial loading states
 *
 * @param   resourceType
 * @param   resourceId
 * @return {Object|Array}
 */
export const startLoading = (resourceType, resourceId) => {
    const returnedActions: AnyAction[] = [{ type: 'START_LOADING' }];

    if (resourceId) {
        returnedActions.push.apply(returnedActions, [
            actions.updateResourceObjectMeta(
                resourceType,
                resourceId,
                'loading',
                true
            ),

            actions.updateResourceObjectMeta(
                resourceType,
                resourceId,
                'errors',
                null
            ),
        ]);
    } else if (resourceType) {
        returnedActions.push.apply(returnedActions, [
            actions.updateResourceObjectsMeta(resourceType, 'loading', true),
            actions.updateResourceObjectsMeta(resourceType, 'errors', null),
        ]);
    }

    return returnedActions;
};

/**
 * Generate action(s) for setting loading states to false
 *
 * @param   resourceType
 * @param   resourceId
 * @return {Object|Array}
 */
export const stopLoading = (resourceType, resourceId) => {
    const returnedActions: AnyAction[] = [{ type: 'STOP_LOADING' }];

    if (resourceId) {
        returnedActions.push(
            actions.updateResourceObjectMeta(
                resourceType,
                resourceId,
                'loading',
                false
            )
        );
    } else if (resourceType) {
        returnedActions.push(
            actions.updateResourceObjectsMeta(resourceType, 'loading', false)
        );
    }

    return returnedActions;
};

/**
 * Generate action(s) for setting loading states to true then false
 *
 * @param  resourceType
 * @param  resourceId
 */
export const startAndStopLoading = (
    resourceType: string,
    resourceId?: string
) => [
    ...startLoading(resourceType, resourceId),
    ...stopLoading(resourceType, resourceId),
];

/**
 * Generate a LOAD_DATA action
 *
 * @param  response
 */
export const loadResponse = (response, resourceType) => {
    const returnedActions: AnyAction[] = [
        { type: actionTypes.LOAD_DATA, payload: response },
    ];

    return returnedActions;
};

/**
 * Generate an action to add a relationship
 *
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 * @param response
 */
export const addRelationship = (
    resourceType,
    resourceId,
    relationshipKey,
    response
) =>
    actions.addRelationshipToResourceObject(
        resourceType,
        resourceId,
        relationshipKey,
        response
    );

/**
 * Generate an action to remove a relationship
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  response
 */
export const removeRelationship = (
    resourceType,
    resourceId,
    relationshipKey,
    relationshipId
) =>
    actions.removeRelationshipFromResourceObject(
        resourceType,
        resourceId,
        relationshipKey,
        relationshipId
    );

/**
 * Generate an action to remove a Resource Object from the store
 * @param resourceType
 * @param resourceId
 */
export const removeResourceObject = (resourceType, resourceId) =>
    actions.removeResourceObject(resourceType, resourceId);

/**
 * Create an action to cache a query response
 *
 * @param url
 * @param query
 */
export const cacheQuery = (url, query) => actions.cacheQuery(url, query);

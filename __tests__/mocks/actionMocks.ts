import * as pluralize from 'pluralize';

import * as actions from '../../src/redux/actions';

interface iBasicAction {
    type: string;
    [index: string]: any;
}

const singularize = word => pluralize(word, 1);

/**
 * Generate action(s) for setting initial loading states
 *
 * @param  {String}        resourceType
 * @param  {String}        resourceId
 * @return {Object|Array}
 */
export const startLoading = (resourceType, resourceId) => {
    const returnedActions: iBasicAction[] = [{ type: 'START_LOADING' }];

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
 * @param  {String}        resourceType
 * @param  {String}        resourceId
 * @return {Object|Array}
 */
export const stopLoading = (resourceType, resourceId) => {
    const returnedActions: iBasicAction[] = [{ type: 'STOP_LOADING' }];

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
 * @param  {String}        resourceType
 * @param  {String}        resourceId
 * @return {Object|Array}
 */
export const startAndStopLoading = (
    resourceType: string,
    resourceId?: string
) => [
    ...startLoading(resourceType, resourceId),
    ...stopLoading(resourceType, resourceId),
];

/**
 * Generate a LOAD_JSON_API_ENTITY_DATA action
 *
 * @param  {Object} response
 * @return {Object}
 */
export const loadResponse = (response, resourceType) => {
    const returnedActions: iBasicAction[] = [
        { type: 'LOAD_JSON_API_ENTITY_DATA', payload: { data: response } },
    ];

    return returnedActions;
};

/**
 * Generate an action to add a relationship
 *
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {String} relationshipKey
 * @param  {Object} response
 * @return {Object}
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
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {String} relationshipKey
 * @param  {Object} response
 * @return {Object}
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

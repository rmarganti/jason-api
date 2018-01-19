import * as pluralize from 'pluralize';

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
            {
                resourceId,
                resourceType: resourceType,
                metaKey: 'loading',
                type: `UPDATE_ENTITY_META_${singularize(
                    resourceType.toUpperCase()
                )}`,
                value: true,
            },
            {
                resourceType: resourceType,
                resourceId,
                metaKey: 'errors',
                type: `UPDATE_ENTITY_META_${singularize(
                    resourceType.toUpperCase()
                )}`,
                value: null,
            },
        ]);
    } else if (resourceType) {
        returnedActions.push.apply(returnedActions, [
            {
                resourceType: resourceType,
                metaKey: 'loading',
                type: `UPDATE_ENTITIES_META_${pluralize(
                    resourceType.toUpperCase()
                )}`,
                value: true,
            },
            {
                resourceType: resourceType,
                metaKey: 'errors',
                type: `UPDATE_ENTITIES_META_${pluralize(
                    resourceType.toUpperCase()
                )}`,
                value: null,
            },
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
        returnedActions.push({
            resourceId,
            resourceType: resourceType,
            metaKey: 'loading',
            type: `UPDATE_ENTITY_META_${singularize(
                resourceType.toUpperCase()
            )}`,
            value: false,
        });
    } else if (resourceType) {
        returnedActions.push({
            resourceType: resourceType,
            metaKey: 'loading',
            type: `UPDATE_ENTITIES_META_${pluralize(
                resourceType.toUpperCase()
            )}`,
            value: false,
        });
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
        { type: 'LOAD_JSON_API_ENTITY_DATA', data: response },
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
) => ({
    type: `ADD_RELATIONSHIP_TO_ENTITY_${resourceType.toUpperCase()}_${relationshipKey.toUpperCase()}`,
    resourceType,
    resourceId,
    relationshipKey,
    relationshipObject: response,
});

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
) => ({
    type: `REMOVE_RELATIONSHIP_FROM_ENTITY_${resourceType.toUpperCase()}_${relationshipKey.toUpperCase()}`,
    resourceType,
    resourceId,
    relationshipKey,
    relationshipId,
});

export const removeResourceObject = (resourceType, resourceId) => ({
    type: `REMOVE_ENTITY_${singularize(resourceType.toUpperCase())}`,
    resourceType,
    resourceId,
});

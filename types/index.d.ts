export { compose, pipe } from 'ramda';
export { addRelationshipToResourceObject, clearResourceObjectType, loadJsonApiResourceObjectData, removeRelationshipFromResourceObject, removeResourceObject, setRelationshipOnResourceObject, updateResourceObject, updateResourceObjectMeta, updateResourceObjectsMeta } from './redux/actions';
export { default as middleware, middlewareFactory } from './redux/middleware';
export * from './redux/selectors';
export { default as reducer } from './redux/reducer';
export { FlexiblePayload } from './interfaces/other';
export * from './higher-order-components';
export { JASON_API_REQUEST } from './constants';

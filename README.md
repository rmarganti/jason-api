![Logo](./imgs/header.png)

# JasonAPI

Consume and manipulate [JSON API standard](http://jsonapi.org/) data in Redux with scary ease.

## Hooking up the reducer and middleware

```js
import {
    reducer as resourceObjects,
    middleware as jasonApiMiddleware,
} from 'jason-api';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import * as yourReducers from './reducers';

const store = createStore(
    combineReducers({ ...yourReducers, resourceObjects }),
    applyMiddleware(jasonApiMiddleware)
);
```

## Talking to an API

Below is a couple simple examples of action creators. The only required options are the
`type` (must be set to `JASON_API_REQUEST`) and `url`. This will make a request
to the given URL, normalize the response, and update the store. Additionally, since
we set the `resourceType` and `resourceId`, the meta data for that particular entity
will be updated to reflect `isLoading` and `error` status.

JasonAPI action creators also play nice with our Higher Order Components, enabling
intelligent caching, error-handling, and much more. There's plenty of additional,
helpful options; so be sure to check the WIKI.

```js
import { JASON_API_REQUEST } from 'jason-api';

const getUser = userId => ({
    type: JASON_API_REQUEST,
    url: `/api/users/${userId}`,
    resourceType: 'users',
    resourceId: userId,
});

/**
 * NOTE: Since our payload contains the `type` and `id`, we can
 * choose to skip including those options like we did above.
 */
const updateUser = (userId, attributes) => ({
    type: JASON_API_REQUEST,
    url: `/api/users/${userId}`,
    method: 'post',
    payload: {
        type: 'users',
        id: userId,
        attributes,
    },
});

// JASON_API_REQUEST action creators return a Promise when dispatched.
dispatch(getUser('12345')).then(response =>
    console.log(response.data.attributes.firstName)
);

// Or Use Await if that's your thing
const result = await(dispatch(updateUser('12345', { firstName: 'Enrique' })));
console.log(result);
```

## Using HOC's

```js
import { compose, withMutations, withQuery } from 'jason-api';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { getUser, updateUser } from './yourActions';

const User = ({
    data,
    isLoading, // Automatically updated based on the status of your queryFactory's Promise
    refetch, // Re-run your queryFactory.
    ...anyOtherDataInAJsonApiResponse // `meta`, `errors`, etc.
}) =>
    isLoading ? (
        <p>Loading...</p>
    ) : (
        <div>
            <h1>{data.firstName} {data.lastName}</h1>
            <p>{data.email}</p>
        </div>
    );

const enhance = withQuery({
    // queryFactory is a function that returns Promise that resolves to a JSON API response.
    // HINT: Any dispatch()'ed JASON_API_REQUEST fits this criteria.
    queryFactory: (dispatch, props) => dispatch(getUser(props.id)),
    propsToWatch: ['userId'],
});

const EnhancedUser = enhance(YourUserComponent);
```

Now, you can use the `EnhancedUser` component wherever you may need them. `<EnhancedUser id="12345" />`.

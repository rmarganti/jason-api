![Logo](./imgs/header.png)

# JasonAPI

Consume and manipulate [JSON API standard](http://jsonapi.org/)
data in Redux with scary ease.

## Hooking up the reducer and middleware

```ts
import {
    // All of JasonAPI's HOC's default to using `resourceObjects`
    // as the redux store key, so we recommend you do the same.
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

## A Basic (But Powerful) Example

Below is a simple example. Hopefully, it should demonstrate how the individual
pieces play together. With just a little bit of code, you get JSON API-compliant
api calls, caching, loading status management, error-handling, and efficient
React renders.

```js
import { JSON_API_REQUEST, withItem, withQuery } from 'jason-api';

const fetchUsers = () => ({
    type: JSON_API_REQUEST,
    url: '/api/users',
});

const UsersList = ({ data, errors, isLoading }) =>
    isLoading ? (
        <YourLoadingComponent />
    ) : error ? (
        <YourErrorsComponent errors={errors} />
    ) : (
        <div>
            <h1>Users</h1>
            {data.map(user => <EnhancedUser data={user} />)}
        </div>
    );

const EnhancedUsersList = withQuery({
    queryFactory: dispatch => dispatch(fetchUsers()),
});

const User = ({ data }) => (
    <div>
        <h2>{data.attributes.userName}</h2>
        <h3>{data.attributes.email}</h3>
    </div>
);

const EnhancedUser = withItem()(User);
```

## Talking to an API

Below is a couple simple examples of action creators. The only required
options are the `type` (must be set to `JASON_API_REQUEST`) and `url`.
This will make a request to the given URL, normalize the response, and update
the store. Additionally, since we set the `resourceType` and `resourceId`,
the meta data for that particular entity will be updated to reflect `isLoading`
and `error` status.

JasonAPI action creators also play nice with our Higher Order Components,
enabling intelligent caching, error-handling, and much more. There's plenty
of additional, helpful options; so be sure to check the WIKI.

```ts
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
const result = await dispatch(updateUser('12345', { firstName: 'Enrique' }));
console.log(result);
```

## Using HOC's

Combining JasonAPI's action creators and high-order components
makes for a simple and powerful way to fetch data from your API.


### withQuery()

`withQuery` triggers and manages any Promise that resolves to a JSON API
response. With it, you get caching, loading status management, and error
handling. This HOC pairs well with `JASON_API_REQUEST` action creators.

```js
import { withQuery } from 'jason-api';
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
            <h1>{data.attributes.firstName} {data.attributes.lastName}</h1>
            <p>{data.attributes.email}</p>
        </div>
    );

const enhance = withQuery({
    // queryFactory is a function that returns a Promise
    // that resolves to a JSON API response. HINT: Any
    // dispatch()'ed JASON_API_REQUEST fits this criteria.
    queryFactory: (dispatch, props) => dispatch(getUser(props.id)),

    // Determines how caching is handled.
    // `cacheFirst` (default) ➡ Initially load the cached query,
    //     but still trigger the `queryFactory` for an updated.
    // `cacheOnly` ➡ If a cached version exists, use that without
    //     triggering the `queryFactory`.
    // `noCache` ➡ Never use the cached version, always trigger `queryFactory`.
    cacheScheme: 'cacheFirst',

    // Should full resource objects be provided to your component? Otherwise,
    // the resource objects will only contain a `type` and `id`. This useful for
    // optimizing React renders. Generally, you will want `true` for single-item
    // response and `false` for collection responses. Your individual collection
    // items can then be individually grabbed from the redux store using
    // `withItem()`. `false` by default.
    expandResourceObjects: true,

    // Any time any of the given props change,
    // the queryFactory will be retriggered.
    propsToWatch: ['id'],

    // By default, JasonAPI assumes its reducer is keyed by `resourceObjects`.
    // If you change it for some reason (we don't recommend you do), you can
    // let `withQuery` know to look for it a different key.
    stateBranch: 'resourceObjects',
});

const EnhancedUser = enhance(User);
```

Now, you can use the `EnhancedUser` component wherever you may need them.
`<EnhancedUser id="12345" />`.


### withItem()

Grab a previously fetched, single resource object from the JasonAPI redux store.
You can either explicity state the type and id of the resouce object you want
to grab, or you can pass in a simplified resource object via the `data` prop
to get the expanded resource object.

Your Component will receive your resource object in the `data` prop, similar
to `withQuery` above. However, you will not receive `isLoading`, etc., since
`withItem` does not trigger an async request.

```js
import { withItem } from 'jason-api';

const enhance = withItem({
    // Optional if using the `data` prop method.
    resourceType: 'users',

    // Optional if you want to use the `id` or `data` prop methods shown below.
    resourceId: '12345',
});

const EnhancedUser = enhance(YourUserComponent);

// If you included `resourceId` in your options.
<EnhancedUser />

// If you did not include `resourceId` in your options,
// or you want to overwrite it.
<EnhancedUser id="12345" />

// Useful for iterating over the simplified resource objects
// returned from a `withQuery` collection response.
<EnhancedUser data={{ type: 'users', id: '12345' }} />
```

### withCollection()

```js
import { withCollection } from 'jason-api';

const enhance = withCollection({
    resourceType: 'users',

    // Optional if you want to set it dynamically with
    // the `ids` prop on your enhanced Component.
    ids: ['12345', '54321'],

    // Unless set to `true`, your resource objects will be simplified
    // and returned with only the `type` and `id` props. You will get
    // more effecient React renders if you iterate over these and use
    // `withItem` to fetch the complete data on the item-level.
    expandResourceObjects: false,
});

const EnhancedUsers = enhance(Users);

// If you included `ids` in your options above, those will be returned.
// If not, all resource objects of the given type will be returned.
<EnhancedUsers />

// If you want to set id's dynamically.
<EnhancedUsers ids={['12345', '54321']} />
```

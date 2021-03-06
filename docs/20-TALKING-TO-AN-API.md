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
const result = await dispatch(updateUser('12345', { firstName: 'Enrique' }));
console.log(result);
```

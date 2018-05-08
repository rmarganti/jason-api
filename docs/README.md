![Logo](./imgs/header.png)

# JasonAPI

Consume and manipulate [JSON API standard](http://jsonapi.org/)
data in Redux with scary ease.

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

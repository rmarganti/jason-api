# withQuery()
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
    expandResourceObjects: true,
    propsToWatch: ['id'],
});

const EnhancedUser = enhance(User);
```

Now, you can use the `EnhancedUser` component wherever you may need them.
`<EnhancedUser id="12345" />`.

## Options


// External dependencies
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';

// Internal dependencies
import { jasonApiRequest } from '../../actions';
import { useRequestResponse } from '../useRequestResponse';

// Testing dependencies
import { articleResponse } from '../../../../__mocks__/articleResponse';
import { Article } from '../../../../__mocks__/types';

// Mock Action Creator
const mockAction = (articleId: string) =>
    jasonApiRequest({
        url: `/api/article/${articleId}`,
    });

const mock = new MockAdapter(axios);
mock.onGet().reply(200, articleResponse);

const RequestResponseComponent: React.FunctionComponent = () => {
    const action = mockAction('1');
    const response = useRequestResponse<Article>({
        action,
        expandResourceObjects: true,
    });

    return response.data ? <h1>{response.data.attributes.title}</h1> : null;
};

export default RequestResponseComponent;

import { mount } from 'enzyme';
import 'jest';
import * as React from 'react';
import withQuery from '../../src/higher-order-components/withQuery';
import { commentJsonResponse } from '../mocks';
import ItemComponent from './ItemComponent';
import { defaultStore } from '../tools';
import { Provider } from 'react-redux';

describe('withQuery', () => {
    it('works on a basic level', done => {
        const WithQueryComponent = withQuery({
            queryFactory: () => Promise.resolve(commentJsonResponse),
            expandResourceObjects: true,
        })(ItemComponent);

        const wrapper = mount(
            <Provider store={defaultStore}>
                <WithQueryComponent id="5" />
            </Provider>
        );

        setTimeout(() => {
            expect(wrapper.html()).toEqual(
                `<p>${commentJsonResponse.data.attributes.body}</p>`
            );
            done();
        }, 125);
    });
});

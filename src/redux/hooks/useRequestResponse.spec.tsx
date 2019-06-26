// External dependencies
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';

// Testing dependencies
import { defaultStore } from '../../../__tests__/tools';
import RequestResponseComponent from './__mocks__/RequestResponseComponent';

describe('useItem', () => {
    it('retrieves a ResourceItem from the store', done => {
        const wrapper = mount(
            <Provider store={defaultStore}>
                <RequestResponseComponent />
            </Provider>
        );

        // Wait a short period of time to allow fake network response to return.
        setTimeout(() => {
            expect(wrapper.html()).toContain('JSON API paints my bikeshed!');
            done();
        }, 10);
    });
});

// External dependencies
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';

// Testing dependencies
import { defaultStore } from '../../../__tests__/tools';
import ItemComponent from './__mocks__/ItemComponent';

describe('useItem', () => {
    it('retrieves a ResourceItem from the store', () => {
        const wrapper = mount(
            <Provider store={defaultStore}>
                <ItemComponent id="5" />
            </Provider>
        );

        expect(wrapper.find('p')).toHaveLength(1);
    });
});

import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';

import withItem from '../../src/higher-order-components/withItem';
import { defaultStore } from '../tools';
import ItemComponent from './ItemComponent';
import { Provider } from 'react-redux';

describe('withItem', () => {
    it('gets item info from store and calls the loading action', () => {
        const WithItemComponent = withItem({
            resourceType: 'comments',
        })(ItemComponent);

        const wrapper = mount(
            <Provider store={defaultStore}>
                <WithItemComponent id="5" />
            </Provider>
        );

        expect(wrapper.find('p')).toHaveLength(1);
    });
});

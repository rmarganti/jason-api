import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';

import withItem from '../../src/higher-order-components/withItem';
import { defaultStore } from '../tools';
import ItemComponent from './ItemComponent';

describe('withItem', () => {
    it('gets item info from store and calls the loading action', () => {
        const loadingAction = sinon.spy();

        const WithItemComponent = withItem({
            resourceType: 'comments',
        })(ItemComponent);

        const wrapper = mount(
            <WithItemComponent store={defaultStore} id="5" />
        );

        expect(wrapper.find('p')).toHaveLength(1);
    });
});

import { mount } from 'enzyme';
import 'jest';
import * as React from 'react';
import { Provider } from 'react-redux';
import withCollection from '../../src/higher-order-components/withCollection';
import { defaultStore } from '../tools';
import CollectionComponent from './CollectionComponent';

describe('withCollection', () => {
    it('gets collection info from the store', () => {
        const WithCollectionComponent = withCollection({
            resourceType: 'articles',
            expandResourceObjects: true,
        })(CollectionComponent);

        const wrapper = mount(
            <Provider store={defaultStore}>
                <WithCollectionComponent />
            </Provider>
        );

        expect(wrapper.find('p')).toHaveLength(1);
    });
});

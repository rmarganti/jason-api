import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';

import withCollection from '../../src/higher-order-components/withCollection';
import { defaultStore } from '../tools';
import CollectionComponent from './CollectionComponent';

describe('withCollection', () => {
    it('gets collection info from the store', () => {
        const loadingAction = sinon.spy();

        const WithCollectionComponent = withCollection({
            resourceType: 'articles',
        })(CollectionComponent);

        const wrapper = mount(<WithCollectionComponent store={defaultStore} />);

        expect(wrapper.find('p')).toHaveLength(1);
    });
});

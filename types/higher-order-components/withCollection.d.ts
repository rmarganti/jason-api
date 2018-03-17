import { DispatchProp, InferableComponentEnhancerWithProps } from 'react-redux';
import { iResourceObject } from 'ts-json-api';
export interface iWithCollectionOptions {
    resourceType: string;
    ids?: string[];
    shouldExpand?: boolean;
}
export interface iWithCollectionProps {
    ids: string[];
}
export interface iWithCollectionPassedProps extends DispatchProp<any> {
    data: iResourceObject[];
}
declare const withCollection: ({resourceType, ids: resourceIds, shouldExpand}: iWithCollectionOptions) => InferableComponentEnhancerWithProps<{
    data: any;
} & DispatchProp<any>, iWithCollectionProps>;
export default withCollection;

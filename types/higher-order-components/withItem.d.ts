import { DispatchProp, InferableComponentEnhancerWithProps } from 'react-redux';
import { iAttributes, iResourceObject } from 'ts-json-api';
export interface iWithItemOptions {
    resourceType?: string;
    resourceId?: string;
}
export interface iWithItemProps {
    data?: iResourceObject;
    id?: string;
}
declare const withItem: ({ resourceType, resourceId }?: iWithItemOptions) => InferableComponentEnhancerWithProps<({
    data: {};
} & DispatchProp<any>) | ({
    data: iResourceObject<string, iAttributes>;
} & DispatchProp<any>), iWithItemProps>;
export default withItem;

import { Dispatch, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { iResourceObject } from 'ts-json-api';

export interface Pagination {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
}

export interface HocOptions {
    resourceType: string;
    loadingAction?: (dispatch: Dispatch<any>, props: AnyProps) => boolean;
    loadingCondition?: (oldProps: AnyProps, newProps: AnyProps) => boolean;
    mapStateToProps?: MapStateToProps<any, any, any>;
    mapDispatchToProps?: MapDispatchToProps<any, any>;
    propsToWatch?: string[];
}

export interface WithCollectionProps {
    collection: iResourceObject[];
    current: string[];
    loadingAction?: (props: any) => boolean;
    loadingStatus: boolean;
    errorStatus: any;
    [index: string]: any;
}

export interface WithCollectionIdsProps {
    current: string[];
    ids: string[];
    loadingAction?: (props: any) => boolean;
    loadingStatus: boolean;
    errorStatus: any;
    [index: string]: any;
}

export interface WithItemProps {
    errorStatus: any;
    loadingAction?: (props: any) => boolean;
    loadingStatus: boolean;
    item: iResourceObject;
    [index: string]: any;
}

export interface AnyProps {
    [index: string]: any;
}

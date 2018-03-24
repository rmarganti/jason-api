/// <reference types="react" />
/// <reference types="react-redux" />
import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as JsonApi from 'ts-json-api';
import { iAttributes, iResourceObject, iResponse } from 'ts-json-api';
import { iStateWithJasonApi } from '../interfaces/state';
export declare type TQueryFactory = (dispatch: Dispatch<iStateWithJasonApi>, props: object) => Promise<JsonApi.iResponse>;
export interface iWithQueryOptions {
    cacheScheme: 'cacheFirst' | 'cacheOnly' | 'noCache';
    propsToWatch: string[];
    queryFactory: TQueryFactory;
    stateBranch?: string;
}
declare const withQuery: ({cacheScheme, queryFactory, propsToWatch, stateBranch}: iWithQueryOptions) => <TPassedProps extends {
    isLoading: boolean;
    refetch: () => void;
} & Partial<iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>>>(BaseComponent: React.ComponentType<TPassedProps>) => React.ComponentClass<Pick<TPassedProps & {
    cachedQuery: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
    cacheQueryResult: (response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>) => void;
    fetchData: () => Promise<iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>>;
}, ({
    [P in keyof (TPassedProps & {
        cachedQuery: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
        cacheQueryResult: (response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>) => void;
        fetchData: () => Promise<iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>>;
    })]: P;
} & {
    cachedQuery: never;
    fetchData: never;
    cacheQueryResult: never;
} & {
    [x: string]: never;
})[keyof (TPassedProps & {
    cachedQuery: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
    cacheQueryResult: (response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>) => void;
    fetchData: () => Promise<iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>>;
})]> & object> & {
    WrappedComponent: React.ComponentType<TPassedProps & {
        cachedQuery: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
        cacheQueryResult: (response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>) => void;
        fetchData: () => Promise<iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>>;
    }>;
};
export default withQuery;

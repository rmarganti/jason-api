/// <reference types="react" />
/// <reference types="react-redux" />
import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as JsonApi from 'ts-json-api';
import { iStateWithJasonApi } from '../common-types/state';
export declare type TQueryFactory = (dispatch: Dispatch<iStateWithJasonApi>, props: object) => Promise<JsonApi.iResponse>;
export interface iWithQueryOptions {
    cacheScheme: 'cacheFirst' | 'cacheOnly' | 'noCache';
    propsToWatch: string[];
    queryFactory: TQueryFactory;
    stateBranch?: string;
}
declare const withQuery: ({ cacheScheme, queryFactory, propsToWatch, stateBranch, }: iWithQueryOptions) => <TPassedProps extends {
    isLoading: boolean;
    refetch: () => void;
} & Partial<JsonApi.iResponse<JsonApi.iResourceObject<string, JsonApi.iAttributes> | JsonApi.iResourceObject<string, JsonApi.iAttributes>[]>>>(BaseComponent: React.ComponentType<TPassedProps>) => React.ComponentClass<Pick<TPassedProps & {
    cachedQuery: JsonApi.iResponse<JsonApi.iResourceObject<string, JsonApi.iAttributes> | JsonApi.iResourceObject<string, JsonApi.iAttributes>[]>;
    cacheQueryResult: (response: JsonApi.iResponse<JsonApi.iResourceObject<string, JsonApi.iAttributes> | JsonApi.iResourceObject<string, JsonApi.iAttributes>[]>) => void;
    fetchData: () => Promise<JsonApi.iResponse<JsonApi.iResourceObject<string, JsonApi.iAttributes> | JsonApi.iResourceObject<string, JsonApi.iAttributes>[]>>;
}, ({ [P in keyof TPassedProps | "cachedQuery" | "fetchData" | "cacheQueryResult"]: P; } & {
    cachedQuery: never;
    fetchData: never;
    cacheQueryResult: never;
} & {
    [x: string]: never;
})[keyof TPassedProps | "cachedQuery" | "fetchData" | "cacheQueryResult"]> & object> & {
    WrappedComponent: React.ComponentType<TPassedProps & {
        cachedQuery: JsonApi.iResponse<JsonApi.iResourceObject<string, JsonApi.iAttributes> | JsonApi.iResourceObject<string, JsonApi.iAttributes>[]>;
        cacheQueryResult: (response: JsonApi.iResponse<JsonApi.iResourceObject<string, JsonApi.iAttributes> | JsonApi.iResourceObject<string, JsonApi.iAttributes>[]>) => void;
        fetchData: () => Promise<JsonApi.iResponse<JsonApi.iResourceObject<string, JsonApi.iAttributes> | JsonApi.iResourceObject<string, JsonApi.iAttributes>[]>>;
    }>;
};
export default withQuery;

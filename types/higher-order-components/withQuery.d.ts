/// <reference types="react" />
/// <reference types="react-redux" />
import * as React from 'react';
import { Dispatch } from 'react-redux';
import { iJsonApiResponse, iJsonApiResponseWithData, iJsonApiResponseWithError, iJsonApiResponseWithMetaData } from 'ts-json-api';
import { iStateWithJasonApi } from '../interfaces/state';
export declare type TQueryFactory = (dispatch: Dispatch<iStateWithJasonApi>, props: object) => Promise<iJsonApiResponse>;
export interface iWithQueryOptions {
    propsToWatch: string[];
    queryFactory: TQueryFactory;
    stateBranch?: string;
}
declare const withQuery: ({queryFactory, propsToWatch, stateBranch}: iWithQueryOptions) => <TPassedProps extends ({
    isLoading: boolean;
    refetch: () => void;
} & Partial<iJsonApiResponseWithData>) | ({
    isLoading: boolean;
    refetch: () => void;
} & Partial<iJsonApiResponseWithError>) | ({
    isLoading: boolean;
    refetch: () => void;
} & Partial<iJsonApiResponseWithMetaData>)>(BaseComponent: React.ComponentType<TPassedProps>) => React.ComponentClass<Pick<TPassedProps & {
    cachedQuery: iJsonApiResponse;
    cacheQueryResult: (response: iJsonApiResponse) => void;
    fetchData: () => Promise<iJsonApiResponse>;
}, ({
    [P in keyof (TPassedProps & {
        cachedQuery: iJsonApiResponse;
        cacheQueryResult: (response: iJsonApiResponse) => void;
        fetchData: () => Promise<iJsonApiResponse>;
    })]: P;
} & {
    cachedQuery: never;
    fetchData: never;
    cacheQueryResult: never;
} & {
    [x: string]: never;
})[keyof (TPassedProps & {
    cachedQuery: iJsonApiResponse;
    cacheQueryResult: (response: iJsonApiResponse) => void;
    fetchData: () => Promise<iJsonApiResponse>;
})]> & object> & {
    WrappedComponent: React.ComponentType<TPassedProps & {
        cachedQuery: iJsonApiResponse;
        cacheQueryResult: (response: iJsonApiResponse) => void;
        fetchData: () => Promise<iJsonApiResponse>;
    }>;
};
export default withQuery;

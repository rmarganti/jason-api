/// <reference types="recompose" />
import { ComponentEnhancer } from 'recompose';
import { iJsonApiActionConfig } from '../interfaces/Middleware';
export interface iWithQueryOptions {
    actionCreator: (props: object) => iJsonApiActionConfig;
    propsToWatch: string[];
    stateBranch?: string;
}
declare const withQuery: ({actionCreator, propsToWatch, stateBranch}: iWithQueryOptions) => ComponentEnhancer<{}, {}>;
export default withQuery;

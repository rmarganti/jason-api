import { mockResponse } from './__mocks__/mockResponse';

// This would normally be explicitly defined, but we're being lazy.
export type Article = typeof mockResponse.data;

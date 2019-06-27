import { jasonApiRequest } from '../../src';

// These create a JasonAPI meta action. They will trigger
// the middleware, which will make the API call, normalize
// the response, update the redux store with returned data,
// and fire various actions during that life cycle.
export const getArticle = (articleId: string) =>
    jasonApiRequest({
        url: `/articles/${articleId}`,
    });

export const createArticle = (title: string) =>
    jasonApiRequest({
        method: 'post',
        url: '/articles',
        payload: {
            data: {
                type: 'articles',
                attributes: {
                    title,
                },
            },
        },
    });

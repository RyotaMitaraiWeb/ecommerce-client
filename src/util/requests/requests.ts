import { HttpStatus } from "../httpstatus.enum";
import { environment as dev } from '../../environment/env.development';
import { environment as prod } from "../../environment/env.production";
import { redirect } from "react-router-dom";

type method = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * 
 * @param method 
 * @param url 
 * @param body 
 * 
 * This function handles requests throughout the entire application. It attaches proper headers
 * depending on whether a body is provided or not and handles redirects for 404 and 403 errors. The ``body``
 * is stringified into JSON before sending the request.
 * The request comes with a generic template; the provided type is used as a type
 * for response body.
 * The ``url`` argument can either start with a slash or omit it, in the latter's case, the slash will be
 * preppended.
 */
async function request<T>(method: method, url: string = '', body?: any) {
    let api: string;
    if (process.env.NODE_ENV === 'development') {
        api = dev.api;
    } else if (process.env.NODE_ENV === 'production') {
        api = prod.api;
    } else {
        api = '';
    }

    // Prefix the slash at the beginning if it's not there
    if (!url.startsWith('/')) {
        url = '/' + url;
    }

    const headers: HeadersInit = {
        'Authorization': localStorage.getItem('accessToken') || '',
        'Access-Control-Allow-Origin': '*',
    };

    const request: any = {
        method,
        headers,
    };

    if (body) {
        headers['Content-Type'] = 'application/json';
        request.body = JSON.stringify(body);
    }

    const res = await fetch(api + url, request);

    const data: T = await res.json();

    return { res, data };
}

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const put = request.bind(null, 'PUT');
export const del = request.bind(null, 'DELETE');
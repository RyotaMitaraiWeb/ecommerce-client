import { HttpStatus } from "../src/util/httpstatus.enum";

export function rejectRequest() {
    return {
        status: HttpStatus.UNAUTHORIZED,
        contentType: 'application/json',
        body: JSON.stringify({
            _id: '',
            username: '',
            palette: 'deepPurple',
            theme: 'light',
        }),
    };
}

export function authorizeRequest() {
    return {
        status: HttpStatus.OK,
        contentType: 'application/json',
        body: JSON.stringify({
            _id: '1',
            username: '1',
            palette: 'indigo',
            theme: 'light',
        }),
    };
}
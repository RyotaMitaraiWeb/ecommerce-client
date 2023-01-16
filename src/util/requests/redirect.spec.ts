import { HttpStatus } from "../httpstatus.enum";
import { redirectViaStatus } from "./redirect";

describe('redirect function', () => {
    it('Returns a redirect for 404 errors', () => {
        const res = redirectViaStatus(HttpStatus.NOT_FOUND);
        expect(res?.status).toBe(302);
    });

    it('Returns a redirect for 403 errors', () => {
        const res = redirectViaStatus(HttpStatus.FORBIDDEN);
        expect(res?.status).toBe(302);
    });

    it('Returns null when the status is not 404 or 403', () => {
        const res = redirectViaStatus(HttpStatus.OK);
        expect(res).toBeNull();
    });
});
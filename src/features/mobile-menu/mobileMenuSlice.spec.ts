import mobileMenuReducer, { openMenu, closeMenu, IMobileMenu } from './mobileMenuSlice';

describe('mobile menu reducer', () => {
    const initialState: IMobileMenu = {
        open: false,
    };

    it('handles initial state', () => {
        expect(mobileMenuReducer(undefined, {} as any)).toEqual({
            open: false,
        });
    });

    it('openMenu works', () => {
        const actual = mobileMenuReducer(initialState, openMenu());
        expect(actual.open).toBe(true);
    });

    it('closeMenu works', () => {
        const actual = mobileMenuReducer(initialState, closeMenu());
        expect(actual.open).toBe(false);
    });
});
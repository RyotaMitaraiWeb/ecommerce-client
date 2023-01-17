import snackbarReducer, { closeSnackbar, ISnackbar, openSnackbar } from './snackbarSlice';

describe('snackbar reducer', () => {
    const initialState: ISnackbar = {
        severity: 'warning',
        message: 'a',
        open: false
    };

    it('handles initial state', () => {
        expect(snackbarReducer(undefined, {} as any)).toEqual({
            severity: 'success',
            message: '',
            open: false
        });
    });

    it('openSnackbar works', () => {
        const actual = snackbarReducer(initialState, openSnackbar({
            severity: 'error',
            message: 'b',
        }));
        expect(actual.message).toBe('b');
        expect(actual.severity).toBe('error');
        expect(actual.open).toBe(true);
    });

    it('closeSnackbar works', () => {
        const actual = snackbarReducer(initialState, closeSnackbar());
        expect(actual.open).toBe(false);
    });
});
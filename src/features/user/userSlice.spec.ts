import userReducer, { setUser, setPalette, setTheme, resetUser, IUserState } from './userSlice';

describe('user reducer', () => {
    const initialState: IUserState = {
        _id: '1',
        username: 'a',
        palette: 'indigo',
        theme: 'dark',
    };

    it('handles initial state', () => {
        expect(userReducer(undefined, {} as any)).toEqual({
            _id: '',
            username: '',
            palette: 'deepPurple',
            theme: 'light',
        });
    });

    it('setUser updates successfully', () => {
        const actual = userReducer(initialState, setUser({
            _id: '2',
            username: 'b',
            palette: 'blue',
            theme: 'dark',
        }));

        expect(actual._id).toBe('2');
        expect(actual.username).toBe('b');
        expect(actual.theme).toBe('dark');
        expect(actual.palette).toBe('blue');
    });

    it('resetUser restarts successfully', () => {
        const actual = userReducer(initialState, resetUser());
        expect(actual._id).toBe('');
        expect(actual.username).toBe('');
        expect(actual.palette).toBe('deepPurple');
        expect(actual.theme).toBe('light');
    });

    it('setPalette updates palette successfully', () => {
        const actual = userReducer(initialState, setPalette({ palette: 'blue' }));
        expect(actual.palette).toBe('blue');
    });

    it('setTheme updates theme successfully', () => {
        const actual = userReducer(initialState, setTheme({ theme: 'dark' }));
        expect(actual.theme).toBe('dark');
    });
});

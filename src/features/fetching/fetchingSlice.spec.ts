import fetchingReducer, { IFetching, startFetching, finishFetching } from './fetchingSlice';

describe('fetching reducer', () => {
    const initialState: IFetching = {
        fetching: false,
    }

    it('handles initial state', () => {
        expect(fetchingReducer(undefined, {} as any)).toEqual({
            fetching: false,
        });
    });

    it('startFetching works', () => {
        const actual = fetchingReducer(initialState, startFetching());
        expect(actual.fetching).toBe(true);
    });

    it('finishFetching works', () => {
        const actual = fetchingReducer(initialState, finishFetching());
        expect(actual.fetching).toBe(false);
    });
});
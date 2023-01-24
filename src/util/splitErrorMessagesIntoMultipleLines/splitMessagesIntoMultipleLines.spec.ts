import { IError } from "../../interfaces";
import { splitErrorMessagesIntoMultipleLines } from "./splitMessagesIntoMultipleLines";

describe('splitMessagesIntoMultipleLines', () => {
    it('splits error messages into multiple lines', () => {
        const errors: IError[] = [
            {
                msg: 'a',
            },
            {
                msg: 'b',
            }
        ];

        const message = splitErrorMessagesIntoMultipleLines(errors);
        expect(message).toBe('a\nb');
    });

    it('returns an empty string for an empty array', () => {
        const errors: IError[] = [];
        const message = splitErrorMessagesIntoMultipleLines(errors);
        expect(message).toBe('');
    })
})
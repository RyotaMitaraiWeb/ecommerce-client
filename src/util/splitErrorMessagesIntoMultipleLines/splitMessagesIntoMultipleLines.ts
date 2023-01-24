import { IError } from "../../interfaces";

export function splitErrorMessagesIntoMultipleLines(messages: IError[]) {
    return messages.map(m => m.msg).join('\n');
}
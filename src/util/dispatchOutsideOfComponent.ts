import { store } from "../app/store";

/**
 * This function can be used to alter the Redux store from any point of the application.
 * The function accepts a generic, which determines the type of payload that can be passed to the function.
 * For actions that do not accept arguments, simply pass the function reference and skip the ``args`` argument.
 * @param fn 
 * @param args 
 */
export function dispatchOutsideOfComponent<T>(fn: Function, args?: T) {
    store.dispatch(fn(args));
}
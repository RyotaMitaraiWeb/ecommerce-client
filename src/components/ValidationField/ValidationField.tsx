import { TextField } from "@mui/material";
import { ChangeEvent, ChangeEventHandler, useState } from "react";

/**
 * ```typescript
 * interface IValidationField {
 *  id: string;
    label: string;
    name: string;
    required?: requiredRule;
    helperText?: string;
    className?: string;
    minLength?: minLengthRule;
    maxLength?: maxLengthRule;
    pattern?: patternRule;
    min?: minRule;
    max?: maxRule;
    defaultValue?: string;
    type?: string;
    InputProps?: {
        endAdornment: JSX.Element
    };
    value: any;
    onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}
 * ```
 */
export interface IValidationField {
    id: string;
    label: string;
    name: string;
    required?: requiredRule;
    helperText?: string;
    className?: string;
    minLength?: minLengthRule;
    maxLength?: maxLengthRule;
    pattern?: patternRule;
    min?: minRule;
    max?: maxRule;
    defaultValue?: string;
    type?: string;
    InputProps?: {
        endAdornment: JSX.Element
    };
    value: any;
    onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}

export const validationRules = {
    minLength(value: string, minLength: number) {
        return value.trim().length >= minLength;
    },
    maxLength(value: string, maxLength: number) {
        return value.trim().length <= maxLength;
    },
    pattern(value: string, pattern: RegExp) {
        return pattern.test(value.trim());
    },
    required(value: string) {
        return value.trim().length > 0;
    },
    min(value: number, min: number) {
        return value >= min;
    },
    max(value: number, max: number) {
        return value <= max;
    },
}

/**
 * This component renders a validation field that tracks its own validation rules. 
 * This is a controlled form and does not expose the errors to other components
 */
export default function ValidationField(props: IValidationField) {
    const [touched, setTouched] = useState(false);
    const value = props.value;

    const errors: string[] = [];

    function validate(valid: boolean, message: string) {
        if (!valid) {
            errors.push(message)
        }
    }

    let isEmpty: boolean = false;
    if (props.required) {
        isEmpty = value.length === 0 && props.required[0]
    }

    if (touched) {
        if (props.minLength && !isEmpty) {
            const [minLength, errorMessage] = props.minLength;
            validate(validationRules.minLength(value, minLength), errorMessage);
        }

        if (props.maxLength && !isEmpty) {
            const [maxLength, errorMessage] = props.maxLength;
            validate(validationRules.maxLength(value, maxLength), errorMessage);
        }

        if (props.pattern && !isEmpty) {
            const [pattern, errorMessage] = props.pattern;
            validate(validationRules.pattern(value, pattern), errorMessage);
        }

        if (!isEmpty && props.min) {
            const [min, errorMessage] = props.min;
            validate(validationRules.min(value, min), errorMessage);
        }

        if (!isEmpty && props.max) {
            const [max, errorMessage] = props.max;
            validate(validationRules.max(value, max), errorMessage);
        }

        if (isEmpty && props.required) {
            const errorMessage = props.required[1];
            errors.push(errorMessage);
        }
    }

    const errorMessages = errors.join('\n');

    return (
        <>
            <TextField
                id={props.id}
                name={props.name}
                label={props.label}
                required={props.required ? props.required[0] : false}
                helperText={errorMessages || props.helperText}
                className={props.className}
                variant="filled"
                value={value}
                onChange={props.onChange}
                onBlur={() => setTouched(true)}
                error={errors.length > 0}
                type={props.type || 'text'}
                sx={{ whiteSpace: 'pre-line' }}
                InputProps={props.InputProps}
            />
        </>
    );
}

export type minLengthRule = [number, string];
export type maxLengthRule = [number, string];
export type patternRule = [RegExp, string];
export type requiredRule = [boolean, string];
export type minRule = [number, string];
export type maxRule = [number, string];

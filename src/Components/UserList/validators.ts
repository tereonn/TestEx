import { validationResult } from "../Shared/types";

const VAL_ERROR_OFFS_NOT_NUM = 'Val err, offs is not a num';
const VAL_ERROR_OFFS_TOO_LOW = 'Val err, offs must be greater than 1';


export function userListOffsValidator(offs: any): validationResult  {
    const value = Number(offs);
    if (isNaN(value)) {
        return {
            isValid: false,
            message: VAL_ERROR_OFFS_NOT_NUM,
        }
    }

    if (value < 0) {
        return {
            isValid: false,
            message: VAL_ERROR_OFFS_TOO_LOW,
        }
    }

    return {
        isValid: true,
        message: "",
    }
}
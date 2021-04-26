import {Parser} from './interfaces';

export interface RankedUserData {
    name: string;
    rank: number;
}

interface UserDataResponse {
    total: number;
    userCount: number;
    page: number;
    users: RankedUserData[];
}

const VALID_TOTAL_ERR = 'Total must be number > 0';
const VALID_USER_COUNT_ERR = 'UserCount must be number > 0';
const VALID_PAGE_ERR = 'Page must be number > 0';
const VALID_USERS_ARRAY_ERR = 'Users must be an array';
const VALID_USERS_DATA_ERR = 'User rank must be a number';

export class UserDataParser implements Parser<UserDataResponse> {

    //вообще для валидации я бы подключил специализированную библиотеку. Например, Joi.
    parse(rawData: string) {
        try {
            const parsed: UserDataResponse = JSON.parse(rawData);

            if (!validateApiResponseNumbers(parsed.total)) {
                throw new Error(VALID_TOTAL_ERR);
            }

            if (!validateApiResponseNumbers(parsed.userCount)) {
                throw new Error(VALID_USER_COUNT_ERR);
            }

            if (!validateApiResponseNumbers(parsed.page)) {
                throw new Error(VALID_PAGE_ERR);
            }

            if (!validateArrayType(parsed.users)) {
                throw new Error(VALID_USERS_ARRAY_ERR);
            }

            if (parsed.users.some(u => !validateUserData(u))) {
                throw new Error(VALID_USERS_DATA_ERR);
            }


            return [parsed];
        } catch (e) {
            throw e;
        }
    }
}

function validateUserData(data: any): boolean {
    const rank = data.rank;
    return validateNumberType(rank) && validateNotNAN(rank);
}

function validateApiResponseNumbers(data: any): boolean {
    return validateNumberType(data)
        && validateNotNAN(data)
        && validateGreaterThanZero(data);
}

function validateNumberType(value: any): boolean {
    return typeof value === 'number';
}

function validateGreaterThanZero(num: number): boolean {
    return num > 0
}

function validateNotNAN(num: number): boolean {
    return !isNaN(num);
}

function validateArrayType(data: any) {
    return Array.isArray(data);
}
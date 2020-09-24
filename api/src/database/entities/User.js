import { Entity } from 'com.siteblade.nodejs.database.orm';

import { Enum, FlagsEnum, UInt, Int } from 'com.siteblade.util';

export const Privileges = FlagsEnum('Privileges', [
    ['MODERATOR', 16],
    ['ADMINISTRATOR', 32],
]);

export default class User extends Entity {
    static tableName = 'users';

    static properties = [
    	['netId', String, 'unique'],
    	['email', String, 'unique'],
    	['passwordHash', String, 'hidden'],
    	['privileges', Privileges],
    	['verifiedToken', String, 'nullable', 'hidden'],
        Date,
    ];
}
import { Model } from '/app/models/Model';
import { Enum, FlagsEnum, UInt, Int } from 'com.siteblade.util';

export const Privileges = FlagsEnum('Privileges', [
    ['MODERATOR', 16],
    ['ADMINISTRATOR', 32],
]);

export class User extends Model {
    static propertyTypes = {
        id:BigInt,
        netId:String,
        privileges:Privileges,
        createdAt:Date,
    };
}
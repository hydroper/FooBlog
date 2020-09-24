import { Model } from '/app/models/Model';
import { Enum, FlagsEnum, UInt, Int } from 'com.siteblade.util';

export const Thumb = Enum('Thumb', [
    'NONE',
    'VIDEO',
    'IMAGE',
]);

export class BlogPost extends Model {
    static propertyTypes = {
        id:BigInt,
        friendlyId:String,
        title:String,
        subtitle:String,
        content:String,
        thumb:Thumb,
        createdAt:Date,
        updatedAt:Date,
    };
}
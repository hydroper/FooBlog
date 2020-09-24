import { Entity } from 'com.siteblade.nodejs.database.orm';

import { Enum, FlagsEnum, UInt, Int } from 'com.siteblade.util';

import * as path from 'path';

export const ThumbType = Enum('Thumb', [
    'NONE',
    'VIDEO',
    'IMAGE',
]);

ThumbType.fromFilePath = filePath => {
    let x = path.extname(filePath);

    if (['mp4', 'webm'].indexOf(x.slice(1)) != -1) return ThumbType.VIDEO;

    if (['gif', 'png', 'jpg', 'jpeg'].indexOf(x.slice(1)) != -1) return ThumbType.IMAGE;

    return null;
};

export default class BlogPost extends Entity {
    static tableName = 'blogPosts';

    static properties = [
    	['friendlyId', String],
    	['title', String],
    	['subtitle', String],
    	['content', String],
    	['thumb', ThumbType],
        Date,
    ];
}
import { UInt, Int } from 'com.siteblade.util';

import { MigrationContext } from 'com.siteblade.nodejs.database.orm';

const {
    AddProperty,
    DeleteProperty,
    RenameProperty
} = MigrationContext;

export async function up(context) {
    await context.createTable("users", "id", [["id",BigInt,'primary'],["netId",String,'unique'],["email",String,'unique'],["passwordHash",String,'hidden'],["privileges",UInt],["verifiedToken",String,'nullable','hidden'],["createdAt",Date],["updatedAt",Date]]);
    await context.createTable("blogPosts", "id", [["id",BigInt,'primary'],["friendlyId",String],["title",String],["subtitle",String],["content",String],["thumb",Number],["createdAt",Date],["updatedAt",Date]]);
}

export async function down(context) {
    await context.deleteTable("users");
    await context.deleteTable("blogPosts");
}

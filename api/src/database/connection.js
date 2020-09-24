import databaseORMOptions from '../../database.orm.config.js';

import { DatabaseORM } from 'com.siteblade.nodejs.database.orm';

export let databaseORM = null;

export async function connectDatabase() {
    databaseORM = await new DatabaseORM(databaseORMOptions);
}
import polka from 'polka';

import path from 'path';

import glob from 'glob';

import StorageFilter from './src/StorageFilter.js';

import ProjectConfig from './src/ProjectConfig.js';

import { connectDatabase } from './src/database/connection.js';

async function start() {
    let application = polka();

    application.use('storage', StorageFilter('storage/app/public'));

    // database ORM

    await connectDatabase();

    // controllers

    for (let controllerPath of glob.sync('./src/controllers/**/*.js'))
        new ((await import(controllerPath)).default)(application);

    // start Polka application

    application.listen(ProjectConfig.port, () => {
        console.log(`API is listening at http://localhost:${ProjectConfig.port}`);
    });
}

start();
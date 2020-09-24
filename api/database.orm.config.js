import ProjectConfig from './src/ProjectConfig.js';

export default {
    schemaUri: `${ProjectConfig.database.uri}/${ProjectConfig.database.schema}`,
    entities: 'src/database/entities/**/*',
    migrationsPath: 'src/database/migrations',
    seedsPath: 'src/database/seeds',
};

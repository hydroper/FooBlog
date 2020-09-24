import * as fs from 'fs';

import * as path from 'path';

import * as url from 'url';

const relativeDirectory = path.resolve(url.fileURLToPath(import.meta.url), '..');

export default { ...JSON.parse(fs.readFileSync(path.resolve(relativeDirectory, '../config.json'), 'utf8')) };
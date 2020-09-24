import { Language, Translator } from 'com.siteblade.intl';

import ProjectConfig from './ProjectConfig.js';

let tBase = null;

// supported languages
let supportedLanguages = [];

for (let language of ProjectConfig.language.supports) supportedLanguages.push(Language(language));

export default async function TranslationProvider(eRequest) {
    if (!tBase)
        tBase = new Translator({
            assets: {
                path: 'res/lang',
                roots: ProjectConfig.language.roots.slice(0),
                loaderType: 'fileSystem',
                clean: false,
            },
        });

    let tClone = tBase.clone();

    let language = Language(eRequest.headers['Accept-Language'] || '') || Language.EN_US;
 
    if (!language || supportedLanguages.indexOf(language) == -1) language = Language(ProjectConfig.language.defaultLanguage);

    await tClone.setLanguage(language);
    return tClone;
}
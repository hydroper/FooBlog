import {
    Language,
    Translator
} from 'com.siteblade.intl';

import {
    ProjectConfig
} from '/app/ProjectConfig';

export let tBase = null;

function getNavigatorLanguage() {
    return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || '';
}

export async function loadTranslator(acceptLanguage = '') {
    let language = null;
    let forBrowser = typeof document == 'object';

    // polka.Request language
    if (acceptLanguage)
        language = Language(acceptLanguage.split(',')[0].trim());
    // browser language
    else if (forBrowser) {
        let id = sessionStorage['config.language'] || getNavigatorLanguage();
        language = id ? Language(id) : null;
    }

    // fallback to default if undefined
    if (!language || ProjectConfig.language.supports.indexOf(language) == -1)
        language = Language(ProjectConfig.language.defaultLanguage);

    if (!tBase) {
        tBase = new Translator({
            assets: {
                path: `${forBrowser ? '/' : ''}res/lang`,
                roots: ProjectConfig.language.roots.slice(0),
                loaderType: !forBrowser ? 'fileSystem' : 'http',
                clean: !forBrowser,
            },
        });
    }

    let r = null;

    // load language assets
    if (forBrowser) r = tBase, await tBase.setLanguage(language);
    else r = tBase.clone(), await r.setLanguage(language);

    return r;
}
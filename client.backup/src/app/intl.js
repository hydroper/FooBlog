import { Language, Translator } from 'com.siteblade.intl';
import cookies from 'browser-cookies';
import { ProjectConfig } from '/app/ProjectConfig';

export let translator = null;
export let t = null;

export async function initTranslator() {
	if (typeof document == 'object') {
        // Select language
        const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en-us';
        let language = Language.byId(cookies.get('configlanguage') || getNavigatorLanguage());
        if (!language || ProjectConfig.language.supports.indexOf(language) == -1)
            language = Language.byId(ProjectConfig.language.defaultLanguage);

        translator = new Translator({
            assets: {
                path: '/assets/lang',
                roots: ProjectConfig.language.roots.slice(0),
                loaderType: 'http',
            },
        });
        await translator.setLanguage(language);
    }
    else translator = new Translator;
    t = translator.t.bind(translator);
}
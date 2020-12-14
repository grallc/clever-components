import { addTranslations, setLanguage } from './lib/i18n.js';

import { lang, translations } from './translations/translations.en.js';

addTranslations(lang, translations);
setLanguage(lang);

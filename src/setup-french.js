import { addTranslations, setLanguage } from './lib/i18n.js';

import { lang, translations } from './translations/translations.fr.js';

addTranslations(lang, translations);
setLanguage(lang);

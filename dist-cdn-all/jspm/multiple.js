async function loadComponents (i18n, componentsUrls) {
  if (i18n) {
    const [{ addTranslations, setLanguage }, { lang, translations }] = await Promise.all([
      import('https://jspm.dev/@clevercloud/components@4.1.0-beta.5/lib/i18n.js'),
      import('https://jspm.dev/@clevercloud/components@4.1.0-beta.5/translations/translations.en.js'),
    ]);
    addTranslations(lang, translations);
    setLanguage(lang);
  }
  for (const url of componentsUrls) {
    import(url);
  }
}

function updateMainView () {

  for (const node of document.querySelectorAll('header a')) {
    node.classList.toggle('active', node.href === document.location.href);
  }

  const hash = document.location.hash;
  main.dataset.page = hash.slice(1);
  main.innerHTML = `loading...`;

  switch (hash) {

    case '#one':
      loadComponents(false, [
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/atoms/cc-toggle.js',
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/atoms/cc-img.js',
      ]).catch(console.log);
      import('../page-multiple-one.js').then(({ initView }) => initView());
      break;

    case '#two':
      loadComponents(true, [
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/env-var/cc-env-var-form.js',
      ]).catch(console.log);
      import('../page-multiple-two.js').then(({ initView }) => initView());
      break;

    case '#three':
      loadComponents(true, [
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/maps/cc-logsmap.js',
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/overview/cc-tile-instances.js',
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/overview/cc-tile-scalability.js',
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/overview/cc-tile-deployments.js',
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/overview/cc-tile-consumption.js',
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/overview/cc-tile-status-codes.js',
        'https://jspm.dev/@clevercloud/components@4.1.0-beta.5/overview/cc-tile-requests.js',
      ]).catch(console.log);
      import('../page-multiple-three.js').then(({ initView }) => initView());
      break;

    default:
      window.history.replaceState({}, '', '#one');
      updateMainView();
      break;
  }
}

// Watch route changes
window.onpopstate = updateMainView;

// Init first state
updateMainView();


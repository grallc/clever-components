async function loadComponents (i18n, componentsUrls) {
  if (i18n) {
    const [{ addTranslations, setLanguage }, { lang, translations }] = await Promise.all([
      import('https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/lib/i18n.js?module'),
      import('https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/translations/translations.en.js?module'),
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
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/atoms/cc-toggle.js?module',
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/atoms/cc-img.js?module',
      ]).catch(console.log);
      import('../setup-multiple-one.js').then(({ initView }) => initView());
      break;

    case '#two':
      loadComponents(true, [
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/env-var/cc-env-var-form.js?module',
      ]).catch(console.log);
      import('../setup-multiple-two.js').then(({ initView }) => initView());
      break;

    case '#three':
      loadComponents(true, [
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/maps/cc-logsmap.js?module',
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-instances.js?module',
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-scalability.js?module',
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-deployments.js?module',
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-consumption.js?module',
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-status-codes.js?module',
        'https://unpkg.com/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-requests.js?module',
      ]).catch(console.log);
      import('../setup-multiple-three.js').then(({ initView }) => initView());
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


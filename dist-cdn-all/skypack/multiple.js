async function loadComponents (i18n, componentsUrls) {
  if (i18n) {
    const [{ addTranslations, setLanguage }, { lang, translations }] = await Promise.all([
      import('https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/lib/i18n.js'),
      import('https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/translations/translations.en.js'),
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
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/atoms/cc-toggle.js',
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/atoms/cc-img.js',
      ]).catch(console.log);
      import('../setup-multiple-one.js').then(({ initView }) => initView());
      break;

    case '#two':
      loadComponents(true, [
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/env-var/cc-env-var-form.js',
      ]).catch(console.log);
      import('../setup-multiple-two.js').then(({ initView }) => initView());
      break;

    case '#three':
      loadComponents(true, [
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/maps/cc-logsmap.js',
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-instances.js',
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-scalability.js',
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-deployments.js',
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-consumption.js',
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-status-codes.js',
        'https://cdn.skypack.dev/@clevercloud/components@5.4.1-beta.3/dist/overview/cc-tile-requests.js',
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


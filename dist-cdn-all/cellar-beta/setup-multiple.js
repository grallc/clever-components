function updateMainView () {

  for (const node of document.querySelectorAll('header a')) {
    node.classList.toggle('active', node.href === document.location.href);
  }

  const hash = document.location.hash;
  main.dataset.page = hash.slice(1);
  main.innerHTML = `loading...`;

  switch (hash) {
    case '#one':
      import('https://cellar-c2.services.clever-cloud.com/components/3.0.2/load.js?lang=en&components=cc-toggle,cc-img');
      import('../setup-multiple-one.js').then(({ initView }) => initView());
      break;
    case '#two':
      import('https://cellar-c2.services.clever-cloud.com/components/3.0.2/load.js?lang=en&components=cc-env-var-form');
      import('../setup-multiple-two.js').then(({ initView }) => initView());
      break;
    case '#three':
      import('https://cellar-c2.services.clever-cloud.com/components/3.0.2/load.js?lang=en&components=cc-logsmap,cc-tile-instances,cc-tile-scalability,cc-tile-deployments,cc-tile-consumption,cc-tile-status-codes,cc-tile-requests');
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


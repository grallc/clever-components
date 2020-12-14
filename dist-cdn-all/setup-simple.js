const $form = document.querySelector('cc-tcp-redirection-form');

const sleep = function (delay = 0) {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

$form.addEventListener('cc-tcp-redirection:create', async (e) => {

  $form.redirections = $form.redirections.map((r) => {
    if (r.namespace === e.detail.namespace) {
      return { ...r, waiting: true };
    }
    return r;
  });

  await sleep(3000);

  $form.redirections = $form.redirections.map((r) => {
    if (r.namespace === e.detail.namespace) {
      return { ...r, waiting: false, error: false, sourcePort: Math.floor(Math.random() * 6000) };
    }
    return r;
  });
});

$form.addEventListener('cc-tcp-redirection:delete', async (e) => {

  $form.redirections = $form.redirections.map((r) => {
    if (r.namespace === e.detail.namespace) {
      return { ...r, waiting: true };
    }
    return r;
  });

  await sleep(3000);

  $form.redirections = $form.redirections.map((r) => {
    if (r.namespace === e.detail.namespace) {
      return { ...r, waiting: false, error: false, sourcePort: null };
    }
    return r;
  });
});

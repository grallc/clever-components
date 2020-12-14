const sleep = function (delay = 0) {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export function initView () {
  main.innerHTML = `
    <cc-env-var-form context="env-var-simple" variables='[
    {"name":"EMPTY","value":""},
    {"name":"ONE","value":"value ONE"},
    {"name":"MULTI","value":"line one\\nline two\\nline three"},
    {"name":"TWO","value":"value TWO"}
  ]'></cc-env-var-form>
  `;
  const $envVarForm = main.querySelector('cc-env-var-form');
  $envVarForm.addEventListener('cc-env-var-form:submit', async (e) => {
    $envVarForm.saving = true;
    await sleep(2000);
    $envVarForm.variables = e.detail;
    $envVarForm.saving = false;
  });
}

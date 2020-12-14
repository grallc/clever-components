export function initView () {
  main.innerHTML = `
    <cc-toggle choices='[
      {"label":"John","value":"/beatles-head-john.jpg"},
      {"label":"Paul","value":"/beatles-head-paul.jpg"},
      {"label":"George","value":"/beatles-head-george.jpg"},
      {"label":"Ringo","value":"/beatles-head-ringo.jpg"}
    ]'></cc-toggle>
    <cc-img></cc-img>
  `;
  const $toggle = main.querySelector('cc-toggle');
  const $img = main.querySelector('cc-img');
  $toggle.addEventListener('cc-toggle:input', async (e) => {
    $img.src = e.detail;
  });
}

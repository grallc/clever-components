import './cc-pricing-product-storage.js';
import '../smart/cc-smart-container.js';
import { fetchCurrency, fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatAddonCellar, formatAddonFsbucket } from '../lib/product.js';
import { defineComponent } from '../lib/smart-manager.js';

const PRODUCTS = {
  cellar: {
    name: 'Cellar',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/cellar.svg',
    noTraffic: false,
  },
  fsbucket: {
    name: 'FS Bucket',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/fsbucket.svg',
    noTraffic: true,
  },
};

defineComponent({
  selector: 'cc-pricing-product-storage',
  params: {
    productId: { type: String },
    currencyCode: { type: String },
    zoneId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const product_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      product_lp.error$.subscribe(console.error),
      product_lp.error$.subscribe(() => (component.error = true)),
      product_lp.value$.subscribe((product) => {
        component.intervals = product.intervals;
        component.currency = product.currency;
      }),

      context$.subscribe(({ productId, zoneId, currencyCode }) => {

        const product = PRODUCTS[productId];
        if (product != null) {
          Object.entries(product).forEach(([key, value]) => {
            component[key] = value;
          });
          product_lp.push((signal) => fetchProduct({ signal, productId, zoneId, currencyCode }));
        }
      }),

    ]);
  },
});

async function fetchProduct ({ signal, productId, zoneId = 'PAR', currencyCode = 'EUR' }) {
  const [priceSystem, currency] = await Promise.all([
    fetchPriceSystem({ signal, zoneId }),
    fetchCurrency({ signal, currencyCode }),
  ]);
  if (productId === 'cellar') {
    return formatAddonCellar(priceSystem, currency);
  }
  if (productId === 'fsbucket') {
    return formatAddonFsbucket(priceSystem, currency);
  }
  throw new Error(`Cannot find product "${productId}"`);
}

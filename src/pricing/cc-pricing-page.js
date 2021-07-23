import { css, html, LitElement } from 'lit-element';
import './cc-pricing-header.js';
import './cc-pricing-product.js';
import './cc-pricing-estimation.js';
import { dispatchCustomEvent } from '../lib/events.js';

const CURRENCY_EUR = { code: 'EUR', changeRate: '1' };

/**
 * A component that acts as a pricing simulator which takes a list of `cc-pricing-product`
 * in the default slot and manage everything to do a simulation.
 *
 * ## Type definitions
 *
 * ```js
 * interface Product {
 *   title: String,
 *   icon: String,
 *   description: String,
 *   items: Array<Item>,
 *   features: Array<Feature>,
 * }
 * ```
 *
 * @cssdisplay block
 *
 * @prop {Array<Currencies>} - List of the currencies available.
 * @prop {Currency} currency - Current/Default currency selected.
 * @prop {Array<Product>} products - List of the products available.
 * @prop {String} zoneId - Current/Default zoneId.
 * @prop {Array<Zone>} zones - List of the zones available.
 *
 *
 */
export class CcPricingPage extends LitElement {

  static get properties () {
    return {
      currencies: { type: Array },
      currency: { type: Object },
      products: { type: String },
      zoneId: { type: Object },
      zones: { type: Array },
      _selectedProducts: { type: String },
      _totalPrice: { type: Array },
    };
  }

  constructor () {
    super();
    this._selectedProducts = {};
    this.currencies = [];
    // Use Paris as default (might need to change later on)
    this.zoneId = 'par';
    this.currency = CURRENCY_EUR;
    this.zones = [];
    this._totalPrice = 0;
  }

  _getTotalPrice () {
    let totalPrice = 0;
    for (const p of Object.values(this._selectedProducts)) {
      if (p != null) {
        totalPrice += p.item.price * 30 * 24 * p.quantity;
      }
    }
    return totalPrice;
  }

  _onAddProduct ({ detail: product }) {
    // TODO: Have a dedicated product.item.id
    const id = (product.item.id != null)
      ? product.item.id
      : `${product.name}/${product.item.name}`;

    if (this._selectedProducts[id] == null) {
      this._selectedProducts[id] = { ...product, quantity: 0 };
    }

    this._selectedProducts[id].quantity += 1;

    this._selectedProducts = { ...this._selectedProducts };
    this._totalPrice = this._getTotalPrice();
  }

  _onQuantityChanged ({ detail: product }) {
    // TODO: Have a dedicated product.item.id
    const id = (product.item.id !== undefined)
      ? product.item.id
      : `${product.name}/${product.item.name}`;

    this._selectedProducts[id].quantity = product.quantity;

    this._selectedProducts = { ...this._selectedProducts };
    this._totalPrice = this._getTotalPrice();
  }

  _onDeleteQuantity ({ detail: product }) {
    const id = (product.item.id !== undefined)
      ? product.item.id
      : `${product.name}/${product.item.name}`;

    this._selectedProducts[id] = null;

    this._selectedProducts = { ...this._selectedProducts };
    this._totalPrice = this._getTotalPrice();

  }

  _onCurrencyChanged ({ detail: currency }) {
    dispatchCustomEvent(this, 'change-currency', currency);
  }

  _onZoneChanged ({ detail: zoneId }) {
    dispatchCustomEvent(this, 'change-zone', zoneId);
  }

  render () {
    return html`
      <div class="header">
        <cc-pricing-header
          part="header"
          .currency=${this.currency}
          .currencies=${this.currencies}
          .totalPrice=${this._totalPrice}
          .zoneId=${this.zoneId}
          .zones=${this.zones}
          @cc-pricing-header:change-currency=${this._onCurrencyChanged}
          @cc-pricing-header:change-zone=${this._onZoneChanged}
        >
        </cc-pricing-header>
      </div>
      <slot name="resources"></slot>
      <slot @cc-pricing-product:add-product=${this._onAddProduct}></slot>
      <div class="estimation">
        <slot name="estimation-header"></slot>
        <cc-pricing-estimation
          part="estimation"
          .currency=${this.currency}
          .selectedProducts=${this._selectedProducts}
          .totalPrice=${this._totalPrice}
          @cc-pricing-estimation:change-quantity=${this._onQuantityChanged}
          @cc-pricing-estimation:delete-quantity=${this._onDeleteQuantity}
        >
        </cc-pricing-estimation>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
          :host {
              display: block;
          }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-page', CcPricingPage);

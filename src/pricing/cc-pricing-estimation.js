import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import { preventOutline } from 'leaflet/src/dom/DomUtil.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { classMap } from 'lit-html/directives/class-map.js';

const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };

const deleteSvg = new URL('../assets/delete.svg', import.meta.url).href;

/**
 * A component displaying the products selected, change their quantity or remove them from the list.
 *
 * ## Type definitions
 *
 * ```js
 * interface Zone {
 *   name: string,          // Unique code/identifier for the zone
 *   lat: number,           // Latitude
 *   lon: number,           // Longitude
 *   countryCode: string,   // ISO 3166-1 alpha-2 code of the country (2 letters): "FR", "CA", "US"...
 *   city: string,          // Name of the city in english: "Paris", "Montreal", "New York City"...
 *   country: string,       // Name of the country in english: "France", "Canada", "United States"...
 *   displayName?: string,  // Optional display name for private zones (instead of displaying city + country): "ACME (dedicated)"...
 *   tags: string[],        // Array of strings for semantic tags: ["region:eu", "infra:clever-cloud"], ["scope:private"]...
 * }
 * ```
 *
 * ```js
 * interface Product {
 *     name: string,
 *     item: Item
 * }
 * ```
 *
 * ```js
 * interface Item {
 *   name: string,
 *   pricing: number,
 *   features: feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: string,
 *   value: string|number|boolean,
 * }
 * ``
 *
 * ```js
 * interface Currency {
 *   code: string,
 *   changeRate: string,
 * }
 * ``
 *
 * @cssdisplay block
 *
 *
 * @prop {Array<Product>} selectedProducts - Sets the products selected from the user in the page.
 * @prop {Currency} currency - Sets the current currency code.
 * @prop {Number} totalPrice - the total price estimated of the products.
 *
 * @event {CustomEvent<Product>} cc-pricing-estimation:change-quantity - Fires the product with a modified quantity whenever the quantity on the input has been changed.
 * @event {CustomEvent<Product>} cc-pricing-estimation:delete-quantity - Fires the product with a modified quantity of 0 when the delete button is clicked on a product.
 *
 */
export class CcPricingEstimation extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      selectedProducts: { type: Array },
      currency: { type: Object },
      totalPrice: { type: Number },
      _size: { type: String },
      _selectedProducts: { type: Array },
    };
  }

  constructor () {
    super();
    this.selectedProducts = [];
    this.totalPrice = 0;
    this.breakpoints = {
      width: [600],
    };
    this.currency = CURRENCY_EUR;
  }

  onResize ({ width }) {
    this._size = width;
  }

  _getChoices () {
    return [
      {
        label: i18n('cc-pricing-estimation.classic-mode'),
        value: 'classic',
      },
      {
        label: i18n('cc-pricing-estimation.input-mode'),
        value: 'input',
      },
    ];
  }

  _onChangeQuantity (product, e) {
    const quantity = (!isNaN(e.target.value)) ? e.target.value : 0;

    dispatchCustomEvent(this, 'change-quantity', { ...product, quantity });
  }

  _onDelete (product) {
    dispatchCustomEvent(this, 'delete-quantity', product);
  }

  _renderSmallEstimation () {
    return html`
      <div class="container">
        ${this._renderSmallSelProduct()}
      </div>`;
  }

  _renderBigEstimation () {
    return html`
      <div class="estimation-table">
        <table>
          <tr>
            <th></th>
            <th>${i18n('cc-pricing-estimation.product')}</th>
            <th>${i18n('cc-pricing-estimation.size')}</th>
            <th class="quantity-th">${i18n('cc-pricing-estimation.quantity')}</th>
            <th class="number-align">${i18n('cc-pricing-estimation.price-name-daily')}</th>
            <th class="number-align">${i18n('cc-pricing-estimation.price-name-monthly')}</th>
          </tr>
          ${this._selectedProducts.length > 0
            ? this._renderBigSelProducts(this._selectedProducts)
            : ''}
          ${this.selectedProducts.length === 0 ? html`
            <tr>
              <td colspan="6" class="error-text">
                ${i18n('cc-pricing-estimation.empty-basket')}
              </td>
            </tr>
          ` : ''}
        </table>
      </div>
    `;
  }

  _renderBigSelProducts (products) {
    return products.map((product) => {

      const pricePerDay = product.item.price * 24;
      const totalPricePerDay = pricePerDay * product.quantity * this.currency.changeRate;

      const pricePerMonth = pricePerDay * 30;
      const totalPricePerMonth = pricePerMonth * product.quantity * this.currency.changeRate;

      return html`
        <tr>
          <td>
            <cc-button
              image=${deleteSvg}
              hide-text
              circle
              @cc-button:click=${() => this._onDelete(product)}
            >
              ${i18n('cc-pricing-estimation.delete')}
            </cc-button>
          </td>
          <td>${product.name}</td>
          <td>${product.item.name}</td>
          <td>
            <div class="quantity-wrapper">
              <cc-input-number
                class="input-number"
                value=${product.quantity}
                min="0"
                controls
                @cc-input-number:input=${(e) => this._onChangeQuantity(product, e)}
              >
              </cc-input-number>
            </div>
          </td>
          <td class="price-item">${i18n('cc-pricing-estimation.price', {
            price: totalPricePerDay,
            code: this.currency.code,
          })}
          </td>
          <td class="price-item">${i18n('cc-pricing-estimation.price', {
            price: totalPricePerMonth,
            code: this.currency.code,
          })}
          </td>
        </tr>`;
    });
  }

  _renderSmallSelProduct () {


    if (this._selectedProducts.length === 0) {
      return html`
        <div class="error-text">
          ${i18n('cc-pricing-estimation.empty-basket')}
        </div>
      `;

    }

    return this._selectedProducts.map((product) => {

      const pricePerDay = product.item.price * 24;
      const totalPricePerDay = pricePerDay * product.quantity * this.currency.changeRate;

      const pricePerMonth = pricePerDay * 30;
      const totalPricePerMonth = pricePerMonth * product.quantity * this.currency.changeRate;

      return html`
        <div class="plan">

          <div class="remove-btn">
            <cc-button
              image=${deleteSvg}
              hide-text
              circle
              @cc-button:click=${() => this._onDelete(product)}
            >
              ${i18n('cc-pricing-estimation.delete')}
            </cc-button>
          </div>

          <div class="plan-name">${product.name}</div>

          <div class="qt-btn">
            <cc-input-number
              class="input-number"
              min="0"
              value=${product.quantity}
              @cc-input-number:input=${(e) => this._onChangeQuantity(product, e)}
              controls>
            </cc-input-number>
          </div>

          <div class="feature-list">
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.size')}</div>
              <div class="feature-value">${product.item.name}</div>
            </div>
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.price-name-daily')}</div>
              <div class="feature-value">${i18n('cc-pricing-table.price', {
                price: totalPricePerDay,
                code: this.currency.code,
              })}
              </div>
            </div>
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.price-name-monthly')}</div>
              <div class="feature-value">${i18n('cc-pricing-estimation.price', {
                price: totalPricePerMonth,
                code: this.currency.code,
              })}
              </div>
            </div>
          </div>`;
    });
  }

  update (changedProperties) {
    if (changedProperties.has('selectedProducts')) {
      this._selectedProducts = Object.values(this.selectedProducts)
        .map((product) => {
          if (product == null) {
            return null;
          }
          return product;
        })
        .filter((product) => product != null);
    }
    super.update(changedProperties);
  }

  render () {
    return html`
      ${(this._size > 600)
        ? this._renderBigEstimation()
        : this._renderSmallEstimation()
      }

      <div class="recap">
        <div class="monthly-est">${i18n('cc-pricing-estimation.monthly-est')}</div>
        <div class="cost-price">
          ${i18n('cc-pricing-estimation.price', {
            price: this.totalPrice * this.currency.changeRate, code: this.currency.code,
          })}
        </div>
        <div class="recap-buttons">
          <a href="https://www.clever-cloud.com/en/contact-sales" class="contact-sales">${i18n('cc-pricing-estimation.sales')}</a>
          <a href="https://api.clever-cloud.com/v2/sessions/signup" class="sign-up">${i18n('cc-pricing-estimation.sign-up')}</a>
        </div>
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

          .error {
              text-align: center;
          }

          /* Table properties for big screen size */

          table {
              border-collapse: collapse;
              border-spacing: 0;
              width: 100%;
          }

          tr:nth-child(n+3) {
              border-top: 1px solid #e5e5e5;
          }

          th {
              background-color: #f6f6fb;
              padding: 1em 0.5em;
              text-align: left;
          }

          td {
              padding: 0.5em 0.5em;
              white-space: nowrap;
          }

          td.btn-col {
              padding: 0.25em 0.5em;
          }

          tr:hover td {
              background-color: #f5f5f5;
          }


          .quantity-wrapper {
              display: block;
              text-align: center;
              margin: auto;
          }

          .delete-state {
              visibility: visible;
          }

          .quantity-th {
              text-align: center;
          }

          /* Properties for small screen size */

          .qt-btn {
              text-align: right;
          }

          .plan {
              align-items: center;
              border-top: 1px solid #e5e5e5;
              display: grid;
              grid-template-columns:  min-content [main-start]1fr 1fr [main-end] min-content;
              margin: 0;
              padding: 1em;
          }

          .remove-btn {
              padding: 0.5em;
          }


          .plan .add-item-btn .remove-item-btn {
              margin-right: 1em;
          }

          .plan-name {
              font-size: 1.2em;
              font-weight: bold;
          }

          .feature-list {
              grid-column: main-start / main-end;
              margin: 1em 1em 0 0;
          }

          .feature-list:not(:last-child) {
              margin-top: 1em;
          }

          .plan .feature-list {
              display: flex;
              flex-wrap: wrap;
          }

          .feature {
              border-bottom: 1px solid #e5e5e5;
              display: flex;
              justify-content: space-between;
              padding: 0.75em 0;
          }

          .feature-list:last-child .feature:last-child {
              border: none;
          }

          .plan .feature {
              border: none;
              line-height: 1.5;
              padding: 0;
              white-space: nowrap;
          }

          .plan .feature:not(:last-child)::after {
              content: ',';
              padding-right: 0.5em;
          }

          .feature-name {
              font-style: italic;
              font-weight: bold;
          }

          .plan .feature-name::after {
              content: ' :';
              padding-right: 0.25em;
          }


          .container {
              border-radius: 0.25em;
              box-shadow: var(--shadow);
          }

          /* Global properties */

          .number-align {
              text-align: right;
          }

          .add-item-btn {
              background: transparent;
              border: none;
          }


          .quantity-text {
              align-self: center;
          }

          .input-number {
              --cc-input-number-align: center;
              width: 50%;
          }


          :host([w-gte-600]) .input-number {
              width: 25%;
          }

          .error-text {
              font-style: italic;
              text-align: center;
          }


          /* Recap */

          .recap {
              background-color: #3a3771;
              border-radius: 0.2em;
              color: white;
              display: grid;
              gap: 1em;
              grid-template-areas: 
                "txt price"
                "btn btn";
              margin-top: 1em;
              padding: 1em 0 1em 1em;
          }

          :host([w-gte-600]) .recap {
              grid-template-areas: 
                "txt btn"
                "price btn";
          }

          :host([w-gte-600]) .recap-buttons {
              justify-self: right;
          }

          .monthly-est {
              align-self: center;
              grid-area: txt;
              justify-self: center;

          }

          .cost-price {
              align-self: center;
              font-size: 2em;
              grid-area: price;
              justify-self: center;
          }

          .recap-buttons {
              align-self: center;
              display: flex;
              gap: 1em;
              grid-area: btn;
              justify-self: center;
              margin-right: 1em;
          }

          .contact-sales {
              border-color: transparent;
              background-color: white;
              border-radius: 0.2em;
              color: #3a3871;
              padding: 0.7em 2em 0.7em 2em;
              text-decoration: none;
          }

          .contact-sales:hover {
              background-color: rgba(255, 255, 255, 0.8);
              cursor: pointer;
          }

          .sign-up {
              background-color: transparent;
              border-radius: 0.1em;
              border: 0.1em solid #cccccc;
              color: #ffffff;
              padding: 0.7em;
              text-decoration: none;
          }

          .sign-up:hover {
              background-color: rgba(255, 255, 255, 0.1);
              cursor: pointer;
          }

          .price-item {
              text-align: right;
          }


          .change-qt-btn {
              background: transparent;
              border: none;
          }

          .change-qt-btn img {
              filter: brightness(100%);
              height: 32px;
              width: 32px;
          }

          .change-qt-btn img:hover {
              cursor: pointer;
              filter: brightness(50%);
              transition: all 0.75s ease;
          }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-estimation', CcPricingEstimation);

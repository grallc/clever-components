import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import '../atoms/cc-img.js';
import '../atoms/cc-loader.js';
import '../molecules/cc-error.js';
import './cc-pricing-table.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

const SKELETON_NAME = '????????????';
const SKELETON_DESCRIPTION = fakeString(180);

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-product.js)
 *
 * ## Type definitions
 *
 * ```js
 * interface Item {
 *   name: string,
 *   price: Price,
 *   features: Feature[],
 * }
 * ```
 *
 * ```js
 * interface Price {
 *   daily: Number,
 *   monthly: Number,
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: "connection-limit" | "cpu" | "databases" | "disk-size" | "gpu" | "has-logs" | "has-metrics" | "memory" | "version",
 *   type: "boolean" | "shared" | "bytes" | "number" | "runtime" | "string",
 *   value?: number|string,
 * }
 * ```
 *
 * ```js
 * interface Currency {
 *   code: string,
 *   changeRate: Number,
 * }
 * ```
 *
 * ```js
 * interface Product {
 *   name: string,
 *   item: Item
 * }
 * ```
 *
 * @prop {Currency} currency - Sets the currency needed.
 * @prop {String} description - TODO
 * @prop {Boolean} error - TODO
 * @prop {Array<Feature>} features - Sets the feature needed for the table (Act as columns).
 * @prop {String} icon - Sets the url of the product image.
 * @prop {Array<Item>} items - Sets the data needed for the content of the table.
 * @prop {String} name - Sets the name of the product.
 *
 * @event {CustomEvent<Product>} cc-pricing-product:add-product - Fires a product add event whenever we add a product from the button.
 *
 * @slot - TODO
 * @slot icons - TODO
 */
export class CcPricingProduct extends LitElement {

  static get properties () {
    return {
      currency: { type: Object },
      description: { type: String },
      error: { type: Boolean, reflect: true },
      features: { type: Array },
      icon: { type: String },
      items: { type: Array },
      name: { type: String },
    };
  }

  constructor () {
    super();
    this.icons = [];
    this.features = [];
  }

  _onAddItem ({ detail: item }) {
    const name = this.name;
    dispatchCustomEvent(this, 'add-product', { name, item });
  }

  render () {

    const skeleton = (this.items == null || this.features == null);
    const name = skeleton ? SKELETON_NAME : this.name;
    const description = skeleton ? SKELETON_DESCRIPTION : this.description;

    return html`

      <div class="head">

        <div class="head-info">
          <slot name="icon">
            <cc-img class="product-logo" src="${ifDefined(this.icon)}" ?skeleton="${skeleton}" alt=""></cc-img>
          </slot>
          <div class="name">
            <slot name="name">
              <span class="${classMap({ skeleton })}">${name}</span>
            </slot>
          </div>
        </div>

        ${skeleton && !this.error ? html`
          <slot>
            <div>
              <span class="description skeleton">${description}</span>
            </div>
          </slot>
        ` : ''}
        ${!skeleton && !this.error ? html`
          <slot>${description}</slot>
        ` : ''}

      </div>

      ${this.error ? html`
        <cc-error>${i18n('cc-pricing-product.error')}</cc-error>
      ` : ''}
      ${skeleton && !this.error ? html`
        <cc-loader></cc-loader>
      ` : ''}
      ${!skeleton && !this.error ? html`
        <cc-pricing-table
          class="pricing-table"
          .items=${this.items}
          .features=${this.features}
          .currency=${this.currency}
          @cc-pricing-table:add-item=${this._onAddItem}
        ></cc-pricing-table>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      skeletonStyles,
      css`
        :host {
          background-color: #ffffff;
          display: block;
        }

        .head {
          display: grid;
          gap: 1rem;
          grid-auto-rows: min-content;
          padding: 1rem;
        }

        /* We cannot use cc-flex-gap because of a double slot */
        .head-info {
          display: flex;
          flex-wrap: wrap;
          /* reset gap for browsers that support gap for flexbox */
          gap: 0;
          margin: -0.5rem;
        }

        .product-logo,
        slot[name="icon"]::slotted(*),
        .name {
          margin: 0.5rem;
        }

        .product-logo,
        slot[name=icon]::slotted(*) {
          --cc-img-fit: contain;
          border-radius: 0.25rem;
          display: block;
          height: 3rem;
          width: 3rem;
        }

        .name {
          align-self: center;
          font-size: 1.5rem;
          font-weight: bold;
        }

        /* Slotted description */
        .description {
          line-height: 1.5;
        }

        .pricing-table {
          overflow: auto;
        }

        .skeleton {
          background-color: #bbb;
        }

        :host([error]) .skeleton {
          --cc-skeleton-state: paused;
        }

        cc-loader {
          min-height: 20rem;
        }

        cc-error {
          padding: 0 1rem 1rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-product', CcPricingProduct);

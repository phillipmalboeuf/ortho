<script lang="ts" context="module">
	import { writable } from 'svelte/store'
	import { type CartDocument, getCart, createCart, products, removeFromCart, updateQuantity, updateDiscountCode, removeDiscountCode } from '$lib/clients/shopify'
  export const cart = writable<CartDocument>()
</script>

<script lang="ts">
  import type { ProduitDocument } from 'src/routes/produits/[id].svelte'
	import { date, money } from '$lib/formatters'
  import { query } from '$lib/clients/contentful'

	import { afterUpdate, onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  import Picture from './Picture.svelte'
  import { media } from '../../routes/[page].svelte'

  export let panier = {
    titre: 'Panier',
    quantity: 'Quantité',
    total: 'Total',
    sousTotal: 'Sous-total',
    livraison: 'Livraison',
    suivante: 'Étape suivante',
    taxes: 'Taxes',
    codePromotionnel: 'Code promotionnel',
    estimationDuTotal: 'Estimation du total',
    checkout: 'Checkout',
  }
  export let visible: boolean
  export let number: number

  let produits: ProduitDocument[]
  let waiting = false
  let timer
  let code: string

	onMount(async () => {
		const id = sessionStorage.getItem("cart-id")
		if (id) {
			$cart = await getCart(fetch, id)
		} else {
			$cart = await createCart(fetch)
			sessionStorage.setItem("cart-id", $cart.id)
		}
	})

	cart.subscribe(async value => {
    if (value) {
      number = value.lines.edges.reduce((total, line) => total += line.node.quantity, 0)
    }

		if (value?.lines.edges.length > 0) {
			visible = true

      produits = await Promise.all(value.lines.edges.map(async line => (await query<{
        produitCollection: {
          items: ProduitDocument[]
        }
      }>(fetch, `query($id: String!) {
        produitCollection(limit: 1, where: {shopifyProduct: $id}) {
          items {
            titre
            id
            thumbnail ${media}
          }
        }
      } `, {
        id: line.node.merchandise.product.id
      })).data.produitCollection.items[0]))
		}
	})
</script>

{#if visible && $cart}
<section transition:fly={{ x: 100 }}>
  <button class="close" on:click={() => visible = false}>Close</button>
  <h4>{panier.titre}</h4>

  <ol>
    {#each $cart.lines.edges as { node }, index}
    <li>

      <!-- <h5>
        {#if node.estimatedCost.subtotalAmount.amount !== node.estimatedCost.totalAmount.amount}<em>{money(node.estimatedCost.subtotalAmount.amount / node.quantity)}</em> {/if}{money(node.estimatedCost.totalAmount.amount / node.quantity)}<br>
      </h5> -->
			
      {#if produits && produits[index]}
      <figure>
        <a href="/produits/{produits[index].id}">
          <Picture media={produits[index].thumbnail} ar={1} />
        </a>
      </figure>

      <div>
        <h5>
          <a href="/produits/{produits[index].id}">{produits[index].titre}</a><br>
          {#if node.estimatedCost.subtotalAmount.amount !== node.estimatedCost.totalAmount.amount}<em>{money(node.estimatedCost.subtotalAmount.amount / node.quantity)}</em> {/if}{money(node.estimatedCost.totalAmount.amount / node.quantity)}<br>
        </h5>
      </div>
      {/if}

      <form>
        <label for="quantity">{panier.quantity}</label>
        <input disabled={waiting} on:change={async e => {
          const value = e.currentTarget.value
          clearTimeout(timer)
          timer = setTimeout(async () => {
            waiting = true
            $cart = await updateQuantity(fetch, $cart.id, node.id, parseInt(value))
            waiting = false
          }, 500)
        }} type="number" name="quantity" id="quantity" min={1} value={node.quantity}>
      </form>

      <button class="trash" on:click={async () => {
        waiting = true
        $cart = await removeFromCart(fetch, $cart.id, node.id)
        waiting = false
      }}>Enlever</button>
    </li>
		{:else}
		<li><a href="/produits" style="text-decoration: underline;">Remplir votre panier</a></li>
    {/each}
  </ol>

  <aside>
    <h4>{panier.total}</h4>
    <table>
      <tr>
        <th>{panier.sousTotal}</th>
        <td>{$cart?.lines.edges.length ? money($cart.estimatedCost.subtotalAmount.amount) : '–'}</td>
      </tr>
      <tr>
        <th>{panier.livraison}</th>
        <td>{panier.suivante}</td>
      </tr>
      {#if $cart.estimatedCost.totalTaxAmount}
      <tr>
        <th>{panier.taxes}</th>
        <!-- <td>{$cart?.lines.edges.length ? money($cart.estimatedCost.totalTaxAmount.amount) : '–'}</td> -->
      </tr>
      {/if}
      <tr>
        <th>{panier.codePromotionnel}</th>
        <td>
          {#if $cart.discountCodes.length > 0}
          <button class="promo" on:click={async () => {
            waiting = true
            $cart = await removeDiscountCode(fetch, $cart.id)
            waiting = false
          }}><span>{$cart.discountCodes[0].code}</span> Enlever</button>
          {:else}
          <input disabled={waiting} type="text" name="code" id="code" bind:value={code}>
          <button on:click={async () => {
            waiting = true
            $cart = await updateDiscountCode(fetch, $cart.id, code)
            waiting = false
          }}>Ajouter</button>
          {/if}
        </td>
      </tr>
    </table>
    <hr>
    <table>
      <tr>
        <th>{panier.estimationDuTotal}</th>
        <td>{#if $cart?.lines.edges.length}{#if $cart.estimatedCost.subtotalAmount.amount > $cart.estimatedCost.totalAmount.amount}<em>{money($cart.estimatedCost.subtotalAmount.amount)}</em> {/if}{money($cart.estimatedCost.totalAmount.amount)}{:else}–{/if}</td>
      </tr>
    </table>
    <form action={$cart?.checkoutUrl} on:submit={() => waiting = true}>
      <button class="full" disabled={$cart?.lines.edges.length === 0 || waiting}>{panier.checkout}</button>
    </form>
  </aside>
</section>
{/if}

<style lang="scss">
  section {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 20;
    width: 33vw;
    height: 100vh;
    color: var(--dark);
    background: var(--light);
    padding: calc(var(--gutter) / 2);
    box-shadow: -4px 0px 10px var(--muted);
    overflow-y: scroll;
  }

  ol {
    list-style: none;
    padding-left: 0;
    grid-column: span 8;
    margin: 0;

    @media (max-width: 888px) {
      grid-column: span 12;
    }
  }

  li, aside {
    padding: var(--s2);
    background: var(--light);
  }

  aside {
    align-self: flex-start;
    grid-column: span 4;

    @media (max-width: 888px) {
      grid-column: span 12;
    }
  }

  table {
    width: 100%;

    th {
      text-align: left;
      padding-bottom: var(--s0);
    }

    td:last-child {
      text-align: right;
    }
  }

  li {
    position: relative;
    margin-bottom: var(--s2);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: var(--gutter);

    @media (max-width: 888px) {
      grid-template-columns: repeat(3, 1fr);
    }

    figure {
      margin: 0;
    }

    div {
      grid-column: span 2;
    }

    h5 {
      margin: var(--s1) 0 var(--s2);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  form {

    @media (max-width: 888px) {
      grid-column: span 2;
    }

    label {
      display: block;
      margin-bottom: var(--s1);
    }

    input {
      font-size: 1rem;
      font-weight: bold;
      text-align: center;
      padding: 0.5rem;
      width: 100%;
    }
  }

  h4 {
    text-transform: uppercase;
  }

  button.close,
  button.trash {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
  }

  button.promo {
    font-size: 1rem;
    background: transparent;
    border: none;
    padding: 0;
  }

  button.trash {
    top: auto;
    bottom: 0;
  }

  button.full {
    
  }

  em {
    font-style: normal;
    text-decoration: line-through;
    opacity: 0.5;
  }
</style>
<script lang="ts">
  import { addToCart, getCart, type ProductDocument } from '$lib/clients/shopify'
  import { money } from '$lib/formatters'
  import { cart } from './Cart.svelte'

  export let product: ProductDocument
  let waiting = false
  
  let variant = product.variants.edges[0]
</script>

<form 
  on:change={e => {
    variant = product.variants.edges.find(variant => {
      return Object.keys(variant.node.selectedOptions).forEach(name => e.currentTarget[name].value === variant.node.selectedOptions[name])
    })
  }}
  on:submit={async e => {
    e.preventDefault()

    waiting = true
    await addToCart(fetch, $cart.id, variant.node.id, e.target["quantity"].value)
    $cart = await getCart(fetch, sessionStorage.getItem("cart-id"))
    waiting = false
  }}>
  {#if product.options[0].name !== 'Title'}
  {#each product.options as option}
  <label for={option.name}>{option.name}</label>
  <select name={option.name} id={option.name}>
    {#each option.values as value}
    <option {value}>{value}</option>
    {/each}
  </select>
  {/each}
  {/if}

  <label for="quantity">Quantité</label>
  <input type="number" min=1 name="quantity" id="quantity" value=1>

  <button class="full" disabled={waiting || !product.availableForSale} type="submit">{#if waiting}Un instant...{:else}Ajouter au panier d'achat – {money(variant.node.priceV2.amount)}{/if}</button>
</form>

<style lang="scss">
  form {
  }

  label {
  }

  input, select {
  }

  button {
  }
</style>
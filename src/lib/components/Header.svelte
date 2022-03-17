<script lang="ts">
  import Cart from './Cart.svelte'

  let cartVisible = false
  let cartNumber = 0
</script>

<header class="flex flex--spaced flex--middle">
  <nav class="flex">
    <a href="/">Menu</a>
    <a href="/">Residential</a> / <a href="/">Commercial</a>
  </nav>
  <a class="h3" href="/"><h3>Orthografica</h3></a>
  <nav class="flex flex--middle">
    <a href="/">Fr</a>
    <a href="/account">Customer account</a>
    <button on:click={() => cartVisible = !cartVisible}>Cart ({cartNumber})</button>
  </nav>
</header>

<Cart bind:visible={cartVisible} bind:number={cartNumber} />

<style lang="scss">
  header {
    position: fixed;
    z-index: 10;
    width: 100%;
    top: var(--gutter);
    background: var(--light);
    padding: calc(var(--gutter) / 4);
    box-shadow: 0px 4px 4px var(--muted);

    h3 {
      margin-bottom: 0;
    }
  }
</style>
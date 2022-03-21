<script lang="ts">
  import { fly } from 'svelte/transition'
  import Overlay from './Overlay.svelte'

  let open = false
</script>

<button on:click={() => open = true}>Menu</button>
<Overlay bind:open={open}>
  <section transition:fly={{ y: -100 }}>
    <center class="padded padded--flat_top"><h3>Orthografica</h3></center>
    <div class="flex flex--spaced padded">
      <nav class="main">
        <a class="d1" href="/portfolios/residential">Residentiel</a>
        <a class="d1" href="/portfolios/commercial">Commercial</a>
        <a class="d1" href="/expertise">Notre expertise</a>
        <a class="d1" href="/a-propos">A propos</a>
        <a class="d1" href="/portfolios">Portfolio</a>
        <a class="d1" href="/collections/shop">Magaziner</a>
      </nav>
    </div>
    <div class="flex flex--spaced padded padded--flat_bottom">
      <form class="small" action="">
        Infolettre
      </form>
      <nav class="small">
        <a href="/">En</a>
        <a href="/">pinterest</a>
        <a href="/">facebook</a>
        <a href="/">instagram</a>
        <a href="/">contact</a>
      </nav>
    </div>
  </section>
</Overlay>

<style lang="scss">
  section {
    background-color: var(--light);

    nav {
      &.main {
        a {
          display: block;
        }
      }
    }
  }
</style>
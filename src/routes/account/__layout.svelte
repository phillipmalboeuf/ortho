<script lang="ts">
  import { browser } from '$app/env'
  import { page } from '$app/stores'
  
</script>

<div class="padded grid grid--thirds">
  
  <nav>
    {#key $page.url.pathname}
    {#if browser && localStorage.getItem('token')}
    <a href="/account/devis">Mes devis</a>
    <a href="/account/info">Mes coordonnées</a>
    <a href="/account/orders">Historique d'achats</a>
    <a href="/account/email">Préférences email</a>
    <a href="/account/addresses">Adresses</a>
    <a href="/account/logout">Log out</a>
    {/if}
    {/key}
  </nav>
  
  <div>
    <slot />
  </div>
</div>

<style lang="scss">
  nav {
    a {
      display: block;
      margin-bottom: 1rem;
    }
  }
</style>
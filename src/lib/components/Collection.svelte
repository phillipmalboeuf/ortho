<script context="module" lang="ts">
  import type { ProduitDocument } from 'src/routes/collections/[collection]/produits/[produit].svelte'

  export interface CollectionDocument {
    titre: string
    id: string
    produitsCollection: {
      items: ProduitDocument[]
    }
  }
</script>

<script lang="ts">
  import Box from './Box.svelte'
  import Arrow from './Arrow.svelte'
  import Picture from './Picture.svelte'

  export let entry: CollectionDocument
</script>

<Box>
  <svelte:fragment slot="sh">{entry.titre}</svelte:fragment>
  <svelte:fragment slot="content">
    <h2><a href="/collections/{entry.id}">{entry.titre}</a></h2>
    <div class="grid grid--halves">
      {#each entry.produitsCollection.items as produit}
      <a href="/collections/{entry.id}/produits/{produit.id}">
        <figure>
          <Picture media={produit.thumbnail} small noDescription />
        </figure>
        <div class="grid grid--thirds">
          <h6>{produit.titre}</h6>
          <span>Titre</span>
          <span><u>Buy</u> <Arrow /></span>
        </div>
      </a>
      {/each}
    </div>
  </svelte:fragment>
</Box>


<style lang="scss">
</style>
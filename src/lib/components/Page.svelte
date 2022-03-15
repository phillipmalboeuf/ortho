<script context="module" lang="ts">
  import type { Lien } from './Link.svelte'
  
  export interface PageDocument {
    titre: string
    id: string
    media: object
    description?: string
    intro?: {
      json: object
    }
    contenuCollection?: {
      items: any[]
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import Picture from './Picture.svelte'
  import Contenu from './Contenu.svelte'

	export let page: PageDocument
</script>

<svelte:head>
  <title>{page.titre}</title>
</svelte:head>

{#if page.media}
<figure>
  <Picture media={page.media} noDescription />
</figure>
{/if}
<Contenu contenu={page.contenuCollection.items} />


<style lang="scss">
  figure {
    margin-top: calc(var(--gutter) * -2);
    margin-bottom: 0;
  }
</style>
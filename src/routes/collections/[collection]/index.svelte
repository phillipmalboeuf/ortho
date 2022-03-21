<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import type { CollectionDocument } from '$lib/components/Collection.svelte'
  import { media } from '../../[page].svelte'


   /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      collectionCollection: {
        items: CollectionDocument[]
      }
    }>(fetch, `
      query($id: String!) {
        collectionCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            produitsCollection(limit: 10) {
              items {
                titre
                id
                thumbnail ${media}
              }
            }
          }
        }
      }
    `, {
      id: params.collection
    })

    if (data.collectionCollection.items.length) {
      return {
        props: {
          entry: data.collectionCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import Picture from '$lib/components/Picture.svelte'
  import AddToCart from '$lib/components/AddToCart.svelte'
  import Collection from '$lib/components/Collection.svelte'
  import Arrow from '$lib/components/Arrow.svelte'

  export let entry: CollectionDocument

</script>

<div class="padded grid grid--thirds">
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

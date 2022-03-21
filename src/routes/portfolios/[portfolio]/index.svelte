<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { media } from '../../[page].svelte'

  export interface PortfolioDocument {
    titre: string
    id: string
    projetsCollection: {
      items: ProjetDocument[]
    }
  }

  export interface ProjetDocument {
    titre: string
    id: string
    thumbnail: object
    type: string
    details: object
    description: object
  }

   /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      portfolioCollection: {
        items: PortfolioDocument[]
      }
    }>(fetch, `
      query($id: String!) {
        portfolioCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            projetsCollection(limit: 20) {
              items {
                titre
                id
                type
                thumbnail ${media}
              }
            }
          }
        }
      }
    `, {
      id: params.portfolio
    })

    if (data.portfolioCollection.items.length) {
      return {
        props: {
          portfolio: data.portfolioCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import Picture from '$lib/components/Picture.svelte'
  import Arrow from '$lib/components/Arrow.svelte'

  export let portfolio: PortfolioDocument
</script>

<section class="padded">
  <h1>{portfolio.titre}</h1>
  <ul class="nope grid grid--thirds">
    {#each portfolio.projetsCollection.items as projet}
    <li>
      <a href="/portfolios/{portfolio.id}/projets/{projet.id}">
        {#if projet.thumbnail}<figure>
          <Picture media={projet.thumbnail} noDescription />
        </figure>{/if}
        <div class="flex flex--spaced"><span>{projet.type?.toUpperCase()}</span> <span>{projet.titre}</span> <span><u>See project</u> <Arrow /></span></div>
      </a>
    </li>
    {/each}
  </ul>
</section>

<style>
</style>
<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import type { PortfolioDocument, ProjetDocument } from '../index.svelte'
  import { media } from '../../../[page].svelte'

   /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      portfolioCollection: {
        items: PortfolioDocument[]
      },
      projetCollection: {
        items: ProjetDocument[]
      }
    }>(fetch, `
      query($portfolio: String!, $projet: String!) {
        portfolioCollection(limit: 1, where: {id: $portfolio}) {
          items {
            titre
            id
          }
        }
        projetCollection(limit: 1, where: {id: $projet}) {
          items {
            titre
            id
            type
            thumbnail ${media}
            details {
              json
            }
            description {
              json
            }
          }
        }
      }
    `, {
      portfolio: params.portfolio,
      projet: params.projet
    })

    if (data.projetCollection.items.length) {
      return {
        props: {
          portfolio: data.portfolioCollection.items[0],
          projet: data.projetCollection.items[0],
        }
      }
    }
  }
</script>

<script lang="ts">
  import Picture from '$lib/components/Picture.svelte'
  import Arrow from '$lib/components/Arrow.svelte'
  import Document from '$lib/components/document/Document.svelte'


  export let portfolio: PortfolioDocument
  export let projet: ProjetDocument
</script>

<section class="padded">
  <h4>{portfolio.titre}</h4>
  <h1>{projet.titre}</h1>

  {#if projet.details}
  <Document body={projet.details} />
  {/if}

  {#if projet.description}
  <Document body={projet.description} />
  {/if}
</section>

<style>
  /* em {
    font-style: normal;
  } */
</style>
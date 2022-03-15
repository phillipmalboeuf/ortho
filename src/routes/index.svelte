<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'

  import { contenuCollection, media } from './[page].svelte'

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query($id: String!) {
        pageCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            media ${media}
            ${contenuCollection}
          }
        }
      }
    `, {
      id: "accueil"
    })
    if (data) {
      return {
        props: { 
          page: data.pageCollection.items[0],
        }
      }
    }
  }
</script>

<script lang="ts">
  import type { PageDocument } from '$lib/components/Page.svelte'
  import Picture from '$lib/components/Picture.svelte'
  import Page from '$lib/components/Page.svelte'

  export let page: PageDocument
</script>

<Page {page} />

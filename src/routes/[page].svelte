<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'

  export const media = `{
    fileName
    url
    contentType
    title
    description
    width
    height
  }`

  export const contenuCollection = `contenuCollection(limit: 12) {
      items {
        __typename
        ... on Text {
          titre
          corps {
            json
          }
        }
        ... on Collection {
          titre
          id
          produitsCollection(limit: 5) {
            items {
              titre
              id
              thumbnail ${media}
            }
          }
        }
      }
    }`

   /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query(fetch, `
      query($id: String!) {
        pageCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            ${contenuCollection}
          }
        }
      }
    `, {
      id: params.page
    })
    if (data && data.pageCollection.items.length > 0) {
      return {
        props: { 
          page: data.pageCollection.items[0]
        }
      }
    }
  }
</script>

<script lang="ts">
  import Page, { type PageDocument } from '$lib/components/Page.svelte'
  export let page: PageDocument
</script>

<Page {page} />
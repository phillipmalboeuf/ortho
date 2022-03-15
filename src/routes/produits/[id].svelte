<script context="module" lang="ts">
  import { query } from '$lib/clients/contentful'
  import { getProduct, type ProductDocument } from '$lib/clients/shopify'
  import { media } from '../[page].svelte'

  export interface ProduitDocument {
    titre: string
    id: string
    thumbnail: object
    shopifyProduct: string
    description?: {
      json: object
    }
  }

   /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, params }) {
    const { data } = await query<{
      produitCollection: {
        items: ProduitDocument[]
      }
    }>(fetch, `
      query($id: String!) {
        produitCollection(limit: 1, where: {id: $id}) {
          items {
            titre
            id
            shopifyProduct
              thumbnail ${media}
          }
        }
      }
    `, {
      id: params.id
    })

    if (data.produitCollection.items.length) {
      const product = await getProduct(fetch, data.produitCollection.items[0].shopifyProduct)
    
      return {
        props: {
          produit: data.produitCollection.items[0],
          product
        }
      }
    }
  }
</script>

<script lang="ts">
  import Picture from '$lib/components/Picture.svelte'
  import AddToCart from '$lib/components/AddToCart.svelte'

  export let produit: ProduitDocument
  export let product: ProductDocument

</script>

<article class="padded grid">
  <figure>
    <Picture media={produit.thumbnail} />
  </figure>
  <div>
    <h1>{produit.titre}</h1>
    <AddToCart {product} />
  </div>
</article>

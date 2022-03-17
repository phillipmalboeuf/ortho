<script lang="ts">
  import { fetchCustomer, fetchOrders, type Customer, type Order } from '$lib/clients/shopify'
  import { onMount } from 'svelte'

  let orders: Order[]
  let token: string

  onMount(async () => {
    token = localStorage.getItem('token')
    if (token) {
      orders = (await fetchOrders(fetch, token)).data.customer.orders.edges.map(e => e.node)
    }
  })
</script>

<h1>Historique d'achats</h1>


{#if orders}
{JSON.stringify(orders, null, 2)}
{/if}
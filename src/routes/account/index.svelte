<script lang="ts">
  import { fetchCustomer, type Customer } from '$lib/clients/shopify'
  import { onMount } from 'svelte'

  let customer: Customer
  let token: string

  onMount(async () => {
    token = localStorage.getItem('token')
    if (token) {
      customer = (await fetchCustomer(fetch, token)).data.customer
    }
  })
</script>

<h1>Account</h1>

{#if token === null}
<a href="/account/login">Login</a> / <a href="/account/create">Create an account</a>
{/if}

{#if customer}
{JSON.stringify(customer, null, 2)}
{/if}
<script lang="ts">
  import { goto } from '$app/navigation'

  import { logout, type Customer } from '$lib/clients/shopify'
  import { onMount } from 'svelte'

  let token: string

  onMount(async () => {
    token = localStorage.getItem('token')
    if (token) {
      await logout(fetch, token)
      localStorage.removeItem('token')
      goto('/')
    }
  })
</script>


{#if token === null}
You are not currently logged in.
{:else}
Logging out...
{/if}
<script lang="ts">
  import { createAddress, deleteAddress, fetchAddresses, updateAddress, type Address } from '$lib/clients/shopify'
  import Form from '$lib/components/Form.svelte'
  import Input from '$lib/components/Input.svelte'
  import Overlay from '$lib/components/Overlay.svelte'
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  let addresses: Address[]
  let token: string
  let edit: boolean = false
  let editing: number
  let create: boolean = false

  onMount(async () => {
    token = localStorage.getItem('token')
    if (token) {
      addresses = (await fetchAddresses(fetch, token)).data.customer.addresses.edges.map(e => e.node)
    }
  })
</script>

<h1>Addresses</h1>


{#if addresses}
{#each addresses as address, i}
<p>{address.formatted.join('\n')}</p>

<div class="flex">
  <button on:click={() => {
    editing = i
    edit = true
  }}>Edit</button>
  <Form action={async values => {
    const response = await deleteAddress(fetch, token, address.id)
    addresses = (await fetchAddresses(fetch, token)).data.customer.addresses.edges.map(e => e.node)

    return {
      success: () => {}
    }
  }} id="delete_address" cta="Delete"></Form>
</div>

{/each}

<button on:click={() => create = true}>Ajouter une nouvelle adresse</button>

<Overlay bind:open={create}>
  <div class="padded" transition:fade>
    <Form action={async values => {
      const response = await createAddress(fetch, token, values)
      
      if (response.data.customerAddressCreate.customerUserErrors.length) {
        return {
          error: response.data.customerAddressCreate.customerUserErrors.map(error => error.message).join('\n')
        }
      }

      addresses = (await fetchAddresses(fetch, token)).data.customer.addresses.edges.map(e => e.node)

      return {
        success: () => {
          create = false
        }
      }
    }} id="create_address" cta="Create">
      <Input name="address1" label="address1" />
      <Input name="address2" label="address2" optional />
      <Input name="city" label="city" />
      <Input name="company" label="company" optional />
      <Input name="country" label="country" />
      <Input name="firstName" label="firstName" />
      <Input name="lastName" label="lastName" />
      <Input name="phone" label="phone" />
      <Input name="province" label="province" />
      <Input name="zip" label="zip" />
    </Form>
  </div>
</Overlay>

<Overlay bind:open={edit}>
  <div class="padded" transition:fade>
    {#if editing !== undefined}
    <Form action={async values => {
      const response = await updateAddress(fetch, token, addresses[editing].id, values)
      
      if (response.data.customerAddressUpdate.customerUserErrors.length) {
        return {
          error: response.data.customerAddressUpdate.customerUserErrors.map(error => error.message).join('\n')
        }
      }

      addresses = (await fetchAddresses(fetch, token)).data.customer.addresses.edges.map(e => e.node)

      return {
        success: () => {
          edit = false
          editing = undefined
        }
      }
    }} id="create_address" cta="Update">
      <Input name="address1" label="address1" value={addresses[editing].address1} />
      <Input name="address2" label="address2" optional value={addresses[editing].address2} />
      <Input name="city" label="city" value={addresses[editing].city} />
      <Input name="company" label="company" optional value={addresses[editing].company} />
      <Input name="country" label="country" value={addresses[editing].country} />
      <Input name="firstName" label="firstName" value={addresses[editing].firstName} />
      <Input name="lastName" label="lastName" value={addresses[editing].lastName} />
      <Input name="phone" label="phone" value={addresses[editing].phone} />
      <Input name="province" label="province" value={addresses[editing].province} />
      <Input name="zip" label="zip" value={addresses[editing].zip} />
    </Form>
    {/if}
  </div>
</Overlay>
{/if}
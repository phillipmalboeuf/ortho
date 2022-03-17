<script lang="ts">
  import { goto } from '$app/navigation'
  import { create, login } from '$lib/clients/shopify'

  import Form from '$lib/components/Form.svelte'

</script>

<h1>Create</h1>

<Form action={async ({ email, password, firstName, lastName, phone }) => {
  const response = await create(fetch, email, password, firstName, lastName, phone)
  
  if (response.data.customerCreate.customerUserErrors.length) {
    return {
      error: response.data.customerCreate.customerUserErrors.map(error => error.message).join('\n')
    }
  }

  const session = await login(fetch, email, password)

  return {
    success: () => {
      localStorage.setItem('token', session.data.customerAccessTokenCreate.customerAccessToken.accessToken)
      goto('/account', { replaceState: true })
    }
  }
}} cta="Create" id="create">
  <label for="firstName">First name</label>
  <input type="text" name="firstName" id="firstName"><br>
  <label for="lastName">Last name</label>
  <input type="text" name="lastName" id="lastName"><br>
  <label for="email">Email</label>
  <input type="email" name="email" id="email"><br>
  <label for="password">Password</label>
  <input type="password" autocomplete="new-password" name="password" id="password"><br>
</Form>

<a href="/account/login">Login to an account</a>
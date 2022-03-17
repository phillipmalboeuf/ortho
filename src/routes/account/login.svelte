<script lang="ts">
  import { goto } from '$app/navigation'

  import { login, updateCartIdentiy } from '$lib/clients/shopify'
  import { cart } from '$lib/components/Cart.svelte'
  import Form from '$lib/components/Form.svelte'
  import Input from '$lib/components/Input.svelte'
</script>

<h1>Login</h1>

<Form action={async ({ email, password }) => {
  const response = await login(fetch, email, password)
  
  if (response.data.customerAccessTokenCreate.userErrors.length) {
    return {
      error: response.data.customerAccessTokenCreate.userErrors.map(error => error.message).join('\n')
    }
  }

  updateCartIdentiy(fetch, $cart.id, response.data.customerAccessTokenCreate.customerAccessToken.accessToken)

  return {
    success: () => {
      localStorage.setItem('token', response.data.customerAccessTokenCreate.customerAccessToken.accessToken)
      goto('/account', { replaceState: true })
    }
  }
}} id="login" cta="login">
  <Input type="email" name="email" label="Email" />
  <Input type="password" name="password" label="Password" />
</Form>

<a href="/account/reset">Forgot password?</a> / <a href="/account/create">Create an account</a>
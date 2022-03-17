<script lang="ts">
  export let id: string
  export let cta: string
  export let action: (values: {[key: string]: any}) => Promise<{ error?: string, success?: Function }>

  let error: string
  let values = {}

  let waiting: boolean
</script>

<form on:submit|preventDefault={async e => {
  waiting = true
  error = undefined

  const formData = new FormData(e.currentTarget)
  formData.forEach((value, key) => values[key] = value)
  const response = await action(values)
  
  waiting = false

  if (response.error) {
    error = response.error
  } else {
    response.success()
  }
}} {id}>
  <slot />

  {#if error}
  <p>{error}</p>
  {/if}

  <button disabled={waiting} type="submit">{#if waiting}One moment...{:else}{cta}{/if}</button>
</form>
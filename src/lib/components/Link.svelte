<script context="module" lang="ts">
  export interface Lien {
    titre: string
    lien: string
    externe: boolean
    // sousLiens: Entry<Lien>[]
  }
</script>

<script lang="ts">
  import { page } from '$app/stores'
  // import I from './icons/I.svelte'
  
  export let lien: Lien
  export let active = false
  export let arrow = false
  export let external = false
  export let button = false
</script>

{#if lien.lien}
<a class:active class:button href={((!lien.externe && $page.params.locale === 'fr') ? "/fr" : "") + lien.lien} target={lien.externe ? '_blank' : undefined} rel={(lien.externe || external) ? "external" : undefined} on:click>{lien.titre}{lien.externe && arrow ? ' ↗' : ''}</a>
{:else}
<small>{lien.titre}</small>
{/if}
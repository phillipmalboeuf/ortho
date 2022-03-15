<script lang="ts">
  // import Gallerie from './Gallerie.svelte'
  import Text from './Text.svelte'
  import Collection from './Collection.svelte'

  export let contenu: any[]
</script>

{#if contenu}
{#each contenu as entry}
{#if entry.__typename === 'Text'}
<Text {entry} />
{:else if entry.__typename === 'Collection'}
<Collection {entry} />
{/if}
{/each}
{/if}
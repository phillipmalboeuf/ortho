<script lang="ts">
  import Box from './Box.svelte'
import Document from './document/Document.svelte'

  export let entry: {
    titre: string
    // titreInvisible: boolean
    corps: {
      json: object
    }
  }
</script>

<Box>
  <svelte:fragment slot="sh">{entry.titre}</svelte:fragment>
  <svelte:fragment slot="content">
    <Document body={entry.corps} />
  </svelte:fragment>
</Box>

<style lang="scss">
</style>

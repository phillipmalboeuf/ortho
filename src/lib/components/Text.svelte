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

<div>
  <Box>
    <svelte:fragment slot="sh">{entry.titre}</svelte:fragment>
    <svelte:fragment slot="content">
      <Document body={entry.corps} />
    </svelte:fragment>
  </Box>
</div>

<style lang="scss">
  h2 {

  }
</style>

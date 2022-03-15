<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  export let open = false
</script>

{#if open}
<aside>
  <button transition:fade on:click={() => open = false} area-label="Close" />
  <slot />
</aside>
{/if}

<style lang="scss">
  aside {
    position: fixed;
    inset: 0;
    z-index: 15;
    overflow-y: auto;
    
    > button {
      position: fixed;
      inset: 0;
      z-index: -1;
      // background: transparent;
      // border: none;
      background-color: rgba(251, 251, 251, 0.66);
      // -webkit-backdrop-filter: blur(4px);
      // backdrop-filter: blur(4px);

      border: none;
      border-radius: 0;

      // cursor: url(/close.png) 0 0, pointer;
    }
  }
</style>
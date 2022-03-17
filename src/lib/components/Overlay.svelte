<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  export let open = false
</script>

{#if open}
<aside>
  <button class="back" transition:fade on:click={() => open = false} area-label="Close" />
  <button class="close" transition:fade on:click={() => open = false} aria-label="Close">
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.8149 0H24.5763L2.76138 25H0L21.8149 0Z" fill="#101820"/>
    <path d="M2.76128 0H-0.000101089L21.8148 25H24.5762L2.76128 0Z" fill="#101820"/>
    </svg>
  </button>
  <slot />
</aside>
{/if}

<style lang="scss">
  aside {
    position: fixed;
    inset: 0;
    z-index: 15;
    overflow-y: auto;
    
    > button.back {
      position: fixed;
      inset: 0;
      z-index: -1;
      background-color: rgba(251, 251, 251, 0.88);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);

      border: none;
      border-radius: 0;
    }

    > button.close {
      position: fixed;
      z-index: 1;
      top: calc(var(--gutter) / 2);
      right: calc(var(--gutter) / 2);

      background: transparent;
      border: none;
    }
  }
</style>
<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import Overlay from './Overlay.svelte'

  export let media: any
  export let small = false
  export let noDescription = false
  export let ar = undefined
  export let eager = false
  export let zoom = false

  let open: boolean
</script>

<style lang="scss">
  img,
  video {
    display: block;
    width: 100%;
    max-width: 100%;

    &.zoom {
      cursor: zoom-in;
    }
  }

  figure {
    pointer-events: none;
    padding: var(--gutter);
    max-height: 100vh;
    margin: 0;
    text-align: center;

    :global(img) {
      max-height: calc(100vh - (var(--gutter) * 2));
      object-fit: contain;
    }
  }
</style>

{#if media.title !== '[SPACER]'}
{#if media.contentType.startsWith('video/')}
<video class:zoom src="{media.url}" autoplay muted loop playsinline />
{:else}
<picture>
  {#if small}
<source srcSet="{media.url}?w=400{ar ? `&h=${Math.round(ar * 400)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=400{ar ? `&h=${Math.round(ar * 400)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=600{ar ? `&h=${Math.round(ar * 600)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 1200px)" />
<source srcSet="{media.url}?w=600{ar ? `&h=${Math.round(ar * 600)}&fit=fill` : ''}" media="(max-width: 1200px)" />
<source srcSet="{media.url}?w=800{ar ? `&h=${Math.round(ar * 800)}&fit=fill` : ''}&fm=avif" type="image/avif" />
<img class:zoom on:click={() => open = true} style={ar ? `aspect-ratio: 800 / ${Math.round(ar * 800)}` : `aspect-ratio: ${media.width} / ${media.height}`} src="{media.url}?w=800{ar ? `&h=${Math.round(ar * 800)}&fit=fill` : ''}" alt="{media.title} {media.description}" loading={eager ? "eager" : "lazy"} />
  {:else}
<source srcSet="{media.url}?w=900{ar ? `&h=${Math.round(ar * 900)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=900{ar ? `&h=${Math.round(ar * 900)}&fit=fill` : ''}" media="(max-width: 900px)" />
<source srcSet="{media.url}?w=1200{ar ? `&h=${Math.round(ar * 1200)}&fit=fill` : ''}&fm=avif" type="image/avif" media="(max-width: 1200px)" />
<source srcSet="{media.url}?w=1800{ar ? `&h=${Math.round(ar * 1800)}&fit=fill` : ''}&fm=avif" type="image/avif" />
<img class:zoom on:click={() => open = true} style={ar ? `aspect-ratio: 1800 / ${Math.round(ar * 1800)}` : `aspect-ratio: ${media.width} / ${media.height}`} src="{media.url}?w=1800{ar ? `&h=${Math.round(ar * 1800)}&fit=fill` : ''}" alt="{media.title} {media.description}" loading={eager ? "eager" : "lazy"} />
  {/if}
</picture>
{/if}

{#if !noDescription && (media.title || media.description)}
<p class="small">{media.title} {media.description}</p>
{/if}

{#if zoom}
<Overlay bind:open={open}>
  <figure transition:fade>
    <svelte:self {media} />
  </figure>
</Overlay>
{/if}
{/if}
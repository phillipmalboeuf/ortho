<script lang="ts">
  import '../app.scss'

  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
</script>

<Header />
<main id="top">
  <slot />
</main>
<Footer />

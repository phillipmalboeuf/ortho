<section>
  <h2 class="sh"><slot name="sh" /></h2>
  <div class="padded"><slot name="content" /></div>
</section>

<style lang="scss">
  section {
    position: relative;
    padding-bottom: calc(var(--gutter) * 2);
    box-shadow: inset 0px 16px 12px var(--muted);
  }

  h2 {
    position: absolute;
    top: 50%;
    display: inline-block;
    transform: rotate(90deg) translate(-50%, 0%);
    // margin-top: var(--gutter);
    transform-origin: bottom left;
  }
</style>
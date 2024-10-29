<script lang="ts">
  import 'normalize.css';
  interface Props {
    children?: import('svelte').Snippet;
  }
  let { children }: Props = $props();
</script>

{@render children?.()}

<style>
  :global(html, body) {
    height: 100%;
  }

  :global(body) {
    font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
  }
</style>

<script lang="ts">
  import { PUBLIC_HASH } from '$env/static/public';
  import 'normalize.css';
  import { onMount } from 'svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const localStoragePassword = 'fieldmaps-password';

  let password: string | null = $state(null);
  let mounted = $state(false);

  function hash(s: string | null) {
    return s
      ? s
          .split('')
          .reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
          }, 0)
          .toString()
      : '';
  }

  function onChange() {
    localStorage.setItem(localStoragePassword, password);
  }

  onMount(() => {
    password = localStorage.getItem(localStoragePassword);
    mounted = true;
  });
</script>

{#if hash(password) === PUBLIC_HASH}
  {@render children?.()}
{:else if mounted}
  <form>
    <input hidden type="text" autocomplete="username" value="" />
    <label>
      Password:
      <input
        bind:value={password}
        oninput={onChange}
        type="password"
        autocomplete="current-password"
        autofocus
      />
    </label>
  </form>
{/if}

<style>
  :global(html, body) {
    height: 100%;
  }

  :global(body) {
    font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  form {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
  }
</style>

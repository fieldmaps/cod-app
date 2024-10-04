<script lang="ts">
  import { PUBLIC_HASH } from '$env/static/public';
  import 'normalize.css';
  import { onMount } from 'svelte';

  const localStoragePassword = 'fieldmaps-password';

  let password: string | null = null;
  let mounted = false;

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
  <slot />
{:else if mounted}
  <form>
    <input hidden type="text" autocomplete="username" value="" />
    <label>
      Password:
      <input
        bind:value={password}
        on:input={onChange}
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

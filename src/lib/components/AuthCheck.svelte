<script lang="ts">
  import { user } from "$lib/firebase";
</script>

{#if $user}
  <slot />
{:else}
  <p class="text-error">Please login to view this page  
    <a class="btn btn-primary" href="/login">Sign In</a>
  </p>
{/if}
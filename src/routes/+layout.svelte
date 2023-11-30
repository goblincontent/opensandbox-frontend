<script lang="ts">
    import "../app.css"
    import { user, userData } from "$lib/firebase";
    import Header from '$lib/components/Header.svelte';

    $user;
    $userData;
</script>

<Header></Header>
<main class="max-w-screen-sm mx-auto my-20 px-6">
	<slot />
</main>
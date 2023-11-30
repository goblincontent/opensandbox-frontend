<script lang='ts'>
    import { userData } from "$lib/firebase";
</script>
<div class="hero bg-base-200">
    <div class="hero-content text-center">
    <div class="w-full">
        <h1 class="text-7xl font-bold">OpenSandbox</h1>
        <p class="py-6 text-2xl">Turn your stories into interactive worlds</p>
        {#if $userData?.username}
        <a href="/{$userData.username}/edit" class="btn btn-primary">Edit World</a>
        {:else}
        <a href="/login" class="btn btn-primary">Get Started</a>
        <a href="/example" class="btn btn-secondary">Example World</a>
        {/if}
    </div>
    </div>
</div>

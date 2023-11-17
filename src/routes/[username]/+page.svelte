<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>


<svelte:head>
    <title>@{data.username} Characters</title>
    <meta name="description" content={data.bio}/>
</svelte:head>

<main class="prose text-center mx-auto mt-8">
    <h1 class="text-7xl text-purple-500 my-1">
        @{data.username}
    </h1>

    <img src={data.photoURL ?? "/user.png"} 
        alt="photoURL" 
        class="mx-auto"
        width="256"
    />

    <p class="text-xl my-8">{data.bio ?? "no bio..."}</p>
    <ul class="list-none">
        {#each data.characters as item}
            {@debug item}
        {/each}
    </ul>
</main>
<script lang="ts">
    import { page } from "$app/stores";
    import CharacterCard from "$lib/components/CharacterCard.svelte";
    import { db, userData, user, storage } from "$lib/firebase";
    import {
        arrayRemove,
        arrayUnion,
        doc,
        setDoc,
        updateDoc,
    } from "firebase/firestore";
    import { writable } from "svelte/store";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

    const character_classes = [
        "Warrior",
        "Archer",
        "Mage",
        "Thief"
    ]

    let previewURL: string;
    let uploading = false;
    
    const formDefaults = {
        character_image: "",
        character_class: "",
        character_name: "",
        character_text: "",
        url: "https://",
    };
    const formData = writable(formDefaults);
    
    let showForm = false;
    
    $: classIsValid = $formData.character_class !== ""
    $: nameIsValid =
    $formData.character_name.length < 25 && $formData.character_name.length > 0;
    $: formIsValid = nameIsValid && classIsValid;

    async function upload(e: any) {
        uploading = true;
        const file = e.target.files[0];
        previewURL = URL.createObjectURL(file);
        const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);

        await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
        uploading = false;
    }
    
    async function addCharacter(e: SubmitEvent) {
        const userRef = doc(db, "users", $user!.uid);
        
        await updateDoc(userRef, {
            characters: arrayUnion({
                ...$formData,
                id: Date.now().toString(),
            }),
        });
        
        formData.set({
            character_image: "",
            character_name: "",
            character_class: "",
            character_text: "",
            url: "",
        });
        
        showForm = false;
    }
    
    async function deleteCharacter(item: any) {
        const userRef = doc(db, "users", $user!.uid);
        await updateDoc(userRef, {
            characters: arrayRemove(item),
        });
    }
    
    function cancelCharacterCreate() {
        formData.set(formDefaults);
        showForm = false;
    }
</script>

<main class="max-w-xl mx-auto">
    {#if $userData?.username == $page.params.username}
        <h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">Edit your Characters</h1>
        <!-- INSERT sortable list here -->
        {#if showForm}
            <form
                on:submit|preventDefault={addCharacter}
                class="bg-base-200 p-6 w-full mx-auto rounded-xl"
            >
                <select 
                    name="icon"  
                    class="select select-sm"
                    bind:value={$formData.character_class}
                >
                    {#each character_classes as character_class }
                        <option value={character_class.toLowerCase()}>{character_class}</option>
                    {/each}
                </select>

                <input 
                    type="text" 
                    name="name"
                    placeholder="Name"
                    class="input input-sm"
                    bind:value={$formData.character_name}
                />

                <div class="my-4">
                    {#if !nameIsValid}
                        <p class="text-error text-xs">Must have valid name</p>
                    {/if}
                    {#if !classIsValid}
                        <p class="text-error text-xs">Must select a Class</p>
                    {/if}
                    {#if formIsValid}
                        <p class="text-success text-xs">Looks Good!</p>
                    {/if}
                </div>
                <button
                    disabled={!formIsValid}
                    type="submit" 
                    class="btn btn-xs my-4">
                    Add Character
                </button>
            </form>
        {:else}
            <button 
                on:click={() => {
                    showForm = true;
                }}
                class="btn btn-outline btn-info block mx-auto my-4">
                Create Character
            </button>
        {/if}
    {/if}
</main>

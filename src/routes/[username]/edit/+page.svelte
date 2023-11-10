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

    const classes = [
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
    
    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid =
    $formData.character_name.length < 25 && $formData.character_name.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;

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
                class="bg-base-200 p-6 w-full mx-auto rounded-xl">
                <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
                    <img 
                        src={previewURL ?? "/default_character_image.png"}
                        alt="character card"
                        width="256"
                        height="256"
                        class="mx-auto"
                    />
                    <label for="photoURL" class="label">
                        <span class="label-text">Upload a Character Card</span>
                    </label>
                    <input 
                        name="photoURL"
                        type="file" 
                        class="file-input file-input-bordered w-full max-w-xs"
                        on:change={upload}
                        accept="image/png, image/jpeg, image/gif, image/webp" 
                    />
                    {#if uploading}
                        <p>Uploading...</p>
                        <progress class="progress progress-info w-56 mt-6"/>
                    {/if}
                </div>
                <select name="class" class="select select-sm" bind:value={$formData.character_class}>
                    {#each classes as character_class}
                        <option value="{character_class.toLowerCase()}">{character_class}</option>
                    {/each}
                </select>
            </form>
        {/if}
    {/if}
</main>

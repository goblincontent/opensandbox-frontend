<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { user, userData, storage, db } from "$lib/firebase";
    import { doc, updateDoc, getDoc } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  
    let previewURL: string;
    let uploading = false;
  
    async function upload(e: any) {
      uploading = true;
      const file = e.target.files[0];
      //global URL object in the browser
      previewURL = URL.createObjectURL(file);
      const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
      const result = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(result.ref);
  
      //firestore
      await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
      uploading = false;
    }
  
  </script>


<h2 class="card-title">Upload an Image</h2>
<form class="max-w-screen-md w-full">
<div class="form-control w-full max-w-xs my-10 mx-auto text-center">
    <img 
    src={previewURL ?? "/user.png"}
    alt="imageToUpload"
    width="256"
    height="256"
    class="mx-auto"
    />
    <label for="imageToUpload" class="label">
    <span class="label-text">Pick a file</span>
    </label>
    <input 
    name="imageToUpload"
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
</form>

<script>
  export let character_icon = 'default_character_icon.jpg';
  export let character_name = 'character_name';
  export let url = 'url';
</script>

<a href={url} class="stack w-full max-w-md text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline">
  <img src={`/${character_icon}`} alt="{character_name}" width=512 height=512 class="w-8">
  <span class="text-lg text-white font-bold">{character_name}</span>
</a>
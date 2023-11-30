<script lang='ts'>
    import { page } from '$app/stores';
    import { user } from '$lib/firebase';
    import Icon from '@iconify/svelte';

    $: menu_items = $user ? [
        {
            href: "/dashboard",
            icon: "material-symbols:dashboard",
            label: "Dashboard"
        },
        {
            href: "/settings",
            icon: "mdi:cog",
            label: "Settings"
        },
        {
            href: "/logout",
            icon: "mdi:logout",
            label: "Log Out",
            reload: true,
        }
    ]
    : [
        {
            href: "/login",
            icon: "mdi:login",
            label: "Log In"
        },
        {
            href: "/api/signup",
            icon: "mdi:register",
            label: "Sign Up"
        },
    ]
</script>

<header class="bg-base-200 px-6">
    <div class="max-w-screen-md mx-auto flex items-center py-2">
        <h1>
            <a href="/" class="btn btn-ghost gap-3">
                <Icon icon="eos-icons:sandbox"/>
                OpenSandbox
            </a>
        </h1>
        
        <nav class="dropdown dropdown-end ml-auto">
            <span class="btn btn-ghost gap-3">
                <Icon icon="mdi:bars"/>Menu
            </span>
            <ul class="dropdown-content menu p-2 shadow-md bg-base-200 rounded-box w-52">
                {#each menu_items as item}
                    <li>
                        <a href="{item.href}"
                            data-sveltekit-reload={item.reload ? "": "off"}>
                            <Icon icon={item.icon}/>
                            {item.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</header>

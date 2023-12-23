<script lang="ts">
    import '../app.css'
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
</script>

<svelte:head>
    <title>Number Plate System (SE)</title>
    <link rel="icon" type="image/svg" href="/cdn/car.svg" />
</svelte:head>

<slot />

<style lang="postcss">
    :global(.btn) {
        background-color: #111;
        color: #fff;
    }

    :global(.alert-green) {
        background-color: theme(backgroundColor.green.700);
        border-color: theme(backgroundColor.green.900);
        border-width: theme(borderWidth.2);
        font-size: theme(fontSize.sm);
        padding: theme(padding.1);
        color: #fff;
    }

    :global(.alert-red) {
        background-color: theme(backgroundColor.red.700);
        border-color: theme(backgroundColor.red.900);
        border-width: theme(borderWidth.2);
        font-size: theme(fontSize.sm);
        padding: theme(padding.1);
        color: #fff;
    }

    :global(.alert-yellow) {
        background-color: theme(backgroundColor.yellow.600);
        border-color: theme(backgroundColor.yellow.800);
        border-width: theme(borderWidth.2);
        font-size: theme(fontSize.sm);
        padding: theme(padding.1);
        color: #fff;
    }
</style>
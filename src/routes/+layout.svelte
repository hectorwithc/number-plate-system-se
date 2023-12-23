<script lang="ts">
    import '../app.css'
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
</script>

<slot />

<style lang="postcss">
    :global(.btn) {
        background-color: #111;
        color: #fff;
        border-radius: theme(borderRadius.md);
    }
</style>
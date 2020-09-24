<script>
    import PageLink from '/app/components/PageLink';

    export let segment;
    export let to;

    $: isCurrent = to ? segment == to.replace(/^\//, '') : false;
</script>

<li class="nav-item" aria-current={isCurrent ? 'page' : undefined}>
    {#if to !== undefined && !isCurrent} <PageLink class="nav-link" to="{(to[0] == '/' ? '' : '/') + to}"><slot/></PageLink> {:else} <span class="nav-link"><slot/></span> {/if}
</li>
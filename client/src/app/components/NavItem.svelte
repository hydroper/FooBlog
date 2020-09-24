<script>
    export let segment;
    export let to;

    $: isCurrent = to ? segment == to.replace(/^\//, '').replace(/\/$/, '') : false;
</script>

<li class="nav-item" aria-current={isCurrent ? 'page' : undefined}>
    {#if to !== undefined && !isCurrent} <a class="nav-link" rel=prefetch href="{(to[0] == '/' ? '' : '/') + to}"><slot/></a> {:else} <span class="nav-link"><slot/></span> {/if}
</li>
<script context="module">
    import { writable } from 'svelte/store';
    export const segmentStore = writable(getLocationPath());

    function getLocationPath() {
        return window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    }

    export function updatePageSegment() {
        segmentStore.set(getLocationPath());
    }
</script>

<script>
    import { useNavigate, useResolve, useLocation } from 'svelte-navigator';
    import { PagePreloader } from '/app/PagePreloader';

    export let to = '';
    export let replace = false;
    export let state = null;

    const navigate = useNavigate();
    const resolve = useResolve();
    const location = useLocation();

    $: href = resolve(to, $location);

    const handleClick = async e => {
        e.preventDefault();
        to = to.replace(/^\//, '').replace(/\/$/, '');
        if (to == `${window.location.pathname.slice(1)}${window.location.search}${window.location.hash}`)
            return;
        await PagePreloader.preload(to);
        navigate(to, { state, replace });
        updatePageSegment();
    };
</script>

<a {href} {...$$props} on:click={handleClick}><slot/></a>
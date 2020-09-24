<script>
    import { useFocus } from 'svelte-navigator';
    import { PagePreloader } from '/app/PagePreloader';
    import { t } from '/app/intl';

    export let postId = '';

    const registerFocus = useFocus();

    document.title = '';
</script>

<div class="card">
    <div class="card-body">No content here.</div>
</div>
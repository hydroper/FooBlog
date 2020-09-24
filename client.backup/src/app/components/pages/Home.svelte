<script>
    import { useFocus } from 'svelte-navigator';
    import { PagePreloader } from '/app/PagePreloader';
    import { t } from '/app/intl';

    const registerFocus = useFocus();

    document.title = 'Example';
</script>

<div class="card">
    <div class="card-body">No content here.</div>
</div>
<script>
	export let status;
	export let error;

	const development = process.env.NODE_ENV === 'development';
</script>

<style>
</style>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<div class="card-body">
	<h3>{status}</h3>

	<p>{error.message}</p>

	{#if development && error.stack}
		<pre>{error.stack}</pre>
	{/if}
</div>
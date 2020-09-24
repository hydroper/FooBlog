<script>
	import { getContext } from 'svelte';

	let searchInput = null;

	const { t } = getContext('intl');
</script>

<style>
	#navListSearch {
		float: right;
		padding: 2px 6px;
		padding-bottom: 4px;
	}

	#navSearchIcon {
		position: relative;
		left: 21px;
		top: 1px;
	}

	#navSearch {
		display: inline-block;
		width: 200px;
		padding-left: 19px;
		padding-right: 19px;
		margin-top: 1px;
	}

	#searchReset {
		position: relative;
		left: -19px;
		top: 1px;
	}
</style>

<div class="sub-navbar">
	<div id="navListSearch">
		<label for="navSearch" style="margin-bottom: 0">{t('common.navigation.search')}:</label>
		<button id="navSearchIcon" class="form-control-search"></button>
		<input id="navSearch" bind:this={searchInput} class="form-control" placeholder="{t('common.navigation.search')}">
		<button class="form-control-reset" id="searchReset" on:click={e => searchInput.value = ''}></button>
	</div>
</div>
<script>
	import { AnimationTimer } from 'animation-timer';
	import { Router, Route } from 'svelte-navigator';
	import { PagePreloader } from '/app/PagePreloader';
	import AllRoutes from '/app/components/AllRoutes.svelte';
	import Nav from '/app/components/Nav.svelte';
	import NavItem from '/app/components/NavItem.svelte';
	import { segmentStore } from '/app/components/PageLink.svelte';
	import { t } from '/app/intl';
	import * as allPages from '/app/allPages';

	let visible = false;

	$: segment = $segmentStore;

	(async function() {
		await PagePreloader.preload();
		visible = true;
	})();
</script>

<style global lang="scss">
	@import 'bootstrap/scss/bootstrap';
	@import '../themes/javadoc/theme';

	body {
		overflow-x: hidden;
	}

	html[data-theme=light],
	html[data-theme=light] > body > #sapper {
	}

	html[data-theme=dark],
	html[data-theme=dark] > body > #sapper {
		background: #555 !important;
	}
</style>

<Router>
	<Nav {segment}/>
	<main class="py-4">
		<!-- Progress bar -->
		<div class="progress-bar fixed-top" style="display:none;height:26px;" id="pageProgressBar"></div>

		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-8">
					{#if visible}
						<AllRoutes/>
						<Route>
							<div class="card-body">
								<h3>{t('common:errors.notFound')}</h3>
							</div>
						</Route>
					{/if}
				</div>
			</div>
		</div>
	</main>
</Router>
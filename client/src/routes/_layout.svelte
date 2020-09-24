<script context="module">
	import {
		loadTranslator
	} from '/app/intl';

	let translator;

	export async function preload(page, session) {
		translator = await loadTranslator(session.acceptLanguage);
	}
</script>

<script>
	import { LiveConfig } from '/app/LiveConfig';

	import { ProjectConfig } from '/app/ProjectConfig';

	import {
		Theme
	} from '/app/Theme';

	import Navbar from '/app/components/Navbar.svelte';

	import {
		setContext
	} from 'svelte';

	export let segment;

	setContext('intl', { translator, t: translator.t.bind(translator) });

	// Theme

	let { theme } = LiveConfig;

	if (typeof document == 'object') {
		theme.subscribe(value => {
			let rootElement = document.body.parentElement;
			rootElement.setAttribute('data-theme', value.id);
			for (let t of Theme.all())
				for (let className of t.rootClasses)
				rootElement.classList.remove(className);
			for (let className of value.rootClasses)
				rootElement.classList.add(className);
		});
	}
</script>

<style global lang="scss">
	@import 'bootstrap/scss/bootstrap';
	@import '../app/themes/javadoc/theme';

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

<Navbar {segment}/>

<main class="py-4">
	<!-- Progress bar -->
	<div class="progress-bar fixed-top" style="display:none;height:26px" id="pageProgressBar"></div>

	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-12">
				<slot></slot>
			</div>
		</div>
	</div>
</main>
import 'bootstrap';
import App from '/app/components/App.svelte';
import { initTranslator } from '/app/intl';
import { LiveConfig } from '/app/LiveConfig';
import { Theme } from '/app/Theme';

async function main() {
	await initTranslator();

	LiveConfig.theme.subscribe(value => {
		let rootElement = document.body.parentElement;
		rootElement.setAttribute('data-theme', value.id);
		for (let t of Theme.all())
			for (let className of t.rootClasses)
			rootElement.classList.remove(className);
		for (let className of value.rootClasses)
			rootElement.classList.add(className);
	});

	const app = new App({
		target: document.body,
		props: {}
	});
}

main();
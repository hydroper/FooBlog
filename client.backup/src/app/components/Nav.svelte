<script>
    import { AnimationTimer } from 'animation-timer';
	import { LiveConfig } from '/app/LiveConfig';
	import { t } from '/app/intl';
	import { Auth } from '/app/Auth';
	import { Theme } from '/app/Theme';
	import NavItem from '/app/components/NavItem.svelte';
	import PageLink from '/app/components/PageLink.svelte';

	export let segment;
	let { theme } = LiveConfig;
	let { user } = Auth;
</script>

<nav class="{ $theme.navbarClasses.join(' ') } navbar navbar-expand-md sticky-top py-1" style="text-transform: uppercase" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	<div class="container">
		<PageLink class="navbar-brand" to="/">Example</PageLink>
		<button class="navbar-toggler">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<!-- Left side -->
			<ul class="mr-auto navbar-nav">
				<NavItem segment={segment} to="/blog">{ t('common.navigation.blog') }</NavItem>
			</ul>

			<!-- Right side -->
			<ul class="ml-auto navbar-nav">
				{#if $user}
					<NavItem {segment} to={undefined}>
						<div class="dropdown">
							<button class="btn dropdown-toggle py-0" id="authDropdownButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span class="text-light" style="text-transform: lowercase">{$user.displayName}</span>
							</button>
							<div class="dropdown-menu" aria-labelledby="authDropdownButton">
								<a class="dropdown-item" href="#" on:click={e => Auth.clearCurrentUser()}>{ t('common.navigation.logout') }</a>
							</div>
						</div>
					</NavItem>
				{:else}
					<NavItem {segment} to="/login">{ t('common.navigation.login') }</NavItem>
					<NavItem {segment} to="/register">{ t('common.navigation.register') }</NavItem>
				{/if}
			</ul>
		</div>
	</div>
</nav>

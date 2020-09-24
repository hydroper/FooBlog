<script>
	import { onMount, getContext } from 'svelte';
    import { AnimationTimer } from 'animation-timer';
	import { LiveConfig } from '/app/LiveConfig';
	import { Auth } from '/app/Auth';
	import { Theme } from '/app/Theme';
	import NavItem from '/app/components/NavItem.svelte';
	import SubNavbar from '/app/components/SubNavbar.svelte';

	import {
	    Collapse,
	    Navbar,
	    NavbarToggler,
	    NavbarBrand,
	    Nav,
	    UncontrolledDropdown,
	    DropdownToggle,
	    DropdownMenu,
	    DropdownItem,
	} from 'sveltestrap';

	export let segment;

	let { theme } = LiveConfig;
	let { user } = Auth;
	let rootDiv = null;
	let y = 1;
	let isOpen = false;

	const { t } = getContext('intl');

	onMount(() => {
		// watch scroll
		y = rootDiv.getBoundingClientRect().top;
		window.addEventListener('scroll', e => {
			y = rootDiv.getBoundingClientRect().top;
		});

		return () => {};
	});
</script>

<div class="sticky-top" bind:this={rootDiv}>
	<Navbar color="dark" dark expand="md">
		{#if segment !== undefined || y === 0}
			<NavbarBrand href="/">Example</NavbarBrand>
		{/if}
		<NavbarToggler on:click={e => (isOpen = !isOpen)}/>

		<Collapse {isOpen} navbar expand="md" on:update={e => (isOpen = e.detail.isOpen)}>
			<!-- left side -->
			<Nav class="mr-auto" navbar>
				<NavItem segment={segment} to="/blog">{ t('common.navigation.blog') }</NavItem>
			</Nav>

			<!-- right side -->
			<Nav class="ml-auto" navbar>
				{#if $user}
					<NavItem {segment} to={undefined}>
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav caret>{$user.netId}</DropdownToggle>
							<DropdownMenu>
								<DropdownItem on:click={e => Auth.clearCurrentUser()}>{ t('common.navigation.logout') }</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</NavItem>
				{:else}
					<NavItem {segment} to="/login">{ t('common.navigation.login') }</NavItem>
					<NavItem {segment} to="/register">{ t('common.navigation.register') }</NavItem>
				{/if}
			</Nav>
		</Collapse>
	</Navbar>

	<SubNavbar/>
</div>
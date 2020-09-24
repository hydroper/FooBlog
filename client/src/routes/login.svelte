<script>
    import {
        submitForm
    } from 'com.siteblade.browser.forms';

    import {
        Auth,
        User
    } from '/app/Auth';

    import {
        ProjectConfig
    } from '/app/ProjectConfig';

    import {
        onMount,
        getContext
    } from 'svelte';

    import {
        goto
    } from '@sapper/app';

    import {
        AnimationTimer
    } from 'animation-timer';

    let form = null;
    let loginButton = null;
    let netidInput = null;
    let rememberBox = null;
    let errors = {};
    let { user } = Auth;

    const { t } = getContext('intl');

    onMount(() => {
        netidInput.focus();

        // Redirect when authenticated
        let cancel = user.subscribe(user => {
            if (user) goto('/', { replaceState: true });
        });

        return cancel;
    });

    // "Forgot password?" button

    function onRequestPassword(e) {
        e.preventDefault();
        let query = netidInput.value ? '?netId=' + netidInput.value : '';
        goto(`/login/recovery${query}`);
    }

    // Form

    async function onSubmit(e) {
        e.preventDefault();
        loginButton.disabled = true;
        try {
            let response = await submitForm(form);
            if (!response)
                return;
            errors = {};
            let newUser = new User(response.data.user);
            Auth.saveCurrentUser(newUser, response.data.token, rememberBox.value == 'on');
        }
        catch (e) {
            if (!e.response)
                throw e;
            let { response } = e;
            if (response.status >= 400 && response.status < 500) {
                errors = {};
                for (let field in response.data.messages)
                    errors[field] = response.data.messages[field];
            }
            else errors = {};
            loginButton.disabled = false;
        }
    }
</script>

<svelte:head>
    <title>{ t('common.navigation.login') }</title>
</svelte:head>

<div class="card">
    <div class="card-header"><h4>{ t('common.navigation.login') }</h4></div>
    <div class="card-body">
        <form bind:this={form} action="{ProjectConfig.apiUrl}/login" method="post" on:submit={onSubmit}>
            <div class="form-group row">
                <label for="userNetId" class="col-md-4 col-form-label text-md-right">{ t('user.fields.networkId') }</label>
                <div class="col-md-6">
                    <input type="text" bind:this={netidInput} id="userNetId" name="netid" class="form-control" required minlength="3">
                    {#if errors.netid}
                        <span class="invalid-feedback d-block"><strong>{errors.netid}</strong></span>
                    {/if}
                </div>
            </div>
            <div class="form-group row">
                <label for="userPassword" class="col-md-4 col-form-label text-md-right">{ t('user.fields.password') }</label>
                <div class="col-md-6">
                    <input type="password" id="userPassword" name="password" class="form-control" required minlength="8">
                    {#if errors.password}
                        <span class="invalid-feedback d-block"><strong>{errors.password}</strong></span>
                    {/if}
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-4"></div>
                <div class="col-md-6">
                    <input type="checkbox" id="rememberBox" bind:this={rememberBox} class="text-md-right" value='off'>
                    <label class="ml-1 col-form-label user-select-none" name="remember" for="rememberBox">{ t('user.rememberMe') }</label>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-8 offset-md-4">
                    <button class="btn btn-primary" bind:this={loginButton}>{ t('common.navigation.login') }</button>
                    <form class="d-inline-block" action="" on:submit={onRequestPassword}>
                        <button class="btn btn-link" on:click={onRequestPassword} href="/login/requestpassword">{ t('user.forgotPassword') }</button>
                    </form>
                </div>
            </div>
        </form>
    </div>
</div>
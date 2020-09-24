<script>
    import { submitForm } from 'com.siteblade.formHelpers';
    import { AnimationTimer } from 'animation-timer';
    import { navigate, useFocus } from 'svelte-navigator';
    import { Auth, User } from '/app/Auth';
    import { PagePreloader } from '/app/PagePreloader';
    import { ProjectConfig } from '/app/ProjectConfig';
    import { t } from '/app/intl';

    const registerFocus = useFocus();

    let form = null;
    let loginButton = null;
    let networkIdInput = null;
    let rememberBox = null;
    let errors = {};
    let { user } = Auth;

    document.title = t('common.navigation.login');

    // Redirect when authenticated
    $: {
        if ($user)
            navigate('/', { replace: true });
    }

    // "Forgot password?" button

    function onRequestPassword(e) {
        e.preventDefault();
        let query = networkIdInput.value ? '?networkid=' + networkIdInput.value : '';
        navigate(`/login/recovery${query}`);
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
            let newUser = new User(response.data);
            Auth.saveCurrentUser(newUser, rememberBox.value);
        }
        catch (e) {
            if (!e.response)
                throw e;
            let { response } = e;
            if (response && response.status >= 400 && response.status < 500) {
                errors = {};
                for (let field in response.data.messages)
                    errors[field] = response.data.messages[field];
                errors = { ...errors };
            }
            else errors = {};
            loginButton.disabled = false;
        }
    }
</script>

<div class="card">
    <div class="card-header"><h4>{ t('common.navigation.login') }</h4></div>
    <div class="card-body">
        <form bind:this={form} action="{ProjectConfig.apiUrl}/login" method="post" on:submit={onSubmit}>
            <div class="form-group row">
                <label for="userNetworkId" class="col-md-4 col-form-label text-md-right">{ t('user.fields.networkId') }</label>
                <div class="col-md-6">
                    <input type="text" bind:this={networkIdInput} use:registerFocus id="userNetworkId" name="networkid" class="form-control" required minlength="3">
                    {#if errors.networkid}
                        <span class="invalid-feedback d-block"><strong>{errors.networkid}</strong></span>
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
                    <input type="checkbox" id="rememberBox" bind:this={rememberBox} class="text-md-right">
                    <label class="ml-1 col-form-label" name="remember" for="rememberBox">{ t('user.rememberMe') }</label>
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
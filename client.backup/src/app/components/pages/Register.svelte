<script>
    import { submitForm } from 'com.siteblade.formHelpers';
    import { AnimationTimer } from 'animation-timer';
    import { navigate, useFocus } from 'svelte-navigator';
    import { updatePageSegment } from '/app/components/PageLink';
    import { Auth, User } from '/app/Auth';
    import { PagePreloader } from '/app/PagePreloader';
    import { ProjectConfig } from '/app/ProjectConfig';
    import { t } from '/app/intl';

    const registerFocus = useFocus();

    let form = null;
    let registerButton = null;
    let errors = {};
    let { user } = Auth;

    document.title = t('common.navigation.register');

    // Redirect when authenticated
    $: {
        if ($user)
            navigate('/', { replace: true }),
            updatePageSegment();
    }

    // Form

    async function onSubmit(e) {
        e.preventDefault();
        registerButton.disabled = true;
        try {
            let response = await submitForm(form);
            if (!response)
                return;
            errors = {};
            let newUser = new User(response.data);
            Auth.saveCurrentUser(newUser, true);
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
            registerButton.disabled = false;
        }
    }
</script>

<div class="card">
    <div class="card-header"><h4>{ t('common.navigation.register') }</h4></div>
    <div class="card-body">
        <form bind:this={form} action="{ProjectConfig.apiUrl}/register" method="post" on:submit={onSubmit}>
            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right" for="userNetworkId">{ t('user.fields.networkId') }</label>
                <div class="col-md-6">
                    <input type="text" id="userNetworkId" use:registerFocus name="networkid" class="form-control" required minlength="3" maxlength="25" pattern="[a-z][a-z0-9]*">
                    {#if errors.networkid}
                        <span class="invalid-feedback d-block"><strong>{errors.networkid}</strong></span>
                    {/if}
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right" for="userEmail">{ t('user.fields.email') }</label>
                <div class="col-md-6">
                    <input type="email" id="userEmail" name="email" class="form-control" required minlength="3" maxlength="255">
                    {#if errors.email}
                        <span class="invalid-feedback d-block"><strong>{errors.email}</strong></span>
                    {/if}
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right" for="userPassword">{ t('user.fields.password') }</label>
                <div class="col-md-6">
                    <input type="password" id="userPassword" name="password" class="form-control" required minlength="8" maxlength="255">
                    {#if errors.password}
                        <span class="invalid-feedback d-block"><strong>{errors.password}</strong></span>
                    {/if}
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right" for="userConfirmPassword">{ t('user.fields.confirmPassword') }</label>
                <div class="col-md-6">
                    <input type="password" id="userConfirmPassword" name="passwordconfirmation" class="form-control" required minlength="8">
                    {#if errors.passwordconfirmation}
                        <span class="invalid-feedback d-block"><strong>{errors.passwordconfirmation}</strong></span>
                    {/if}
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-8 offset-md-4">
                    <button class="btn btn-primary" bind:this={registerButton}>{ t('common.navigation.register') }</button>
                </div>
            </div>
        </form>
    </div>
</div>
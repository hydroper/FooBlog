<script>
    import {
        submitForm
    } from 'com.siteblade.browser.forms';

    import {
        BlogPost
    } from '/app/models/BlogPost';

    import {
        ProjectConfig
    } from '/app/ProjectConfig';

    import {
        Auth,
    } from '/app/Auth';

    import {
        getContext,
        createEventDispatcher
    } from 'svelte';

    import {
        goto
    } from '@sapper/app';

    import axios from 'axios';

    import {
        Row,
        Col,
        Input,
        Button,
        Label,
        FormText,
        FormFeedback,
        FormGroup,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
    } from 'sveltestrap';

    export let action;
    export let verbId;
    export let finishVerbId = verbId;
    export let postId = '';
    export let isOpen = false;

    let finishBtnIsEnabled = true;
    let postForm = null;
    let postTitleInputValue = null;
    let postSubtitleInputValue = null;
    let postContentInputValue = null;
    let prevPost = null;
    let errors = {};

    const { t } = getContext('intl');
    const dispatch = createEventDispatcher();

    function toggle() {
        isOpen = !isOpen;
        if (!isOpen) dispatch('close');
    }

    async function loadPreviousPost() {
        if (!postId) {
            let draft = localStorage['blog.newPostDraft'];
            if (draft) prevPost = new BlogPost(JSON.parse(draft));
        }
        else prevPost = new BlogPost((await axios.get(`${ProjectConfig.apiUrl}/blog/${postId}`), { responseType: 'json' }).data);

        if (prevPost)
            postTitleInputValue = prevPost.title,
            postSubtitleInputValue = prevPost.subtitle,
            postContentInputValue = prevPost.content;
    }

    async function onSubmit(e) {
        e.preventDefault();
        finishBtnIsEnabled = false;
        try {
            let post = new BlogPost((await submitForm(postForm, {
                method: action == 'create' ? 'post' : 'put',
                responseType: 'json',
            })).data);
            delete localStorage['blog.newPostDraft'];
            if (action == 'create')
                goto(`blog/${post.friendlyId}`);
            else dispatch('update', { post });
            isOpen = false;
            dispatch('close');
            errors = {};
        }
        catch (e) {
            let { response } = e;
            if (!response) throw e;

            // Bad request
            if (response.status >= 400 && response.status < 500) {
                errors = {};
                for (let field in response.data.messages)
                    errors[field] = response.data.messages[field];
            }
            else errors = {};
            finishBtnIsEnabled = true;
        }
    }

    let dsTimeout = -1;

    const saveDraft = () => {
        if (dsTimeout == -1) clearTimeout(dsTimeout);
        dsTimeout = setTimeout(() => {
            localStorage['blog.newPostDraft'] = JSON.stringify({
                title: postTitleInputValue,
                subtitle: postSubtitleInputValue,
                content: postContentInputValue,
            });
            dsTimeout = -1;
        }, 6000);
    };

    loadPreviousPost();
</script>

<Modal {isOpen} {toggle}>
    <ModalHeader {toggle}><h4>{ t(verbId) }</h4></ModalHeader>

    <!-- wait loading of previous post if any -->
    {#if postId ? prevPost : true}
        <ModalBody>
            <form class="container" bind:this={postForm} on:submit={onSubmit} action="{ProjectConfig.apiUrl}/blog{action == 'create' ? '' : '/' + postId}?auth={Auth.currentUserToken}">
                <!-- title -->
                <FormGroup class="row">
                    <Col md="4"><Label for="postTitle">{ t('blog.fields.title') }</Label></Col>
                    <Col md="6">
                        <Input id="postTitle" bind:value={postTitleInputValue} name="title" required minlength="3" maxlength="127" on:input={saveDraft}/>
                        {#if errors.title} <FormFeedback invalid class="d-block">{errors.title}</FormFeedback> {/if}
                    </Col>
                </FormGroup>

                <!-- subtitle -->
                <FormGroup class="row">
                    <Col md="4"><Label for="postSubtitle">{ t('blog.fields.subtitle') }</Label></Col>
                    <Col md="6">
                        <Input id="postSubtitle" bind:value={postSubtitleInputValue} name="subtitle" required minlength="3" maxlength="255" on:input={saveDraft}/>
                        {#if errors.subtitle} <FormFeedback invalid class="d-block">{errors.subtitle}</FormFeedback> {/if}
                    </Col>
                </FormGroup>

                <!-- thumbnail -->
                <FormGroup class="row">
                    <Col md="4"><Label for="postThumb">{ t('blog.fields.thumbnail') }</Label></Col>
                    <Col md="6">
                        <Input type="file" id="postThumb" name="thumb" on:input={saveDraft}/>
                        {#if errors.thumb} <FormFeedback invalid class="d-block">{errors.thumb}</FormFeedback> {/if}
                    </Col>
                </FormGroup>

                <!-- content -->
                <FormGroup class="row">
                    <Col md="4"><Label for="postContent">{ t('blog.fields.content') }</Label></Col>
                    <Col md="6">
                        <Input type="textarea" id="postContent" name="content" required bind:value={postContentInputValue} on:input={saveDraft} minlength="3" maxlength="2000000"></Input>
                        {#if errors.content} <FormFeedback invalid class="d-block">{errors.content}</FormFeedback> {/if}
                    </Col>
                </FormGroup>
            </form>
        </ModalBody>

        <ModalFooter>
            <Button color="secondary" on:click={toggle}>{ t('common.verbs.close') }</Button>
            <Button color="primary" disabled={!finishBtnIsEnabled} on:click={onSubmit}>{ t(finishVerbId) }</Button>
        </ModalFooter>
    {/if}
</Modal>
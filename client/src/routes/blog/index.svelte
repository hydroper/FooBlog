<script context="module">
    import axios from 'axios';

    import {
        BlogPost
    } from '/app/models/BlogPost';

    import {
        ProjectConfig
    } from '/app/ProjectConfig';

    export async function preload(page, session) {
        let posts = (await axios.get(`${ProjectConfig.apiUrl}/blog${page.query.page ? '?page=' + page.query.page : ''}`, {
            responseType: 'json',
        })).data;
        return {
            posts: posts.page.results,
        };
    }
</script>

<script>
    import {
        getContext,
    } from 'svelte';

    import {
        Auth,
    } from '/app/Auth';

    import PostModal from './_PostModal.svelte';

    import {
        Card,
        CardHeader,
        CardBody,
        Button,
    } from 'sveltestrap';

    import {
        ClockIcon,
    } from 'svelte-feather-icons';

    import Moment from 'moment';

    export let posts;

    posts = BlogPost.fromArray(posts);

    const { user } = Auth;
    const { t } = getContext('intl');

    let createPostModalIsOpen = false;
</script>

<svelte:head>
    <title>{t('common.navigation.blog')}</title>
</svelte:head>

<Card>
    <CardHeader><h4>{t('common.navigation.blog')}</h4></CardHeader>
    {#if $user && 'administrator' in $user.privileges}
        <CardBody>
            <Button color="primary" on:click={e => (createPostModalIsOpen = true)}>{t('blog.verbs.create')}</Button>
            <PostModal isOpen={createPostModalIsOpen} action="create" verbId="blog.verbs.create" on:close={() => (createPostModalIsOpen = false)}/>
        </CardBody>
    {/if}
    {#each posts as p}
        <a href="blog/{p.friendlyId}">
        {#if p.thumb == 'image'}
            <div class="card-img-top" alt="{p.title}" style="background: url('{ProjectConfig.apiUrl}/storage/blogThumb/{p.id}.png'); background-repeat: no-repeat; background-position: center; height: 400px"></div>
        {:else if p.thumb == 'video'}
            <video controls class="card-img-top" style="height: 400px">
                <track kind="captions">
                <source src="{ProjectConfig.apiUrl}/storage/blog.thumb/{p.id}.mp4"/>
            </video>
        {:else}
            <div class="card-img-top" style="background: #333; height: 400px"></div>
        {/if}
        </a>
        <CardBody>
            <a href="blog/{p.friendlyId}"><h3>{p.title}</h3></a>
            <ClockIcon size="14"/> {Moment(p.createdAt).fromNow()}
            <br>
            <p>{p.subtitle}</p>
        </CardBody>
    {/each}
</Card>
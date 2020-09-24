<script context="module">
    import axios from 'axios';

    import {
        BlogPost
    } from '/app/models/BlogPost';

    import {
        ProjectConfig
    } from '/app/ProjectConfig';

    export async function preload(page, session) {
        return {
            post: (await axios.get(`${ProjectConfig.apiUrl}/blog/${page.params.postId}`, { responseType: 'json' })).data,
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
        Row,
        Col,
        Input,
        Button,
        Label,
        FormFeedback,
        FormGroup,
    } from 'sveltestrap';

    import {
        ClockIcon,
    } from 'svelte-feather-icons';

    import Moment from 'moment';

    export let post;

    post = new BlogPost(post);
</script>

<svelte:head>
    <title>{post.title}</title>
</svelte:head>

<Card>
        {#if post.thumb == 'image'}
            <div class="card-img-top" alt="{post.title}" style="background: url('{ProjectConfig.apiUrl}/storage/blogThumb/{post.id}.png'); background-repeat: no-repeat; background-position: center; height: 400px"></div>
        {:else if post.thumb == 'video'}
            <video controls class="card-img-top" style="height: 400px">
                <track kind="captions">
                <source src="{ProjectConfig.apiUrl}/storage/blog.thumb/{post.id}.mp4"/>
            </video>
        {:else}
            <div class="card-img-top" style="background: #333; height: 400px"></div>
        {/if}
    <CardBody>
        <h2>{post.title}</h2>
        <ClockIcon size="14"/> {Moment(post.createdAt).fromNow()}
        <br>
        {post.content}
    </CardBody>
</Card>
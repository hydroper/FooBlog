<script>
    import { Route } from 'svelte-navigator';
    import * as allPages from '/app/allPages';
    import { Auth } from '/app/Auth';

    let { user } = Auth;
</script>

<Route path="/" component={allPages.Home}/>
{#if !$user}
    <Route path="login" component={allPages.Login}/>
    <Route path="register" component={allPages.Register}/>
{/if}
<Route path="blog/create" component={allPages.BlogCreate}/>
<Route path="blog">
    <Route path="/" component={allPages.Blog}/>
    <Route path=":postId" component={allPages.BlogViewPost}/>
</Route>
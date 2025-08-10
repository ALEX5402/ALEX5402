<script>
	import NavHost from '../components/molecules/NavHost.svelte';
	import Hero from '../components/organisms/Hero.svelte';
	import About from '../components/organisms/About.svelte';
	import GitHubAnalytics from '../components/organisms/GitHubAnalytics.svelte';
	import Repos from '../components/organisms/Repos.svelte';
	import Supporters from '../components/organisms/Supporters.svelte';
	import Footer from '../components/molecules/Footer.svelte';
</script>

<NavHost />
<main>
	<Hero />
	<About />
	<GitHubAnalytics />
	<Repos />
	<Supporters />
	<Footer />
</main>

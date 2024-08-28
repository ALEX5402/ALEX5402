<script>
	import Social from '../atoms/Social.svelte';
	import { user } from '../../util/discord';

	import { GitHubIcon } from '@indaco/svelte-iconoir/github';
	import { DiscordIcon } from '@indaco/svelte-iconoir/discord';
	import { MailIcon } from '@indaco/svelte-iconoir/mail';
	import { CoffeeCupIcon } from '@indaco/svelte-iconoir/coffee-cup';
</script>

<div class="socials-container">
	<Social tip="My Github 🔥 " link="https://github.com/alex5402">
		<GitHubIcon color="var(--accent)" />
	</Social>

	<Social tip="I Play Games here 😎" link={`https://discord.com/users/${user.id}`}>
		<DiscordIcon color="var(--accent)" />
	</Social>

	<Social tip="Yes Mail Me 💌" link="mailto:alex5402privvate@gmail.com">
		<MailIcon color="var(--accent)" />
	</Social>

	<Social tip="I Love Money 😍" link="https://buymeacoffee.com/alex5402">
		<CoffeeCupIcon color="var(--accent)" />
	</Social>
</div>

<style>
	.socials-container {
		display: flex;
		gap: 0.75rem;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUserData, fetchUserRepos } from '../../util/github';
	
	let metrics: Array<{
		title: string;
		value: string;
		change: string;
		period: string;
		icon: string;
		color: string;
	}> = [];

	onMount(async () => {
		try {
			const [userData, repos] = await Promise.all([
				fetchUserData(),
				fetchUserRepos()
			]);
			
			const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
			const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
			const publicRepos = repos.filter(repo => !repo.private).length;
			const privateRepos = repos.filter(repo => repo.private).length;
			
			metrics = [
				{
					title: 'Total Repositories',
					value: userData.public_repos.toString(),
					change: `+${publicRepos}`,
					period: 'public',
					icon: '📦',
					color: '#0366d6'
				},
				{
					title: 'Stars Earned',
					value: totalStars.toLocaleString(),
					change: '+0',
					period: 'total',
					icon: '⭐',
					color: '#f1c40f'
				},
				{
					title: 'Forks',
					value: totalForks.toLocaleString(),
					change: '+0',
					period: 'total',
					icon: '🔀',
					color: '#28a745'
				},
				{
					title: 'Followers',
					value: userData.followers.toString(),
					change: '+0',
					period: 'total',
					icon: '👥',
					color: '#6f42c1'
				},
				{
					title: 'Following',
					value: userData.following.toString(),
					change: '+0',
					period: 'total',
					icon: '👤',
					color: '#d73a49'
				},
				{
					title: 'Private Repos',
					value: privateRepos.toString(),
					change: '+0',
					period: 'total',
					icon: '🔒',
					color: '#6a737d'
				}
			];
		} catch (error) {
			console.error('Failed to fetch metrics data:', error);
			metrics = [];
		}
	});
</script>

<div class="metrics-grid">
	{#each metrics as metric}
		<div class="metric-card">
			<div class="metric-header">
				<div class="metric-icon" style="color: {metric.color}">
					{metric.icon}
				</div>
				<div class="metric-title">{metric.title}</div>
			</div>
			<div class="metric-value">{metric.value}</div>
			<div class="metric-change">
				<span class="change-value">{metric.change}</span>
				<span class="change-period">{metric.period}</span>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		
		@media (max-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.75rem;
		}
		
		@media (max-width: 480px) {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
	}
	
	.metric-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		transition: all 0.2s ease;
		
		@media (max-width: 768px) {
			padding: 1.25rem;
			border-radius: 10px;
		}
		
		@media (max-width: 480px) {
			padding: 1rem;
			border-radius: 8px;
		}
		
		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		}
	}
	
	.metric-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		
		@media (max-width: 768px) {
			gap: 0.5rem;
			margin-bottom: 0.75rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.375rem;
			margin-bottom: 0.5rem;
		}
	}
	
	.metric-icon {
		font-size: 1.5rem;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--surface);
		border-radius: 8px;
		
		@media (max-width: 768px) {
			font-size: 1.25rem;
			width: 1.75rem;
			height: 1.75rem;
			border-radius: 6px;
		}
		
		@media (max-width: 480px) {
			font-size: 1.1rem;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 4px;
		}
	}
	
	.metric-title {
		font-size: 0.9rem;
		color: var(--text-muted);
		font-weight: 500;
		
		@media (max-width: 768px) {
			font-size: 0.8rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.75rem;
		}
	}
	
	.metric-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 0.5rem;
		
		@media (max-width: 768px) {
			font-size: 1.5rem;
			margin-bottom: 0.375rem;
		}
		
		@media (max-width: 480px) {
			font-size: 1.25rem;
			margin-bottom: 0.25rem;
		}
	}
	
	.metric-change {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		
		@media (max-width: 768px) {
			gap: 0.375rem;
			font-size: 0.75rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.25rem;
			font-size: 0.7rem;
		}
	}
	
	.change-value {
		color: #28a745;
		font-weight: 600;
	}
	
	.change-period {
		color: var(--text-muted);
	}
</style>

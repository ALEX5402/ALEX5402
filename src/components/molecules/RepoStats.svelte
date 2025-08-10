<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUserRepos } from '../../util/github';
	
	interface RepoData {
		name: string;
		fullName: string;
		description: string;
		language: string;
		stars: number;
		forks: number;
		languageColor: string;
		updated: string;
	}
	
	let topRepos: RepoData[] = [];

	onMount(async () => {
		try {
			const repos = await fetchUserRepos();
			topRepos = repos
				.filter(repo => !repo.private)
				.sort((a, b) => b.stargazers_count - a.stargazers_count)
				.slice(0, 4)
				.map(repo => ({
					name: repo.name,
					fullName: repo.full_name,
					description: repo.description || 'No description available',
					language: repo.language || 'Unknown',
					stars: repo.stargazers_count,
					forks: repo.forks_count,
					languageColor: getLanguageColor(repo.language),
					updated: formatDate(repo.updated_at)
				}));
		} catch (error) {
			console.error('Failed to fetch repository data:', error);
			topRepos = [];
		}
	});
	
	const getLanguageColor = (language: string): string => {
		const colors: { [key: string]: string } = {
			TypeScript: '#3178c6',
			JavaScript: '#f1e05a',
			Python: '#3572A5',
			Rust: '#dea584',
			Go: '#00ADD8',
			'C++': '#f34b7d',
			Java: '#b07219',
			PHP: '#4F5D95',
			Ruby: '#701516',
			Swift: '#ffac45',
			Kotlin: '#F18E33',
			HTML: '#e34c26',
			CSS: '#563d7c',
			SCSS: '#cf649a',
			Shell: '#89e051',
			'C#': '#178600',
			Vue: '#2c3e50',
			React: '#61dafb',
			Svelte: '#ff3e00'
		};
		return colors[language] || '#6a737d';
	};
	
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return `${Math.floor(diffDays / 365)} years ago`;
	};
</script>

<div class="repo-stats">
	<div class="header">
		<h3>Top Repositories</h3>
		<span class="subtitle">Most popular by stars</span>
	</div>
	
	<div class="repo-list">
		{#each topRepos as repo}
			<div class="repo-item">
				<div class="repo-header">
					<div class="repo-name">
						<a href="https://github.com/{repo.fullName}" target="_blank" rel="noopener">
							{repo.name}
						</a>
					</div>
					<div class="repo-language">
						<div class="language-dot" style="background-color: {repo.languageColor}"></div>
						<span>{repo.language}</span>
					</div>
				</div>
				
				<div class="repo-description">
					{repo.description}
				</div>
				
				<div class="repo-metrics">
					<div class="metric">
						<span class="metric-icon">⭐</span>
						<span class="metric-value">{repo.stars}</span>
					</div>
					<div class="metric">
						<span class="metric-icon">🔀</span>
						<span class="metric-value">{repo.forks}</span>
					</div>
					<div class="metric">
						<span class="metric-icon">🕒</span>
						<span class="metric-value">{repo.updated}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
	
	<div class="stats-footer">
		<div class="stat-item">
			<span class="stat-label">Total Repos</span>
			<span class="stat-value">47</span>
		</div>
		<div class="stat-item">
			<span class="stat-label">Public</span>
			<span class="stat-value">42</span>
		</div>
		<div class="stat-item">
			<span class="stat-label">Private</span>
			<span class="stat-value">5</span>
		</div>
	</div>
</div>

<style lang="scss">
	.repo-stats {
		background: linear-gradient(145deg, var(--surface) 0%, rgba(255, 255, 255, 0.03) 100%);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 3rem;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 2px;
			background: linear-gradient(90deg, var(--accent), transparent);
		}
	}
	
	.header {
		margin-bottom: 2.5rem;
		text-align: center;
		
		h3 {
			margin: 0 0 0.5rem 0;
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text);
			background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
		
		.subtitle {
			font-size: 1rem;
			color: var(--text-muted);
			font-weight: 500;
		}
	}
	
	.repo-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	
	.repo-item {
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		transition: all 0.2s ease;
		
		&:hover {
			border-color: var(--accent);
			transform: translateX(4px);
		}
	}
	
	.repo-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	
	.repo-name {
		font-weight: 600;
		color: var(--text);
		
		a {
			color: inherit;
			text-decoration: none;
			
			&:hover {
				color: var(--accent);
			}
		}
	}
	
	.repo-language {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	
	.language-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
	
	.repo-description {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
		line-height: 1.4;
	}
	
	.repo-metrics {
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
	}
	
	.metric {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--text-muted);
	}
	
	.metric-icon {
		font-size: 0.9rem;
	}
	
	.metric-value {
		font-weight: 500;
	}
	
	.stats-footer {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: center;
	}
	
	.stat-label {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	
	.stat-value {
		font-size: 0.9rem;
		color: var(--text);
		font-weight: 600;
	}
</style>

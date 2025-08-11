<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUserRepos, type GitHubRepo } from '../../util/github';

	let repos: GitHubRepo[] = [];
	let isLoading = true;
	let totalRepos = 0;
	let publicRepos = 0;
	let privateRepos = 0;

	onMount(async () => {
		try {
			console.log('RepoStats: Starting to fetch repos...');
			const fetchedRepos = await fetchUserRepos();
			console.log('RepoStats: Successfully fetched repos:', fetchedRepos.length);
			
			// Get random repositories instead of top by stars
			const shuffledRepos = [...fetchedRepos].sort(() => Math.random() - 0.5);
			repos = shuffledRepos.slice(0, 5); // Random 5 repos
			console.log('RepoStats: Selected random repos:', repos.length);
			
			totalRepos = fetchedRepos.length;
			publicRepos = fetchedRepos.filter(repo => !repo.private).length;
			privateRepos = fetchedRepos.filter(repo => repo.private).length;
			
			console.log('RepoStats: Final stats - total:', totalRepos, 'public:', publicRepos, 'private:', privateRepos);
			console.log('Random repos loaded:', repos);
		} catch (error) {
			console.error('RepoStats: Error loading repos:', error);
			// No fallback data - show empty state if API fails
			repos = [];
			totalRepos = 0;
			publicRepos = 0;
			privateRepos = 0;
		} finally {
			isLoading = false;
			console.log('RepoStats: Loading finished, repos count:', repos.length);
		}
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 1) return 'yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return `${Math.floor(diffDays / 365)} years ago`;
	}

	function getLanguageColor(language: string): string {
		const colors: { [key: string]: string } = {
			'C++': '#f34b7d',
			'C': '#555555',
			'Java': '#b07219',
			'Kotlin': '#f18e33',
			'Svelte': '#ff3e00',
			'TypeScript': '#3178c6',
			'JavaScript': '#f1e05a',
			'Python': '#3572A5',
			'HTML': '#e34c26',
			'CSS': '#563d7c',
			'Shell': '#89e051'
		};
		return colors[language] || '#6a737d';
	}
</script>

<div class="repo-stats">
	{#if isLoading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading repositories...</p>
		</div>
	{:else if repos.length > 0}
		<div class="content">
			<div class="stats-overview">
				<div class="stat-item">
					<div class="stat-icon">📦</div>
					<div class="stat-info">
						<div class="stat-value">{totalRepos}</div>
						<div class="stat-label">Total Repos</div>
					</div>
				</div>
				<div class="stat-item">
					<div class="stat-icon">🌐</div>
					<div class="stat-info">
						<div class="stat-value">{publicRepos}</div>
						<div class="stat-label">Public</div>
					</div>
				</div>
				<div class="stat-item">
					<div class="stat-icon">🔒</div>
					<div class="stat-info">
						<div class="stat-value">{privateRepos}</div>
						<div class="stat-label">Private</div>
					</div>
				</div>
			</div>

			<div class="repos-section">
				<div class="repos-header">
					<h4>Featured Repositories</h4>
					<p>A selection of my projects</p>
				</div>

				<div class="repos-list">
					{#each repos as repo, index}
						<a href={repo.html_url} target="_blank" rel="noopener noreferrer" class="repo-item">
							<div class="repo-header">
								<div class="repo-name">
									<span class="repo-icon">📁</span>
									<span class="name">{repo.name}</span>
									{#if repo.private}
										<span class="private-badge">Private</span>
									{/if}
								</div>
								<div class="repo-stats">
									<div class="stat">
										<span class="stat-icon">⭐</span>
										<span class="stat-value">{repo.stargazers_count || 0}</span>
									</div>
									<div class="stat">
										<span class="stat-icon">🔀</span>
										<span class="stat-value">{repo.forks_count || 0}</span>
									</div>
								</div>
							</div>
							
							{#if repo.description}
								<div class="repo-description">{repo.description}</div>
							{/if}
							
							<div class="repo-footer">
								{#if repo.language}
									<div class="language-info">
										<div class="language-dot" style="background-color: {getLanguageColor(repo.language)}"></div>
										<span class="language-name">{repo.language}</span>
									</div>
								{/if}
								<div class="updated-info">
									<span class="updated-text">Updated {formatDate(repo.updated_at)}</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>No repositories found</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.repo-stats {
		background: linear-gradient(145deg, var(--surface) 0%, rgba(255, 255, 255, 0.03) 100%);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 2.5rem;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
		height: 100%;
		position: relative;
		overflow: hidden;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 2px;
			background: linear-gradient(90deg, #f34b7d 0%, #b07219 50%, #89e051 100%);
			z-index: 1;
		}
		
		@media (max-width: 768px) {
			padding: 2rem 1.5rem;
			border-radius: 16px;
		}
		
		@media (max-width: 480px) {
			padding: 1.5rem 1rem;
			border-radius: 12px;
		}
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
		
		@media (max-width: 768px) {
			margin-bottom: 1.5rem;
		}
		
		@media (max-width: 480px) {
			margin-bottom: 1rem;
		}
		
		h3 {
			margin: 0 0 0.5rem 0;
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text);
			background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			
			@media (max-width: 768px) {
				font-size: 1.3rem;
			}
			
			@media (max-width: 480px) {
				font-size: 1.1rem;
			}
		}
		
		.subtitle {
			font-size: 0.9rem;
			color: var(--text-muted);
			margin: 0;
			
			@media (max-width: 480px) {
				font-size: 0.8rem;
			}
		}
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		color: var(--text-muted);
		
		.spinner {
			width: 2rem;
			height: 2rem;
			border: 2px solid var(--border);
			border-top: 2px solid var(--accent);
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin-bottom: 1rem;
		}
		
		p {
			margin: 0;
			font-size: 0.9rem;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		
		@media (max-width: 768px) {
			gap: 1.5rem;
		}
		
		@media (max-width: 480px) {
			gap: 1rem;
		}
	}

	.stats-overview {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		
		@media (max-width: 768px) {
			gap: 1rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.75rem;
		}
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--border);
		border-radius: 12px;
		transition: all 0.3s ease;
		
		@media (max-width: 768px) {
			padding: 0.75rem;
			gap: 0.5rem;
			border-radius: 10px;
		}
		
		@media (max-width: 480px) {
			padding: 0.5rem;
			gap: 0.375rem;
			border-radius: 8px;
		}
		
		&:hover {
			background: rgba(255, 255, 255, 0.05);
			border-color: var(--accent);
			transform: translateY(-2px);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		}
	}

	.stat-icon {
		font-size: 1.5rem;
		opacity: 0.8;
		
		@media (max-width: 768px) {
			font-size: 1.25rem;
		}
		
		@media (max-width: 480px) {
			font-size: 1rem;
		}
	}

	.stat-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text);
		line-height: 1;
		
		@media (max-width: 768px) {
			font-size: 1.1rem;
		}
		
		@media (max-width: 480px) {
			font-size: 1rem;
		}
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--text-muted);
		font-weight: 500;
		
		@media (max-width: 768px) {
			font-size: 0.75rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.7rem;
		}
	}

	.repos-section {
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.25rem;
		transition: all 0.3s ease;
		
		@media (max-width: 768px) {
			padding: 1rem;
			border-radius: 10px;
		}
		
		@media (max-width: 480px) {
			padding: 0.75rem;
			border-radius: 8px;
		}
		
		&:hover {
			background: rgba(255, 255, 255, 0.05);
			border-color: var(--accent);
			transform: translateY(-2px);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		}
	}

	.repos-header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		
		@media (max-width: 768px) {
			margin-bottom: 1rem;
		}
		
		@media (max-width: 480px) {
			margin-bottom: 0.75rem;
		}
		
		h4 {
			margin: 0;
			font-size: 1.25rem;
			font-weight: 700;
			color: var(--text);
			background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			
			@media (max-width: 768px) {
				font-size: 1.1rem;
			}
			
			@media (max-width: 480px) {
				font-size: 1rem;
			}
		}
		
		p {
			font-size: 0.85rem;
			color: var(--text-muted);
			margin: 0;
			
			@media (max-width: 480px) {
				font-size: 0.75rem;
			}
		}
	}

	.repos-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		
		@media (max-width: 768px) {
			gap: 0.75rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.5rem;
		}
	}

	.repo-item {
		display: block;
		padding: 1.25rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--border);
		border-radius: 12px;
		transition: all 0.3s ease;
		text-decoration: none;
		color: inherit;
		
		@media (max-width: 768px) {
			padding: 1rem;
			border-radius: 10px;
		}
		
		@media (max-width: 480px) {
			padding: 0.75rem;
			border-radius: 8px;
		}
		
		&:hover {
			background: rgba(255, 255, 255, 0.05);
			border-color: var(--accent);
			transform: translateX(4px);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		}
	}

	.repo-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.75rem;
		
		@media (max-width: 768px) {
			gap: 0.75rem;
			margin-bottom: 0.5rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.5rem;
			margin-bottom: 0.375rem;
		}
	}

	.repo-name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
		
		@media (max-width: 768px) {
			gap: 0.375rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.25rem;
		}
	}

	.repo-icon {
		font-size: 1rem;
		opacity: 0.7;
		flex-shrink: 0;
		
		@media (max-width: 480px) {
			font-size: 0.9rem;
		}
	}

	.name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		
		@media (max-width: 768px) {
			font-size: 0.9rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.85rem;
		}
	}

	.private-badge {
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-muted);
		background: rgba(255, 255, 255, 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		flex-shrink: 0;
		
		@media (max-width: 480px) {
			font-size: 0.65rem;
			padding: 0.1rem 0.25rem;
		}
	}

	.repo-stats {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
		
		@media (max-width: 768px) {
			gap: 0.75rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.5rem;
		}
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		
		@media (max-width: 480px) {
			gap: 0.125rem;
		}
	}

	.stat-icon {
		font-size: 0.8rem;
		opacity: 0.7;
		
		@media (max-width: 480px) {
			font-size: 0.75rem;
		}
	}

	.stat-value {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text);
		
		@media (max-width: 480px) {
			font-size: 0.75rem;
		}
	}

	.repo-description {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.4;
		margin-bottom: 0.75rem;
		
		@media (max-width: 768px) {
			font-size: 0.8rem;
			margin-bottom: 0.5rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.75rem;
			margin-bottom: 0.375rem;
		}
	}

	.repo-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		
		@media (max-width: 768px) {
			gap: 0.75rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.5rem;
		}
	}

	.language-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		
		@media (max-width: 768px) {
			gap: 0.375rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.25rem;
		}
	}

	.language-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
		
		@media (max-width: 480px) {
			width: 8px;
			height: 8px;
		}
	}

	.language-name {
		font-size: 0.8rem;
		color: var(--text-muted);
		
		@media (max-width: 768px) {
			font-size: 0.75rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.7rem;
		}
	}

	.updated-info {
		flex-shrink: 0;
	}

	.updated-text {
		font-size: 0.75rem;
		color: var(--text-muted);
		
		@media (max-width: 768px) {
			font-size: 0.7rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.65rem;
		}
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--text-muted);
		
		p {
			margin: 0;
			font-size: 0.9rem;
		}
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>

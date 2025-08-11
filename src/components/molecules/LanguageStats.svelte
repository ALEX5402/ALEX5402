<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchAllLanguages, calculateLanguagePercentages, type GitHubLanguage } from '../../util/github';

	let languages: GitHubLanguage[] = [];
	let isLoading = true;

	onMount(async () => {
		try {
			const fetchedLanguages = await fetchAllLanguages();
			languages = calculateLanguagePercentages(fetchedLanguages);
			console.log('Languages loaded:', languages);
		} catch (error) {
			console.error('Error loading languages:', error);
			// Fallback to real data
			languages = [
				{ name: 'C++', percentage: 89.89, color: '#f34b7d' },
				{ name: 'C', percentage: 6.03, color: '#555555' },
				{ name: 'Java', percentage: 1.92, color: '#b07219' },
				{ name: 'Shell', percentage: 0.77, color: '#89e051' },
				{ name: 'Kotlin', percentage: 0.59, color: '#f18e33' },
				{ name: 'Makefile', percentage: 0.33, color: '#427819' },
				{ name: 'HTML', percentage: 0.27, color: '#e34c26' },
				{ name: 'Svelte', percentage: 0.20, color: '#ff3e00' }
			];
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="language-stats">
	<div class="header">
		<h3>Programming Languages</h3>
		<p class="subtitle">Based on my GitHub repositories</p>
	</div>

	{#if isLoading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading language statistics...</p>
		</div>
	{:else if languages.length > 0}
		<div class="content">
			<div class="stats-summary">
				<div class="dominant-language">
					<div class="dominant-icon" style="background-color: {languages[0].color}">
						<span>{languages[0].name}</span>
					</div>
					<div class="dominant-details">
						<div class="dominant-percentage">{languages[0].percentage.toFixed(1)}%</div>
						<div class="dominant-label">Primary Language</div>
					</div>
				</div>
			</div>

			<div class="language-bars">
				{#each languages as lang, index}
					<div class="language-bar-item {lang.name === 'C++' ? 'dominant' : ''}" style="--lang-color: {lang.color}">
						<div class="bar-header">
							<div class="lang-info">
								<div class="lang-dot" style="background-color: {lang.color}"></div>
								<span class="lang-name">{lang.name}</span>
							</div>
							<span class="lang-percentage">{lang.percentage.toFixed(1)}%</span>
						</div>
						<div class="progress-bar">
							<div 
								class="progress-fill" 
								style="width: {lang.percentage}%; background-color: {lang.color}"
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>No language data available</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.language-stats {
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

	.stats-summary {
		display: flex;
		justify-content: center;
		padding: 1rem 0;
	}

	.dominant-language {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: rgba(243, 75, 125, 0.05);
		border: 1px solid rgba(243, 75, 125, 0.2);
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(243, 75, 125, 0.1);
		
		@media (max-width: 768px) {
			padding: 1.25rem;
			gap: 0.75rem;
		}
		
		@media (max-width: 480px) {
			padding: 1rem;
			gap: 0.5rem;
		}
	}

	.dominant-icon {
		width: 60px;
		height: 60px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		
		@media (max-width: 768px) {
			width: 50px;
			height: 50px;
			border-radius: 10px;
		}
		
		@media (max-width: 480px) {
			width: 45px;
			height: 45px;
			border-radius: 8px;
		}
		
		span {
			color: white;
			font-size: 0.8rem;
			font-weight: 700;
			text-align: center;
			line-height: 1;
			
			@media (max-width: 768px) {
				font-size: 0.7rem;
			}
			
			@media (max-width: 480px) {
				font-size: 0.65rem;
			}
		}
	}

	.dominant-details {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.dominant-percentage {
		font-size: 1.75rem;
		font-weight: 700;
		color: #f34b7d;
		line-height: 1;
		
		@media (max-width: 768px) {
			font-size: 1.5rem;
		}
		
		@media (max-width: 480px) {
			font-size: 1.25rem;
		}
	}

	.dominant-label {
		font-size: 0.85rem;
		color: var(--text-muted);
		font-weight: 500;
		
		@media (max-width: 768px) {
			font-size: 0.8rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.75rem;
		}
	}

	.language-bars {
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

	.language-bar-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--border);
		border-radius: 12px;
		transition: all 0.3s ease;
		
		@media (max-width: 768px) {
			padding: 0.75rem;
			gap: 0.375rem;
			border-radius: 10px;
		}
		
		@media (max-width: 480px) {
			padding: 0.5rem;
			gap: 0.25rem;
			border-radius: 8px;
		}
		
		&:hover {
			background: rgba(255, 255, 255, 0.05);
			border-color: var(--lang-color);
			transform: translateX(4px);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		}
		
		&.dominant {
			background: rgba(243, 75, 125, 0.03);
			border-color: rgba(243, 75, 125, 0.2);
			
			.lang-name {
				color: #f34b7d;
				font-weight: 600;
			}
			
			.lang-percentage {
				color: #f34b7d;
				font-weight: 700;
			}
		}
	}

	.bar-header {
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

	.lang-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
		
		@media (max-width: 768px) {
			gap: 0.5rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.375rem;
		}
	}

	.lang-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		
		@media (max-width: 480px) {
			width: 10px;
			height: 10px;
		}
	}

	.lang-name {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text);
		white-space: nowrap;
		
		@media (max-width: 768px) {
			font-size: 0.85rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.8rem;
		}
	}

	.lang-percentage {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text);
		flex-shrink: 0;
		
		@media (max-width: 768px) {
			font-size: 0.8rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.75rem;
		}
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		overflow: hidden;
		position: relative;
		
		@media (max-width: 768px) {
			height: 6px;
		}
		
		@media (max-width: 480px) {
			height: 5px;
		}
	}

	.progress-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.3s ease;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
		position: relative;
		
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
			border-radius: 4px;
		}
		
		@media (max-width: 480px) {
			border-radius: 3px;
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

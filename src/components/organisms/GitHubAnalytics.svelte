<script>
	import ContributionGraph from '../molecules/ContributionGraph.svelte';
	import LanguageStats from '../molecules/LanguageStats.svelte';
	import RepoStats from '../molecules/RepoStats.svelte';
	import ActivityMetrics from '../molecules/ActivityMetrics.svelte';
	import MonthlyActivityGraph from '../molecules/MonthlyActivityGraph.svelte';
	import WeeklyStats from '../molecules/WeeklyStats.svelte';
	import Tooltip from '../atoms/Tooltip.svelte';
</script>

<section class="github-section">
	<div class="wrapper" id="github-analytics">
		<div class="section-header">
			<Tooltip tip="Your GitHub activity insights">
				<h2><span>github</span>:analytics</h2>
			</Tooltip>
			<p class="section-description">
				Real-time insights into my development activity, contributions, and coding patterns
			</p>
		</div>
	</div>
	
	<div class="analytics-container card">
		<div class="metrics-row">
			<ActivityMetrics />
		</div>
		
		<div class="monthly-activity-row">
			<MonthlyActivityGraph />
		</div>
		
		<div class="main-content">
			<div class="left-panel">
				<ContributionGraph />
				<WeeklyStats />
			</div>
		</div>
		
		<div class="bottom-panel">
			<LanguageStats />
			<RepoStats />
		</div>
	</div>
</section>

<style lang="scss">
	.github-section {
		margin: 6rem auto;
		animation: fadeInUp 1s var(--bezier-two);
		max-width: 1600px;
		padding: 0 3rem;

		@media (max-width: 1400px) {
			max-width: 1400px;
			padding: 0 2rem;
		}

		@media (max-width: 768px) {
			padding: 0 1rem;
		}
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
		animation: fadeInUp 1s var(--bezier-two) 0.2s both;

		@media (max-width: 868px) {
			text-align: left;
			margin-bottom: 2rem;
		}
	}

	.section-description {
		font-size: 1.1rem;
		color: var(--text-secondary);
		max-width: 600px;
		margin: 1rem auto 0 auto;
		line-height: 1.6;

		@media (max-width: 868px) {
			margin: 1rem 0 0 0;
		}
	}

	span {
		color: var(--accent);
	}

	h2 {
		display: inline-block;
		margin-bottom: 0;
	}

	.wrapper {
		display: flex;
		justify-content: center;
		margin-top: 0;

		@media (max-width: 868px) {
			justify-content: left;
			margin-bottom: 0.3rem;
		}
	}

	.analytics-container {
		width: min(98%, 100rem);
		margin: 0 auto 6rem auto;
		padding: 3.5rem;
		background: linear-gradient(135deg, var(--bg-color) 0%, rgba(255, 255, 255, 0.02) 100%);
		border-radius: 24px;
		border: 1px solid var(--border);
		box-shadow: var(--shadow-xl);

		@media (max-width: 1400px) {
			width: min(98%, 90rem);
			padding: 3rem;
		}

		@media (max-width: 868px) {
			width: 100%;
			padding: 2rem;
			border-radius: 20px;
		}

		@media (max-width: 480px) {
			padding: 1.5rem;
		}
	}

	.metrics-row {
		margin-bottom: 3rem;
	}
	
	.monthly-activity-row {
		margin-bottom: 3rem;
	}

	.main-content {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3.5rem;
	}

	.left-panel {
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
	}
	
	.bottom-panel {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		margin-top: 3rem;
		
		@media (max-width: 1200px) {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
	}


</style>

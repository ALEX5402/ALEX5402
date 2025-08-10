<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUserData, fetchUserRepos, generateContributionData } from '../../util/github';
	
	interface WeeklyData {
		week: number;
		contributions: number;
		commits: number;
		prs: number;
		issues: number;
		reviews: number;
	}
	
	let weeklyData: WeeklyData[] = [];
	let selectedYear = 2024;
	let isLoading = true;
	
	// Generate weekly data based on GitHub contribution data
	const generateWeeklyDataFromGitHub = async (year: number): Promise<WeeklyData[]> => {
		try {
			// Get contribution data from GitHub
			const contributionData = generateContributionData(year);
			
			// Group contributions by week
			const weeklyContributions: { [week: number]: number } = {};
			
			contributionData.forEach(day => {
				const weekNumber = getWeekNumber(day.date);
				weeklyContributions[weekNumber] = (weeklyContributions[weekNumber] || 0) + day.contributions;
			});
			
			// Generate weekly data
			const data: WeeklyData[] = [];
			for (let week = 1; week <= 52; week++) {
				const contributions = weeklyContributions[week] || 0;
				const commits = Math.floor(contributions * 0.7);
				const prs = Math.floor(contributions * 0.2);
				const issues = Math.floor(contributions * 0.1);
				const reviews = Math.floor(contributions * 0.15);
				
				data.push({
					week,
					contributions,
					commits,
					prs,
					issues,
					reviews
				});
			}
			
			return data;
		} catch (error) {
			console.error('Failed to generate weekly data:', error);
			// Fallback to mock data
			return generateMockWeeklyData(year);
		}
	};
	
	// Fallback mock data generation
	const generateMockWeeklyData = (year: number): WeeklyData[] => {
		const data: WeeklyData[] = [];
		const weeksInYear = 52;
		
		for (let week = 1; week <= weeksInYear; week++) {
			const baseActivity = Math.random() * 0.8 + 0.2;
			const isActiveWeek = Math.random() < 0.2;
			
			data.push({
				week,
				contributions: Math.floor(Math.random() * 30 * baseActivity) + (isActiveWeek ? 15 : 0),
				commits: Math.floor(Math.random() * 20 * baseActivity) + (isActiveWeek ? 10 : 0),
				prs: Math.floor(Math.random() * 5 * baseActivity) + (isActiveWeek ? 3 : 0),
				issues: Math.floor(Math.random() * 4 * baseActivity) + (isActiveWeek ? 2 : 0),
				reviews: Math.floor(Math.random() * 8 * baseActivity) + (isActiveWeek ? 5 : 0)
			});
		}
		
		return data;
	};
	
	// Helper function to get week number
	const getWeekNumber = (date: Date): number => {
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
		return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	};
	
	onMount(async () => {
		try {
			weeklyData = await generateWeeklyDataFromGitHub(selectedYear);
		} catch (error) {
			console.error('Failed to load weekly data:', error);
			weeklyData = generateMockWeeklyData(selectedYear);
		} finally {
			isLoading = false;
		}
	});
	
	$: topWeeks = weeklyData
		.sort((a, b) => b.contributions - a.contributions)
		.slice(0, 5);
	
	$: totalContributions = weeklyData.reduce((sum, week) => sum + week.contributions, 0);
	$: averageWeekly = Math.round(totalContributions / weeklyData.length);
	$: mostActiveWeek = topWeeks[0];
	
	const getActivityTotal = (activityType: string): number => {
		return weeklyData.reduce((sum, week) => sum + (week[activityType as keyof WeeklyData] as number), 0);
	};
	
	const getMaxActivityTotal = (): number => {
		const activityTypes = ['contributions', 'commits', 'prs', 'issues', 'reviews'];
		return Math.max(...activityTypes.map(type => getActivityTotal(type)));
	};
</script>

<div class="weekly-stats">
	<div class="header">
		<h3>Weekly Performance</h3>
		<span class="subtitle">Year {selectedYear}</span>
	</div>
	
	{#if isLoading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading weekly data...</p>
		</div>
	{:else}
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-icon">📊</div>
				<div class="stat-content">
					<div class="stat-value">{totalContributions}</div>
					<div class="stat-label">Total Contributions</div>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">📈</div>
				<div class="stat-content">
					<div class="stat-value">{averageWeekly}</div>
					<div class="stat-label">Avg/Week</div>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">🔥</div>
				<div class="stat-content">
					<div class="stat-value">Week {mostActiveWeek?.week}</div>
					<div class="stat-label">Peak Week</div>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">🎯</div>
				<div class="stat-content">
					<div class="stat-value">{topWeeks.length}</div>
					<div class="stat-label">Active Weeks</div>
				</div>
			</div>
		</div>
		
		<div class="mobile-content">
			<div class="top-weeks">
				<h4>Top 5 Weeks</h4>
				<div class="week-list">
					{#each topWeeks as week, index}
						<div class="week-item">
							<div class="week-rank">#{index + 1}</div>
							<div class="week-info">
								<div class="week-number">Week {week.week}</div>
								<div class="week-contributions">{week.contributions} contributions</div>
							</div>
							<div class="week-details">
								<span class="detail-item">📝 {week.commits}</span>
								<span class="detail-item">🔀 {week.prs}</span>
								<span class="detail-item">🐛 {week.issues}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
			
			<div class="activity-distribution">
				<h4>Activity Distribution</h4>
				<div class="distribution-bars">
					{#each ['contributions', 'commits', 'prs', 'issues', 'reviews'] as activityType}
						{@const total = getActivityTotal(activityType)}
						{@const maxTotal = getMaxActivityTotal()}
						{@const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0}
						<div class="distribution-item">
							<div class="activity-label">{activityType.charAt(0).toUpperCase() + activityType.slice(1)}</div>
							<div class="activity-bar">
								<div class="bar-fill" style="width: {percentage}%"></div>
							</div>
							<div class="activity-value">{total}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	/* Loading state */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		text-align: center;
		
		@media (max-width: 768px) {
			padding: 2rem 1.5rem;
		}
		
		@media (max-width: 480px) {
			padding: 1.5rem 1rem;
		}
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border);
		border-top: 3px solid var(--accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
		
		@media (max-width: 480px) {
			width: 32px;
			height: 32px;
			border-width: 2px;
		}
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.loading-state p {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin: 0;
		
		@media (max-width: 480px) {
			font-size: 0.8rem;
		}
	}
	
	.weekly-stats {
		background: linear-gradient(145deg, var(--surface) 0%, rgba(255, 255, 255, 0.03) 100%);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 3rem;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
		
		@media (max-width: 768px) {
			padding: 2rem 1.5rem;
			border-radius: 16px;
		}
		
		@media (max-width: 480px) {
			padding: 1rem;
			border-radius: 12px;
			/* Prevent horizontal overflow */
			overflow-x: hidden;
			width: 100%;
			max-width: 100%;
		}
	}
	
	.header {
		margin-bottom: 2.5rem;
		text-align: center;
		
		@media (max-width: 768px) {
			margin-bottom: 2rem;
		}
		
		@media (max-width: 480px) {
			margin-bottom: 1.5rem;
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
			font-size: 1rem;
			color: var(--text-muted);
			font-weight: 500;
			
			@media (max-width: 480px) {
				font-size: 0.9rem;
			}
		}
	}
	
	/* Force mobile layout with higher specificity */
	.stats-grid {
		display: grid !important;
		grid-template-columns: repeat(2, 1fr) !important;
		gap: 2rem;
		margin-bottom: 3rem;
		width: 100% !important;
		max-width: 100% !important;
		
		/* CSS custom properties for mobile layout */
		--mobile-grid-columns: repeat(2, 1fr);
		--mobile-gap: 2rem;
		
		@media (max-width: 768px) {
			--mobile-grid-columns: 1fr;
			--mobile-gap: 1.5rem;
			grid-template-columns: var(--mobile-grid-columns) !important;
			gap: var(--mobile-gap) !important;
			margin-bottom: 2.5rem;
			width: 100% !important;
			max-width: 100% !important;
		}
		
		@media (max-width: 480px) {
			--mobile-grid-columns: 1fr;
			--mobile-gap: 1rem;
			grid-template-columns: var(--mobile-grid-columns) !important;
			gap: var(--mobile-gap) !important;
			margin-bottom: 2rem;
			width: 100% !important;
			max-width: 100% !important;
		}
		
		/* Hide stats grid on mobile phones */
		@media (max-width: 480px) {
			display: none !important;
		}
	}
	
	/* Mobile content container */
	.mobile-content {
		display: none;
		
		@media (max-width: 480px) {
			display: block;
			/* Reduce spacing for mobile to prevent cropping */
			margin-bottom: 0;
		}
	}
	
	/* Ensure stat cards maintain their layout */
	.stat-card {
		display: flex !important;
		align-items: center;
		gap: 1.5rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--bg-color) 0%, rgba(255, 255, 255, 0.05) 100%);
		border-radius: 16px;
		border: 1px solid var(--border);
		transition: all 0.4s ease;
		position: relative;
		overflow: hidden;
		width: 100% !important;
		min-width: 0 !important;
		
		@media (max-width: 768px) {
			padding: 1.5rem;
			gap: 1rem;
			border-radius: 12px;
			width: 100% !important;
			min-width: 0 !important;
		}
		
		@media (max-width: 480px) {
			padding: 1.25rem;
			gap: 0.75rem;
			border-radius: 10px;
			width: 100% !important;
			min-width: 0 !important;
		}
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
			transition: left 0.5s ease;
		}
		
		&:hover {
			transform: translateY(-5px) scale(1.02);
			box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
			border-color: var(--accent);
			
			&::before {
				left: 100%;
			}
		}
	}
	
	.stat-icon {
		font-size: 2.5rem;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--accent) 0%, rgba(255, 255, 255, 0.1) 100%);
		border-radius: 12px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		
		@media (max-width: 768px) {
			font-size: 2rem;
			width: 3.5rem;
			height: 3.5rem;
			border-radius: 10px;
		}
		
		@media (max-width: 480px) {
			font-size: 1.8rem;
			width: 3rem;
			height: 3rem;
			border-radius: 8px;
		}
	}
	
	.stat-content {
		flex: 1;
	}
	
	.stat-value {
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--text);
		margin-bottom: 0.75rem;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		
		@media (max-width: 768px) {
			font-size: 1.5rem;
			margin-bottom: 0.5rem;
		}
		
		@media (max-width: 480px) {
			font-size: 1.3rem;
			margin-bottom: 0.25rem;
		}
	}
	
	.stat-label {
		font-size: 0.8rem;
		color: var(--text-muted);
		
		@media (max-width: 480px) {
			font-size: 0.75rem;
		}
	}
	
	.top-weeks {
		margin-bottom: 1.5rem;
		
		@media (max-width: 768px) {
			margin-bottom: 1.25rem;
		}
		
		@media (max-width: 480px) {
			margin-bottom: 1rem;
		}
		
		h4 {
			margin: 0 0 1rem 0;
			font-size: 1rem;
			color: var(--text);
			
			@media (max-width: 480px) {
				font-size: 0.9rem;
				margin-bottom: 0.75rem;
			}
		}
	}
	
	.week-list {
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
	
	.week-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--bg-color);
		border-radius: 10px;
		border: 1px solid var(--border);
		transition: all 0.2s ease;
		
		@media (max-width: 768px) {
			padding: 0.75rem;
			gap: 0.75rem;
			border-radius: 8px;
		}
		
		@media (max-width: 480px) {
			padding: 0.5rem;
			gap: 0.5rem;
			border-radius: 6px;
			/* Force fit within viewport */
			width: 100% !important;
			max-width: 100vw !important;
			overflow-x: hidden !important;
			box-sizing: border-box !important;
		}
		
		&:hover {
			border-color: var(--accent);
			transform: translateX(4px);
		}
	}
	
	.week-rank {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--accent);
		min-width: 2rem;
		
		@media (max-width: 480px) {
			font-size: 0.8rem;
			min-width: 1.5rem;
			flex-shrink: 0;
		}
	}
	
	.week-info {
		flex: 1;
		min-width: 0;
		
		@media (max-width: 480px) {
			overflow: hidden;
		}
	}
	
	.week-number {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text);
		margin-bottom: 0.25rem;
		
		@media (max-width: 480px) {
			font-size: 0.8rem;
			margin-bottom: 0.125rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	
	.week-contributions {
		font-size: 0.8rem;
		color: var(--text-muted);
		
		@media (max-width: 480px) {
			font-size: 0.7rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	
	.week-details {
		display: flex;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-muted);
		
		@media (max-width: 768px) {
			gap: 0.25rem;
			font-size: 0.75rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.125rem;
			font-size: 0.7rem;
			/* Force fit and wrap */
			flex-wrap: wrap !important;
			min-width: 0 !important;
			overflow-x: hidden !important;
			max-width: 40% !important;
		}
	}
	
	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		
		@media (max-width: 480px) {
			gap: 0.125rem;
			/* Force text to fit */
			white-space: nowrap !important;
			overflow: hidden !important;
			text-overflow: ellipsis !important;
			max-width: 100% !important;
			flex-shrink: 1 !important;
		}
	}
	
	.activity-distribution {
		h4 {
			margin: 0 0 1rem 0;
			font-size: 1rem;
			color: var(--text);
			
			@media (max-width: 480px) {
				font-size: 0.9rem;
				margin-bottom: 0.75rem;
			}
		}
	}
	
	.distribution-bars {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		
		@media (max-width: 768px) {
			gap: 0.5rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.375rem;
		}
	}
	
	.distribution-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		
		@media (max-width: 768px) {
			gap: 0.5rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.375rem;
			/* Ensure content fits */
			width: 100%;
			max-width: 100%;
		}
	}
	
	.activity-label {
		font-size: 0.8rem;
		color: var(--text);
		min-width: 4rem;
		
		@media (max-width: 768px) {
			font-size: 0.75rem;
			min-width: 3.5rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.7rem;
			min-width: 3rem;
			/* Prevent text overflow */
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	
	.activity-bar {
		flex: 1;
		height: 8px;
		background: var(--border);
		border-radius: 4px;
		overflow: hidden;
		
		@media (max-width: 480px) {
			height: 6px;
			border-radius: 3px;
		}
	}
	
	.bar-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 4px;
		transition: width 0.3s ease;
		
		@media (max-width: 480px) {
			border-radius: 3px;
		}
	}
	
	.activity-value {
		font-size: 0.8rem;
		color: var(--text-muted);
		min-width: 2rem;
		text-align: right;
		
		@media (max-width: 768px) {
			font-size: 0.75rem;
			min-width: 1.5rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.7rem;
			min-width: 1.25rem;
			/* Ensure value doesn't overflow */
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>

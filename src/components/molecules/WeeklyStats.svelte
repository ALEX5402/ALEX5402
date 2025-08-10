<script lang="ts">
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
	
	// Generate weekly data for the selected year
	$: {
		weeklyData = [];
		const weeksInYear = 52;
		
		for (let week = 1; week <= weeksInYear; week++) {
			const baseActivity = Math.random() * 0.8 + 0.2;
			const isActiveWeek = Math.random() < 0.2;
			
			weeklyData.push({
				week,
				contributions: Math.floor(Math.random() * 30 * baseActivity) + (isActiveWeek ? 15 : 0),
				commits: Math.floor(Math.random() * 20 * baseActivity) + (isActiveWeek ? 10 : 0),
				prs: Math.floor(Math.random() * 5 * baseActivity) + (isActiveWeek ? 3 : 0),
				issues: Math.floor(Math.random() * 4 * baseActivity) + (isActiveWeek ? 2 : 0),
				reviews: Math.floor(Math.random() * 8 * baseActivity) + (isActiveWeek ? 5 : 0)
			});
		}
	}
	
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

<style lang="scss">
	.weekly-stats {
		background: linear-gradient(145deg, var(--surface) 0%, rgba(255, 255, 255, 0.03) 100%);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 3rem;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
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
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		margin-bottom: 3rem;
	}
	
	.stat-card {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--bg-color) 0%, rgba(255, 255, 255, 0.05) 100%);
		border-radius: 16px;
		border: 1px solid var(--border);
		transition: all 0.4s ease;
		position: relative;
		overflow: hidden;
		
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
	}
	
	.stat-label {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	
	.top-weeks {
		margin-bottom: 1.5rem;
		
		h4 {
			margin: 0 0 1rem 0;
			font-size: 1rem;
			color: var(--text);
		}
	}
	
	.week-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
	}
	
	.week-info {
		flex: 1;
	}
	
	.week-number {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text);
		margin-bottom: 0.25rem;
	}
	
	.week-contributions {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	
	.week-details {
		display: flex;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	
	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	
	.activity-distribution {
		h4 {
			margin: 0 0 1rem 0;
			font-size: 1rem;
			color: var(--text);
		}
	}
	
	.distribution-bars {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.distribution-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	
	.activity-label {
		font-size: 0.8rem;
		color: var(--text);
		min-width: 4rem;
	}
	
	.activity-bar {
		flex: 1;
		height: 8px;
		background: var(--border);
		border-radius: 4px;
		overflow: hidden;
	}
	
	.bar-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 4px;
		transition: width 0.3s ease;
	}
	
	.activity-value {
		font-size: 0.8rem;
		color: var(--text-muted);
		min-width: 2rem;
		text-align: right;
	}
</style>

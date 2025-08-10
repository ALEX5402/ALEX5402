<script lang="ts">
	import { onMount } from 'svelte';
	
	interface MonthlyData {
		year: number;
		month: number;
		contributions: number;
		commits: number;
		prs: number;
		issues: number;
	}
	
	let monthlyData: MonthlyData[] = [];
	let selectedYear = 2024;
	let years = [2025, 2024, 2023, 2022, 2021];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	
	onMount(() => {
		generateMonthlyData();
		if (canvas) {
			ctx = canvas.getContext('2d');
			drawGraph();
		}
	});
	
	const generateMonthlyData = () => {
		const data: MonthlyData[] = [];
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth();
		
		for (let year = 2022; year <= currentYear; year++) {
			for (let month = 0; month < 12; month++) {
				if (year === currentYear && month > currentMonth) continue;
				
				const baseActivity = Math.random() * 0.8 + 0.2;
				const isActivePeriod = Math.random() < 0.3;
				
				data.push({
					year,
					month,
					contributions: Math.floor(Math.random() * 50 * baseActivity) + (isActivePeriod ? 20 : 0),
					commits: Math.floor(Math.random() * 30 * baseActivity) + (isActivePeriod ? 15 : 0),
					prs: Math.floor(Math.random() * 10 * baseActivity) + (isActivePeriod ? 5 : 0),
					issues: Math.floor(Math.random() * 8 * baseActivity) + (isActivePeriod ? 3 : 0)
				});
			}
		}
		
		monthlyData = data;
	};
	
	const drawGraph = () => {
		if (!ctx || !canvas) return;
		
		const width = canvas.width;
		const height = canvas.height;
		const padding = 40;
		const chartWidth = width - 2 * padding;
		const chartHeight = height - 2 * padding;
		
		// Clear canvas
		ctx.clearRect(0, 0, width, height);
		
		// Filter data for selected year
		const yearData = monthlyData.filter(d => d.year === selectedYear);
		if (yearData.length === 0) return;
		
		// Find max values for scaling
		const maxContributions = Math.max(...yearData.map(d => d.contributions));
		const maxCommits = Math.max(...yearData.map(d => d.commits));
		const maxPRs = Math.max(...yearData.map(d => d.prs));
		const maxIssues = Math.max(...yearData.map(d => d.issues));
		
		const maxValue = Math.max(maxContributions, maxCommits, maxPRs, maxIssues);
		
		// Draw grid
		ctx.strokeStyle = '#2d2d35';
		ctx.lineWidth = 1;
		
		// Horizontal grid lines
		for (let i = 0; i <= 5; i++) {
			const y = padding + (chartHeight / 5) * i;
			ctx.beginPath();
			ctx.moveTo(padding, y);
			ctx.lineTo(width - padding, y);
			ctx.stroke();
		}
		
		// Vertical grid lines
		for (let i = 0; i <= 12; i++) {
			const x = padding + (chartWidth / 12) * i;
			ctx.beginPath();
			ctx.moveTo(x, padding);
			ctx.lineTo(x, height - padding);
			ctx.stroke();
		}
		
		// Draw month labels
		ctx.fillStyle = '#8b9ba8';
		ctx.font = '12px "JetBrains Mono", monospace';
		ctx.textAlign = 'center';
		
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		months.forEach((month, i) => {
			const x = padding + (chartWidth / 12) * i + (chartWidth / 24);
			ctx.fillText(month, x, height - 15);
		});
		
		// Draw value labels
		ctx.textAlign = 'right';
		for (let i = 0; i <= 5; i++) {
			const y = padding + (chartHeight / 5) * i;
			const value = Math.round((maxValue / 5) * (5 - i));
			ctx.fillText(value.toString(), padding - 10, y + 4);
		}
		
		// Draw data lines
		const colors = {
			contributions: '#40c463',
			commits: '#0366d6',
			prs: '#6f42c1',
			issues: '#d73a49'
		};
		
		// Draw contributions line
		drawLine(yearData, 'contributions', colors.contributions, maxValue, padding, chartWidth, chartHeight);
		
		// Draw commits line
		drawLine(yearData, 'commits', colors.commits, maxValue, padding, chartWidth, chartHeight);
		
		// Draw PRs line
		drawLine(yearData, 'prs', colors.prs, maxValue, padding, chartWidth, chartHeight);
		
		// Draw issues line
		drawLine(yearData, 'issues', colors.issues, maxValue, padding, chartWidth, chartHeight);
	};
	
	const drawLine = (data: MonthlyData[], key: keyof MonthlyData, color: string, maxValue: number, padding: number, chartWidth: number, chartHeight: number) => {
		if (!ctx) return;
		
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.fillStyle = color;
		
		ctx.beginPath();
		
		data.forEach((point, i) => {
			const x = padding + (chartWidth / 12) * point.month + (chartWidth / 24);
			const y = padding + chartHeight - ((point[key] as number) / maxValue) * chartHeight;
			
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
			
			// Draw point
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
		});
		
		ctx.stroke();
	};
	
	const changeYear = (year: number) => {
		selectedYear = year;
		drawGraph();
	};
	
	$: if (ctx && canvas) {
		drawGraph();
	}
</script>

<div class="monthly-activity-graph">
	<div class="header">
		<h3>Monthly Activity Trends</h3>
		<div class="year-selector">
			{#each years as year}
				<button 
					class="year-btn {selectedYear === year ? 'active' : ''}"
					on:click={() => changeYear(year)}
				>
					{year}
				</button>
			{/each}
		</div>
	</div>
	
	<div class="chart-container">
		<canvas 
			bind:this={canvas}
			width="800"
			height="400"
			class="activity-chart"
		></canvas>
		
		<div class="legend">
			<div class="legend-item">
				<div class="legend-color" style="background-color: #40c463"></div>
				<span>Contributions</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background-color: #0366d6"></div>
				<span>Commits</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background-color: #6f42c1"></div>
				<span>Pull Requests</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background-color: #d73a49"></div>
				<span>Issues</span>
			</div>
		</div>
	</div>
	
	<div class="stats-summary">
		<div class="stat-item">
			<span class="stat-label">Peak Month</span>
			<span class="stat-value">
				{(() => {
					const yearData = monthlyData.filter(d => d.year === selectedYear);
					if (yearData.length === 0) return 'N/A';
					const peak = yearData.reduce((max, curr) => 
						curr.contributions > max.contributions ? curr : max
					);
					const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					return `${months[peak.month]} (${peak.contributions})`;
				})()}
			</span>
		</div>
		<div class="stat-item">
			<span class="stat-label">Total Activity</span>
			<span class="stat-value">
				{(() => {
					const yearData = monthlyData.filter(d => d.year === selectedYear);
					return yearData.reduce((sum, d) => sum + d.contributions, 0);
				})()}
			</span>
		</div>
		<div class="stat-item">
			<span class="stat-label">Avg/Month</span>
			<span class="stat-value">
				{(() => {
					const yearData = monthlyData.filter(d => d.year === selectedYear);
					if (yearData.length === 0) return 0;
					const total = yearData.reduce((sum, d) => sum + d.contributions, 0);
					return Math.round(total / yearData.length);
				})()}
			</span>
		</div>
	</div>
</div>

<style lang="scss">
	.monthly-activity-graph {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1rem;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		
		@media (max-width: 768px) {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
		
		h3 {
			margin: 0;
			font-size: 1.1rem;
			color: var(--text);
		}
	}
	
	.year-selector {
		display: flex;
		gap: 0.5rem;
	}
	
	.year-btn {
		background: none;
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.25rem 0.5rem;
		color: var(--text);
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
		
		&:hover {
			background: var(--surface);
		}
		
		&.active {
			background: var(--accent);
			color: white;
			border-color: var(--accent);
		}
	}
	
	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	
	.activity-chart {
		width: 100%;
		height: auto;
		border-radius: 8px;
		background: var(--bg-color);
	}
	
	.legend {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
		
		@media (max-width: 768px) {
			gap: 1rem;
		}
	}
	
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text);
	}
	
	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 2px;
	}
	
	.stats-summary {
		display: flex;
		justify-content: space-around;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
		
		@media (max-width: 768px) {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		text-align: center;
	}
	
	.stat-label {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	
	.stat-value {
		font-size: 1rem;
		color: var(--text);
		font-weight: 600;
	}
</style>

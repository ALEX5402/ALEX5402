<script lang="ts">
	import { onMount } from 'svelte';
	import { generateContributionData } from '../../util/github';
	
	interface ContributionDay {
		date: Date;
		contributions: number;
		isFuture: boolean;
	}
	
	let contributionData: ContributionDay[] = [];
	let selectedYear = 2024;
	let years = [2025, 2024, 2023, 2022, 2021];
	let hoveredDay: ContributionDay | null = null;
	let tooltipVisible = false;
	let tooltipX = 0;
	let tooltipY = 0;

	
	const getContributionColor = (count: number): string => {
		if (count === 0) return 'var(--surface)';
		if (count <= 3) return '#9be9a8';
		if (count <= 6) return '#40c463';
		if (count <= 9) return '#30a14e';
		return '#216e39';
	};
	
	const handleDayHover = (event: MouseEvent, day: ContributionDay) => {
		hoveredDay = day;
		tooltipVisible = true;
		tooltipX = event.clientX;
		tooltipY = event.clientY;
	};
	
	const handleDayLeave = () => {
		tooltipVisible = false;
		hoveredDay = null;
	};
	
	const changeYear = (year: number) => {
		selectedYear = year;
		contributionData = generateContributionData(year);
	};
	
	onMount(() => {
		contributionData = generateContributionData(selectedYear);
	});
	
	let weeks: (ContributionDay | null)[][] = [];
	
	$: totalContributions = contributionData.reduce((sum, day) => sum + day.contributions, 0);
	$: {
		weeks = [];
		let currentWeek: (ContributionDay | null)[] = [];
		let currentWeekStart = new Date(contributionData[0]?.date);
		
		const dayOfWeek = currentWeekStart.getDay();
		for (let i = 0; i < dayOfWeek; i++) {
			currentWeek.push(null);
		}
		
		contributionData.forEach(day => {
			currentWeek.push(day);
			if (currentWeek.length === 7) {
				weeks.push([...currentWeek]);
				currentWeek = [];
			}
		});
		
		while (currentWeek.length < 7) {
			currentWeek.push(null);
		}
		if (currentWeek.length > 0) {
			weeks.push(currentWeek);
		}
	}
</script>

<div class="contribution-graph">
	<div class="header">
		<div class="title">
			<h3>{totalContributions.toLocaleString()} contributions in {selectedYear}</h3>
		</div>
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
	
	<div class="graph-container">
		<div class="months">
			{#each ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as month, i}
				<div class="month" style="grid-column: {Math.floor(i * 4.33) + 1}">
					{month}
				</div>
			{/each}
		</div>
		
		<div class="graph">
			<div class="days-labels">
				<div>Mon</div>
				<div></div>
				<div>Wed</div>
				<div></div>
				<div>Fri</div>
				<div></div>
				<div></div>
			</div>
			
			<div class="contribution-grid">
				{#each weeks as week, weekIndex}
					{#each week as day, dayIndex}
						{#if day}
												<div
						class="contribution-day {day.isFuture ? 'future' : ''}"
						style="background-color: {getContributionColor(day.contributions)}"
						on:mouseenter={(e) => handleDayHover(e, day)}
						on:mouseleave={handleDayLeave}
						role="button"
						tabindex="0"
						aria-label="Day with {day.contributions} contributions on {day.date.toLocaleDateString()}"
					></div>
						{:else}
							<div class="contribution-day empty"></div>
						{/if}
					{/each}
				{/each}
			</div>
		</div>
	</div>
	
	<div class="legend">
		<span>Less</span>
		<div class="legend-squares">
			<div class="legend-square" style="background-color: var(--surface)"></div>
			<div class="legend-square" style="background-color: #9be9a8"></div>
			<div class="legend-square" style="background-color: #40c463"></div>
			<div class="legend-square" style="background-color: #30a14e"></div>
			<div class="legend-square" style="background-color: #216e39"></div>
		</div>
		<span>More</span>
	</div>
	
	{#if tooltipVisible && hoveredDay}
		<div 
			class="tooltip"
			style="left: {tooltipX}px; top: {tooltipY - 60}px"
		>
			<div class="tooltip-content">
				<strong>{hoveredDay.contributions} contributions</strong>
				<div>{hoveredDay.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.contribution-graph {
		position: relative;
		background: linear-gradient(145deg, var(--surface) 0%, rgba(255, 255, 255, 0.03) 100%);
		border-radius: 20px;
		padding: 3rem;
		border: 1px solid var(--border);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
		
		@media (max-width: 1200px) {
			padding: 2.5rem;
			border-radius: 18px;
		}
		
		@media (max-width: 768px) {
			padding: 2rem 1.5rem;
			border-radius: 16px;
		}
		
		@media (max-width: 480px) {
			padding: 1.5rem 1rem;
			border-radius: 12px;
		}
		
		@media (max-width: 360px) {
			padding: 1rem 0.75rem;
			border-radius: 10px;
		}
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		
		@media (max-width: 1200px) {
			margin-bottom: 1.75rem;
		}
		
		@media (max-width: 768px) {
			flex-direction: column;
			align-items: flex-start;
			gap: 1.5rem;
			margin-bottom: 1.5rem;
		}
		
		@media (max-width: 480px) {
			gap: 1rem;
			margin-bottom: 1.25rem;
		}
		
		@media (max-width: 360px) {
			gap: 0.75rem;
			margin-bottom: 1rem;
		}
	}
	
	.title h3 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text);
		background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		
		@media (max-width: 1200px) {
			font-size: 1.4rem;
		}
		
		@media (max-width: 768px) {
			font-size: 1.3rem;
		}
		
		@media (max-width: 480px) {
			font-size: 1.1rem;
		}
		
		@media (max-width: 360px) {
			font-size: 1rem;
		}
	}
	
	.year-selector {
		display: flex;
		gap: 0.5rem;
		
		@media (max-width: 1200px) {
			gap: 0.4rem;
		}
		
		@media (max-width: 768px) {
			gap: 0.375rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.25rem;
		}
		
		@media (max-width: 360px) {
			gap: 0.2rem;
		}
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
		
		@media (max-width: 1200px) {
			padding: 0.2rem 0.45rem;
			font-size: 0.85rem;
		}
		
		@media (max-width: 768px) {
			padding: 0.2rem 0.4rem;
			font-size: 0.8rem;
			border-radius: 4px;
		}
		
		@media (max-width: 480px) {
			padding: 0.15rem 0.3rem;
			font-size: 0.75rem;
			border-radius: 3px;
		}
		
		@media (max-width: 360px) {
			padding: 0.1rem 0.25rem;
			font-size: 0.7rem;
			border-radius: 2px;
		}
		
		&:hover {
			background: var(--surface);
		}
		
		&.active {
			background: var(--accent);
			color: white;
			border-color: var(--accent);
		}
	}
	
	.graph-container {
		margin-bottom: 1rem;
		
		@media (max-width: 1200px) {
			margin-bottom: 0.875rem;
		}
		
		@media (max-width: 768px) {
			margin-bottom: 0.75rem;
		}
		
		@media (max-width: 480px) {
			margin-bottom: 0.5rem;
		}
		
		@media (max-width: 360px) {
			margin-bottom: 0.375rem;
		}
	}
	
	.months {
		display: grid;
		grid-template-columns: repeat(53, 1fr);
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-muted);
		
		@media (max-width: 1200px) {
			font-size: 0.75rem;
			margin-bottom: 0.4rem;
		}
		
		@media (max-width: 768px) {
			font-size: 0.7rem;
			margin-bottom: 0.375rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.6rem;
			margin-bottom: 0.25rem;
		}
		
		@media (max-width: 360px) {
			font-size: 0.55rem;
			margin-bottom: 0.2rem;
		}
	}
	
	.month {
		text-align: center;
	}
	
	.graph {
		display: flex;
		gap: 0.5rem;
		
		@media (max-width: 1200px) {
			gap: 0.4rem;
		}
		
		@media (max-width: 768px) {
			gap: 0.375rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.25rem;
		}
		
		@media (max-width: 360px) {
			gap: 0.2rem;
		}
	}
	
	.days-labels {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8rem;
		color: var(--text-muted);
		padding-right: 0.5rem;
		
		@media (max-width: 1200px) {
			font-size: 0.75rem;
			gap: 0.2rem;
			padding-right: 0.4rem;
		}
		
		@media (max-width: 768px) {
			font-size: 0.7rem;
			gap: 0.2rem;
			padding-right: 0.375rem;
		}
		
		@media (max-width: 480px) {
			font-size: 0.6rem;
			gap: 0.15rem;
			padding-right: 0.25rem;
		}
		
		@media (max-width: 360px) {
			font-size: 0.55rem;
			gap: 0.1rem;
			padding-right: 0.2rem;
		}
		
		div {
			height: 12px;
			display: flex;
			align-items: center;
			
			@media (max-width: 1200px) {
				height: 11px;
			}
			
			@media (max-width: 768px) {
				height: 10px;
			}
			
			@media (max-width: 480px) {
				height: 8px;
			}
			
			@media (max-width: 360px) {
				height: 7px;
			}
		}
	}
	
	.contribution-grid {
		display: grid;
		grid-template-columns: repeat(53, 1fr);
		gap: 2px;
		flex: 1;
		
		@media (max-width: 1200px) {
			gap: 1.75px;
		}
		
		@media (max-width: 768px) {
			gap: 1.5px;
		}
		
		@media (max-width: 480px) {
			gap: 1px;
		}
		
		@media (max-width: 360px) {
			gap: 0.75px;
		}
	}
	
	.contribution-day {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		cursor: pointer;
		transition: transform 0.1s ease;
		
		@media (max-width: 1200px) {
			width: 11px;
			height: 11px;
			border-radius: 1.75px;
		}
		
		@media (max-width: 768px) {
			width: 10px;
			height: 10px;
			border-radius: 1.5px;
		}
		
		@media (max-width: 480px) {
			width: 8px;
			height: 8px;
			border-radius: 1px;
		}
		
		@media (max-width: 360px) {
			width: 7px;
			height: 7px;
			border-radius: 0.75px;
		}
		
		&:hover {
			transform: scale(1.2);
		}
		
		&.future {
			opacity: 0.3;
		}
		
		&.empty {
			background: transparent;
		}
	}
	
	.legend {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-muted);
		justify-content: flex-end;
		
		@media (max-width: 1200px) {
			gap: 0.4rem;
			font-size: 0.75rem;
		}
		
		@media (max-width: 768px) {
			gap: 0.375rem;
			font-size: 0.7rem;
		}
		
		@media (max-width: 480px) {
			gap: 0.25rem;
			font-size: 0.6rem;
		}
		
		@media (max-width: 360px) {
			gap: 0.2rem;
			font-size: 0.55rem;
		}
	}
	
	.legend-squares {
		display: flex;
		gap: 2px;
		
		@media (max-width: 1200px) {
			gap: 1.75px;
		}
		
		@media (max-width: 768px) {
			gap: 1.5px;
		}
		
		@media (max-width: 480px) {
			gap: 1px;
		}
		
		@media (max-width: 360px) {
			gap: 0.75px;
		}
	}
	
	.legend-square {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		
		@media (max-width: 1200px) {
			width: 11px;
			height: 11px;
			border-radius: 1.75px;
		}
		
		@media (max-width: 768px) {
			width: 10px;
			height: 10px;
			border-radius: 1.5px;
		}
		
		@media (max-width: 480px) {
			width: 8px;
			height: 8px;
			border-radius: 1px;
		}
		
		@media (max-width: 360px) {
			width: 7px;
			height: 7px;
			border-radius: 0.75px;
		}
	}
	
	.tooltip {
		position: fixed;
		z-index: 1000;
		pointer-events: none;
	}
	
	.tooltip-content {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.5rem;
		font-size: 0.8rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		
		@media (max-width: 1200px) {
			padding: 0.4rem;
			font-size: 0.75rem;
			border-radius: 5px;
		}
		
		@media (max-width: 768px) {
			padding: 0.375rem;
			font-size: 0.7rem;
			border-radius: 4px;
		}
		
		@media (max-width: 480px) {
			padding: 0.25rem;
			font-size: 0.65rem;
			border-radius: 3px;
		}
		
		@media (max-width: 360px) {
			padding: 0.2rem;
			font-size: 0.6rem;
			border-radius: 2px;
		}
		
		strong {
			color: var(--text);
		}
		
		div {
			color: var(--text-muted);
			margin-top: 0.25rem;
			
			@media (max-width: 480px) {
				margin-top: 0.125rem;
			}
			
			@media (max-width: 360px) {
				margin-top: 0.1rem;
			}
		}
	}
</style>

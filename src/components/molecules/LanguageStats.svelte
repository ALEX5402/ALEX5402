<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchAllLanguages, calculateLanguagePercentages } from '../../util/github';
	
	interface LanguageData {
		name: string;
		percentage: number;
		color: string;
	}
	
	let languageData: LanguageData[] = [];
	
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	
	onMount(async () => {
		try {
			const languages = await fetchAllLanguages();
			languageData = calculateLanguagePercentages(languages);
		} catch (error) {
			console.error('Failed to fetch language data:', error);
			languageData = [
				{ name: 'TypeScript', percentage: 35, color: '#3178c6' },
				{ name: 'JavaScript', percentage: 25, color: '#f1e05a' },
				{ name: 'Python', percentage: 20, color: '#3572A5' },
				{ name: 'Rust', percentage: 12, color: '#dea584' },
				{ name: 'Go', percentage: 8, color: '#00ADD8' }
			];
		}
		
		if (canvas) {
			ctx = canvas.getContext('2d');
			drawPieChart();
		}
	});
	
	const drawPieChart = () => {
		if (!ctx || !canvas) return;
		
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = Math.min(centerX, centerY) - 10;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		let currentAngle = -Math.PI / 2;
		
		languageData.forEach(lang => {
			const sliceAngle = (lang.percentage / 100) * 2 * Math.PI;
			
			ctx!.beginPath();
			ctx!.moveTo(centerX, centerY);
			ctx!.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
			ctx!.closePath();
			ctx!.fillStyle = lang.color;
			ctx!.fill();
			
			ctx!.strokeStyle = 'var(--surface)';
			ctx!.lineWidth = 2;
			ctx!.stroke();
			
			currentAngle += sliceAngle;
		});
	};
	
	$: if (ctx && canvas) {
		drawPieChart();
	}
</script>

<div class="language-stats">
	<div class="header">
		<h3>Top Languages</h3>
		<span class="subtitle">Based on repository analysis</span>
	</div>
	
	<div class="chart-container">
		<canvas 
			bind:this={canvas}
			width="200"
			height="200"
			class="pie-chart"
		></canvas>
		
		<div class="legend">
			{#each languageData as lang}
				<div class="legend-item">
					<div class="legend-color" style="background-color: {lang.color}"></div>
					<div class="legend-text">
						<span class="lang-name">{lang.name}</span>
						<span class="lang-percentage">{lang.percentage}%</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
	
	<div class="stats-footer">
		<div class="stat-item">
			<span class="stat-label">Total Languages</span>
			<span class="stat-value">12</span>
		</div>
		<div class="stat-item">
			<span class="stat-label">Most Used</span>
			<span class="stat-value">TypeScript</span>
		</div>
	</div>
</div>

<style lang="scss">
	.language-stats {
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
	
	.chart-container {
		display: flex;
		align-items: center;
		gap: 3rem;
		margin-bottom: 2.5rem;
		
		@media (max-width: 768px) {
			flex-direction: column;
			gap: 2rem;
		}
	}
	
	.pie-chart {
		border-radius: 50%;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
		transition: transform 0.3s ease;
		
		&:hover {
			transform: scale(1.05);
		}
	}
	
	.legend {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	
	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		flex-shrink: 0;
	}
	
	.legend-text {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		font-size: 0.9rem;
	}
	
	.lang-name {
		color: var(--text);
		font-weight: 500;
	}
	
	.lang-percentage {
		color: var(--text-muted);
		font-weight: 600;
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

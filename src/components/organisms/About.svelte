<script>
	import RichPresence from '../molecules/RichPresence.svelte';
	import Tooltip from '../atoms/Tooltip.svelte';

	// i didnt write this idk
	let getAge = () => {
		let birthDate = new Date('2003/03/12');
		const ageMs = Date.now() - birthDate.getTime();
		const preciseAge = (ageMs / 31536000000).toFixed(10);
		return preciseAge;
	};

	let age = getAge();
	setInterval(() => {
		age = getAge();
	}, 1000);
</script>

<section id="about" class="wrapper about-section">
	<div class="section-header">
		<h2>About Me</h2>
		<p class="section-description">
			Get to know me better and see what I'm currently up to
		</p>
	</div>
	
	<div class="about-content card">
		<div class="discord-section">
			<RichPresence />
		</div>
		<div class="text">
			<div class="bio-content">
				<div class="bio-header">
					<div class="avatar-placeholder">
						<span class="avatar-icon">👨‍💻</span>
					</div>
					<div class="bio-info">
						<h3>Alex (Suman)</h3>
						<p class="bio-subtitle">Android Developer & Open Source Contributor</p>
					</div>
				</div>
				
				<div class="bio-text">
					<p>
						Hey there! I'm Suman, but people know me as Alex on the internet. :) I'm a <Tooltip tip={age}
							><span class="highlight">{Math.floor(Number(age))}</span></Tooltip
						>
						year-old native Android developer from India. I started programming as a hobby, but after
						<span class="highlight">2022</span>, I began taking it seriously. Over time, I've developed a strong passion for
						programming. I enjoy contributing to <Tooltip tip="🤓">
							<a href="https://github.com/alex5402" target="_blank" rel="noreferrer"
								><span class="highlight">open-source</span></a
							></Tooltip
						>
						Android projects, such as <Tooltip tip="KernelSU">
							<a href="https://github.com/tiann/KernelSU" target="_blank" rel="noreferrer"
								><span class="highlight">KernelSU</span></a
							></Tooltip
						>.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	@use '../../styles/mixins.scss' as *;

	.about-section {
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
		margin-bottom: 4rem;
		animation: fadeInUp 1s var(--bezier-two) 0.2s both;
		max-width: 1000px;
		margin-left: auto;
		margin-right: auto;

		@media (max-width: 1400px) {
			max-width: 800px;
		}

		@media (max-width: 868px) {
			text-align: center;
			margin-bottom: 3rem;
			max-width: 100%;
		}
	}

	.section-description {
		font-size: 1.1rem;
		color: var(--text-secondary);
		max-width: 600px;
		margin: 1.5rem auto 0 auto;
		line-height: 1.6;

		@media (max-width: 868px) {
			margin: 1.5rem auto 0 auto;
		}
	}

	.about-content {
		display: grid;
		grid-template-columns: 0.8fr 1.2fr;
		gap: 5rem;
		align-items: start;
		max-width: 1400px;
		margin: 0 auto;

		@media (max-width: 1400px) {
			max-width: 1200px;
			gap: 4rem;
		}

		@media (max-width: 1200px) {
			grid-template-columns: 1fr;
			gap: 3rem;
			max-width: 900px;
		}

		@media (max-width: 768px) {
			gap: 2.5rem;
			max-width: 100%;
		}
	}

	.discord-section {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.text {
		position: relative;
		line-height: 1.75rem;
	}

	.bio-content {
		animation: fadeInUp 1s var(--bezier-two) 0.4s both;
	}

	.bio-header {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2.5rem;
		padding: 2rem;
		background: var(--gradient-surface);
		border: 1px solid var(--border);
		border-radius: 16px;
		box-shadow: var(--shadow-sm);
	}

	.avatar-placeholder {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		background: var(--gradient-primary);
		border: 3px solid var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-lg);
		position: relative;
		
		&::before {
			content: '';
			position: absolute;
			top: -2px;
			left: -2px;
			right: -2px;
			bottom: -2px;
			background: var(--gradient-primary);
			border-radius: 50%;
			z-index: -1;
			opacity: 0.3;
		}
		
		.avatar-icon {
			font-size: 2.8rem;
			filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
		}
	}

	.bio-info h3 {
		margin: 0 0 0.75rem 0;
		font-size: 2rem;
		font-weight: 700;
		background: var(--gradient-text);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1.2;
	}

	.bio-subtitle {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-secondary);
		font-weight: 500;
		opacity: 0.9;
	}

	.bio-text {
		line-height: 1.8;
	}

	.highlight {
		font-weight: 600;
		font-family: var(--font-two);
		font-size: 0.9rem;
		background: var(--gradient-surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--accent);
		padding: 0.3rem 0.6rem;
		width: fit-content;
		display: inline-block;
		transition: all var(--transition-normal);
		
		&:hover {
			transform: translateY(-1px);
			box-shadow: var(--shadow-sm);
		}
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	.text::before {
		@include outlineText(
			$content: 'alex5402',
			$translateX: 97%,
			$translateY: -5%,
			$fontSize: 300px,
			$opacity: 0.22
		);
	}

	@media (max-width: 868px) {
		.about-content {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}

		.discord-section {
			gap: 2rem;
		}

		.bio-header {
			flex-direction: column;
			text-align: center;
			gap: 1.5rem;
			padding: 1.5rem;
		}

		.avatar-placeholder {
			width: 70px;
			height: 70px;
			
			.avatar-icon {
				font-size: 2.2rem;
			}
		}

		.bio-info h3 {
			font-size: 1.6rem;
		}

		.bio-subtitle {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.bio-header {
			padding: 1rem;
			gap: 1rem;
		}

		.avatar-placeholder {
			width: 60px;
			height: 60px;
			
			.avatar-icon {
				font-size: 2rem;
			}
		}

		.bio-info h3 {
			font-size: 1.4rem;
		}
	}
</style>

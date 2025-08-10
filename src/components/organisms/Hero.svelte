<script>
	import HeroImage from '../../components/atoms/HeroImage.svelte';
	import Button from '../atoms/Button.svelte';
	import Socials from '../molecules/Socials.svelte';

	function handleClick() {
		const el = document.querySelector('#aw');
		if (!el) return;
		el.scrollIntoView(true);
	}
</script>

<section id="home" class="wrapper hero-section">
	<div class="hero-content">
		<div class="hero-text">
			<div class="hero-badge">
				<span class="badge-icon">👋</span>
				<span class="badge-text">Welcome to my portfolio</span>
			</div>
			<h1>ALEX</h1>
			<h4>I like to make things simple. <br />I love cats :).</h4>
			<p class="hero-description">
				Android developer passionate about creating elegant mobile solutions and building amazing user experiences. 
				Currently crafting native Android apps and contributing to open-source projects.
			</p>
			<div class="hero-actions">
				<Button side on:click={handleClick} on:keypress={handleClick} class="btn-primary">
					<span>Discover my work</span>
					<span class="arrow">↓</span>
				</Button>
				<div class="socials">
					<Socials />
				</div>
			</div>
		</div>
		<div class="hero-visual">
			<HeroImage />
		</div>
	</div>
	
	<!-- Floating elements for visual interest -->
	<div class="floating-elements">
		<div class="floating-dot dot-1"></div>
		<div class="floating-dot dot-2"></div>
		<div class="floating-dot dot-3"></div>
	</div>
</section>

<style lang="scss">
	@use '../../styles/mixins.scss' as *;

	.hero-section {
		scroll-margin-top: 20rem;
		margin-bottom: 5.75rem;
		margin-top: 7rem;
		position: relative;
		overflow: hidden;

		@media screen and (max-width: 868px) {
			margin-top: 4rem;
		}

		@media screen and (max-width: 768px) {
			margin-bottom: 2.75rem;
		}
	}

	.hero-content {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 5rem;
		align-items: center;
		position: relative;
		z-index: 2;

		@media screen and (max-width: 1200px) {
			grid-template-columns: 1fr 1fr;
			gap: 4rem;
		}

		@media screen and (max-width: 1024px) {
			gap: 3rem;
		}

		@media screen and (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 2.5rem;
			text-align: center;
		}
	}

	.hero-text {
		animation: fadeInUp 1s var(--bezier-two);
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--gradient-surface);
		border: 1px solid var(--border);
		border-radius: 50px;
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-sm);
		animation: fadeInUp 1s var(--bezier-two) 0.2s both;

		.badge-icon {
			font-size: 1.2rem;
		}

		.badge-text {
			font-size: 0.9rem;
			font-weight: 500;
			color: var(--text-secondary);
		}
	}

	.hero-description {
		margin: 1.5rem 0;
		font-size: 1.1rem;
		line-height: 1.7;
		color: var(--text-secondary);
		max-width: 500px;
		animation: fadeInUp 1s var(--bezier-two) 0.4s both;

		@media screen and (max-width: 768px) {
			max-width: none;
		}
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 2.5rem;
		margin-top: 2.5rem;
		animation: fadeInUp 1s var(--bezier-two) 0.6s both;

		@media screen and (max-width: 768px) {
			flex-direction: column;
			gap: 2rem;
		}
	}

	.socials {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.5rem;
		background: var(--gradient-surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		box-shadow: var(--shadow-sm);
	}

	.arrow {
		display: inline-block;
		transition: transform var(--transition-normal);
	}

	.btn-primary:hover .arrow {
		transform: translateY(3px);
	}

	.hero-visual {
		position: relative;
		animation: fadeInUp 1s var(--bezier-two) 0.3s both;

		@media screen and (max-width: 768px) {
			order: -1;
		}
	}

	.floating-elements {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 1;
	}

	.floating-dot {
		position: absolute;
		width: 8px;
		height: 8px;
		background: var(--accent);
		border-radius: 50%;
		opacity: 0.6;
		animation: float 6s ease-in-out infinite;

		&.dot-1 {
			top: 20%;
			left: 10%;
			animation-delay: 0s;
		}

		&.dot-2 {
			top: 60%;
			right: 15%;
			animation-delay: 2s;
		}

		&.dot-3 {
			bottom: 30%;
			left: 20%;
			animation-delay: 4s;
		}
	}

	h1::before {
		@include outlineText($content: '///', $translateX: -95%, $letterSpacing: -0.1em);
	}

	@media screen and (max-width: 1240px) {
		h1 {
			min-height: 0vw;
			font-size: clamp(4rem, 10vw, 6.25rem);
		}

		h4 {
			min-height: 0vw;
			font-size: clamp(1.4rem, 2.4vw, 1.5rem);
		}
	}

	@media screen and (max-width: 400px) {
		h4 br {
			content: '&#160;';
		}
	}
</style>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { discordIntegration, type DiscordPresence } from '../../util/discord';
	import Tooltip from '../atoms/Tooltip.svelte';

	let presence: DiscordPresence | null = null;
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		// Get initial presence
		presence = discordIntegration.getPresence();
		
		// Subscribe to updates
		unsubscribe = discordIntegration.onPresenceUpdate((newPresence) => {
			presence = newPresence;
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	// Helper functions
	function getActivityIcon(activity: any): string {
		const name = activity.name.toLowerCase();
		console.log('Getting activity icon for:', activity.name, 'assets:', activity.assets);
		
		if (name.includes('spotify')) return '🎵';
		if (name.includes('visual studio')) return '💻';
		if (name.includes('chrome')) return '🌐';
		if (name.includes('discord')) return '🎮';
		if (name.includes('game')) return '🎮';
		if (name.includes('youtube')) return '📺';
		if (name.includes('music')) return '🎵';
		if (name.includes('minecraft')) return '⛏️';
		return '⚡';
	}

	function getAssetUrl(applicationId: string, assetId: string, size: number = 128): string {
		console.log('Getting asset URL for:', { applicationId, assetId, size });
		
		// Handle external URLs (like YouTube Music)
		if (assetId.startsWith('mp:external/')) {
			// Extract the actual URL from the external format
			const urlMatch = assetId.match(/mp:external\/[^\/]+\/(.+)/);
			if (urlMatch) {
				const decodedUrl = decodeURIComponent(urlMatch[1]);
				console.log('Extracted external URL:', decodedUrl);
				return decodedUrl;
			}
		}
		
		// Handle standard Discord CDN URLs
		const patterns = [
			`https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.webp?size=${size}`,
			`https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png?size=${size}`,
			`https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.jpg?size=${size}`,
			`https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}?size=${size}`
		];
		console.log('Using Discord CDN URL:', patterns[0]);
		return patterns[0];
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'online': return '#43b581';
			case 'idle': return '#faa61a';
			case 'dnd': return '#f04747';
			case 'offline': return '#747f8d';
			default: return '#747f8d';
		}
	}

	function formatTime(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		
		if (hours > 0) {
			return `${hours}h ${minutes % 60}m`;
		}
		return `${minutes}m ${seconds % 60}s`;
	}
</script>

<div class="rich-presence">
	<div class="header">
		<h3>Discord Status</h3>
		<div class="status-indicator">
			{#if presence}
				<span class="status-dot" style="background-color: {getStatusColor(presence.status)}"></span>
				<span class="status-text">{presence.status.charAt(0).toUpperCase() + presence.status.slice(1)}</span>
			{:else}
				<span class="status-dot offline"></span>
				<span class="status-text">Connecting...</span>
			{/if}
		</div>
	</div>

	{#if presence}
		<div class="presence-content">
			<!-- User Info -->
			<div class="user-section">
				<div class="user-avatar">
					<img 
						src={presence.user.avatar ? `https://cdn.discordapp.com/avatars/${presence.user.id}/${presence.user.avatar}.webp?size=128` : '/default.webp'} 
						alt={presence.user.username}
						class="avatar"
					/>
					<div class="status-ring" style="border-color: {getStatusColor(presence.status)}"></div>
				</div>
				<div class="user-info">
					<h4 class="username">{presence.user.displayName || presence.user.username}</h4>
					<div class="platforms">
						{#each discordIntegration.getPlatformEmojis() as emoji}
							<span class="platform-emoji">{emoji}</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Spotify Section -->
			{#if presence.spotify}
				<div class="spotify-section">
					<div class="spotify-header">
						<span class="spotify-icon">🎵</span>
						<span class="spotify-title">Listening to Spotify</span>
					</div>
					<div class="spotify-content">
						<div class="album-art">
							<img 
								src={presence.spotify.albumArt} 
								alt="Album Art"
								class="album-image"
								on:error={(e) => {
									console.log('Failed to load Spotify album art:', e.target.src);
									e.target.style.display = 'none';
								}}
							/>
							<div class="album-overlay">
								<span class="play-icon">▶️</span>
							</div>
						</div>
						<div class="track-info">
							<h4 class="track-title">{presence.spotify.song}</h4>
							<p class="track-artist">{presence.spotify.artist}</p>
							<p class="track-album">{presence.spotify.album}</p>
							
							<!-- Progress Bar -->
							<div class="progress-container">
								<div class="progress-bar">
									<div 
										class="progress-fill" 
										style="width: {((Date.now() - presence.spotify.timestamps.start) / (presence.spotify.timestamps.end - presence.spotify.timestamps.start)) * 100}%"
									></div>
								</div>
								<div class="time-info">
									<span class="current-time">{formatTime(Date.now() - presence.spotify.timestamps.start)}</span>
									<span class="total-time">{formatTime(presence.spotify.timestamps.end - presence.spotify.timestamps.start)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}



			<!-- Activity Section -->
			{#if presence.activities && presence.activities.length > 0}
				{#each presence.activities as activity}
					<div class="activity-section">
						<div class="activity-header">
							{#if activity.assets?.largeImage}
								{@const imageUrl = getAssetUrl(activity.applicationId, activity.assets.largeImage, 128)}
								<img 
									src={imageUrl}
									alt={activity.name}
									class="activity-image"
									on:error={(e) => {
										console.log('Failed to load activity image:', e.target.src);
										// Try to show a fallback icon instead
										e.target.style.display = 'none';
										const fallback = e.target.nextElementSibling;
										if (fallback) {
											fallback.style.display = 'inline-block';
										}
									}}
									on:load={() => {
										console.log('Successfully loaded activity image:', imageUrl);
									}}
								/>
								<span class="activity-icon fallback" style="display: none;">{getActivityIcon(activity)}</span>
							{:else}
								<span class="activity-icon">{getActivityIcon(activity)}</span>
							{/if}
							<span class="activity-name">{activity.name}</span>
						</div>
						{#if activity.details}
							<p class="activity-details">{activity.details}</p>
						{/if}
						{#if activity.state}
							<p class="activity-state">{activity.state}</p>
						{/if}
						{#if activity.timestamps?.start}
							<div class="activity-time">
								<span class="time-elapsed">
									{formatTime(Date.now() - activity.timestamps.start)} elapsed
								</span>
							</div>
						{/if}
						{#if activity.assets?.smallImage}
							<div class="activity-small-image">
								<img 
									src={getAssetUrl(activity.applicationId, activity.assets.smallImage, 64)}
									alt={activity.assets.smallText || 'Activity'}
									title={activity.assets.smallText || ''}
									on:error={(e) => {
										console.log('Failed to load small activity image:', e.target.src);
										e.target.style.display = 'none';
									}}
								/>
							</div>
						{/if}
						

					</div>
				{/each}
			{/if}

			<!-- No Activity State -->
			{#if !presence.spotify && (!presence.activities || presence.activities.length === 0)}
				<div class="no-activity">
					<span class="no-activity-icon">💭</span>
					<p class="no-activity-text">Just chilling</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Connecting to Discord...</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.rich-presence {
		background: linear-gradient(145deg, var(--surface) 0%, rgba(255, 255, 255, 0.03) 100%);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 4rem;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
		min-width: 100%;
		max-width: 100%;
		min-height: 500px;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 2px;
			background: linear-gradient(90deg, var(--accent), transparent);
		}

		@media (max-width: 1400px) {
			padding: 3.5rem;
			min-height: 450px;
		}

		@media (max-width: 768px) {
			padding: 2.5rem;
			min-height: 350px;
		}
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2.5rem;
		
		h3 {
			margin: 0;
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text);
			background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: #747f8d;
		
		&.offline {
			background-color: #747f8d;
		}
	}

	.status-text {
		font-size: 0.9rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.presence-content {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		height: 100%;
		justify-content: space-between;
	}

	.user-section {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--bg-color) 0%, rgba(255, 255, 255, 0.05) 100%);
		border-radius: 16px;
		border: 1px solid var(--border);
		box-shadow: var(--shadow-sm);
	}

	.user-avatar {
		position: relative;
	}

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid var(--border);
		box-shadow: var(--shadow-md);

		@media (max-width: 1400px) {
			width: 90px;
			height: 90px;
		}

		@media (max-width: 768px) {
			width: 80px;
			height: 80px;
		}
	}

	.status-ring {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 4px solid;
		background: var(--bg-color);
	}

	.user-info {
		flex: 1;
	}

	.username {
		margin: 0 0 0.5rem 0;
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--text);

		@media (max-width: 1400px) {
			font-size: 1.6rem;
		}

		@media (max-width: 768px) {
			font-size: 1.4rem;
		}
	}

	.platforms {
		display: flex;
		gap: 0.5rem;
	}

	.platform-emoji {
		font-size: 1.2rem;
	}

	.spotify-section {
		margin-top: 1rem;
		padding: 2rem;
		background: linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(30, 215, 96, 0.05) 100%);
		border: 1px solid rgba(29, 185, 84, 0.3);
		border-radius: 20px;
		position: relative;
		overflow: hidden;
		box-shadow: var(--shadow-sm);
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 2px;
			background: linear-gradient(90deg, #1db954, #1ed760);
		}
	}

	.spotify-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		
		.spotify-icon {
			font-size: 1.5rem;
			filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
		}
		
		.spotify-title {
			font-size: 1.1rem;
			font-weight: 700;
			color: var(--text);
			background: linear-gradient(135deg, #1db954, #1ed760);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
	}

	.spotify-content {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.album-art {
		position: relative;
		width: 100px;
		height: 100px;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s ease;
		
		&:hover {
			transform: scale(1.05);
		}
		
		.album-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		
		.album-overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.3);
			display: flex;
			align-items: center;
			justify-content: center;
			opacity: 0;
			transition: opacity 0.3s ease;
			
			.play-icon {
				font-size: 2rem;
				filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
			}
		}
		
		&:hover .album-overlay {
			opacity: 1;
		}
	}

	.track-info {
		flex: 1;
	}

	.track-title {
		display: block;
		font-size: 1.3rem;
		font-weight: 800;
		color: var(--text);
		margin-bottom: 0.5rem;
		line-height: 1.2;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.track-artist {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.track-album {
		margin: 0 0 1.5rem 0;
		font-size: 0.9rem;
		color: var(--text-muted);
		opacity: 0.8;
	}

	.progress-container {
		margin-top: 1rem;
	}

	.progress-bar {
		width: 100%;
		height: 6px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background: #1db954;
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.time-info {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.activity-section {
		padding: 1.75rem;
		background: linear-gradient(135deg, var(--bg-color) 0%, rgba(255, 255, 255, 0.05) 100%);
		border-radius: 16px;
		border: 1px solid var(--border);
		box-shadow: var(--shadow-sm);
		margin-bottom: 1rem;
	}

	.activity-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		position: relative;
		
		.activity-icon {
			font-size: 1.6rem;
			width: 48px;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--gradient-surface);
			border: 1px solid var(--border);
			border-radius: 10px;
			box-shadow: var(--shadow-sm);
		}
		
		.activity-image {
			width: 48px;
			height: 48px;
			border-radius: 10px;
			object-fit: cover;
			box-shadow: var(--shadow-sm);
			border: 1px solid var(--border);
		}
		
		.activity-name {
			font-size: 1rem;
			font-weight: 600;
			color: var(--text);
		}
	}

	.activity-details {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: var(--text);
	}

	.activity-state {
		margin: 0 0 1rem 0;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.activity-time {
		.time-elapsed {
			font-size: 0.8rem;
			color: var(--accent);
			font-weight: 500;
		}
	}

	.activity-small-image {
		position: absolute;
		top: 0;
		right: 0;
		
		img {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			border: 2px solid var(--bg-color);
			background: var(--bg-color);
		}
	}

	.no-activity {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		text-align: center;
		
		.no-activity-icon {
			font-size: 3rem;
			opacity: 0.5;
		}
		
		.no-activity-text {
			margin: 0;
			font-size: 1rem;
			color: var(--text-muted);
			font-weight: 500;
		}
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		text-align: center;
		
		.loading-spinner {
			width: 40px;
			height: 40px;
			border: 3px solid var(--border);
			border-top: 3px solid var(--accent);
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}
		
		p {
			margin: 0;
			color: var(--text-muted);
		}
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 768px) {
		.rich-presence {
			padding: 2rem;
		}
		
		.spotify-content {
			flex-direction: column;
			text-align: center;
		}
		
		.user-section {
			flex-direction: column;
			text-align: center;
		}
	}
</style>

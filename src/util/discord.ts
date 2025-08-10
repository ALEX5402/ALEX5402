// Enhanced Discord Integration Utility
export interface DiscordUser {
	username: string;
	id: string;
	displayName?: string;
	avatar?: string;
	status?: string;
	activities?: DiscordActivity[];
	spotify?: SpotifyData;
	lastSeen?: Date;
}

export interface DiscordActivity {
	name: string;
	type: number;
	details?: string;
	state?: string;
	assets?: {
		largeImage?: string;
		smallImage?: string;
		largeText?: string;
		smallText?: string;
	};
	timestamps?: {
		start?: number;
		end?: number;
	};
	applicationId?: string;
}

export interface SpotifyData {
	trackId: string;
	song: string;
	artist: string;
	album: string;
	albumArtUrl: string;
	timestamps: {
		start: number;
		end: number;
	};
	progress: number;
	elapsed: string;
	remaining: string;
}

export interface DiscordPresence {
	user: DiscordUser;
	status: 'online' | 'idle' | 'dnd' | 'offline';
	platforms: {
		desktop: boolean;
		mobile: boolean;
		web: boolean;
	};
	spotify?: SpotifyData;
	activities: DiscordActivity[];
	lastUpdated: Date;
}

class DiscordIntegration {
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 2500;
	private heartbeatInterval: number | null = null;
	private animationFrame: number | null = null;
	private presenceData: DiscordPresence | null = null;
	private listeners: ((presence: DiscordPresence) => void)[] = [];

	constructor(
		public userId: string,
		public username: string,
		private lanyardEndpoint: string = 'wss://api.lanyard.rest/socket'
	) {}

	// Connect to Lanyard WebSocket
	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(this.lanyardEndpoint);
				
				this.ws.onopen = () => {
					console.log('🎮 Connected to Discord Rich Presence!');
					this.reconnectAttempts = 0;
					resolve();
				};

				this.ws.onmessage = (event) => {
					this.handleMessage(JSON.parse(event.data));
				};

				this.ws.onclose = () => {
					console.log('🔌 Discord connection closed, attempting reconnect...');
					this.cleanup();
					this.reconnect();
				};

				this.ws.onerror = (error) => {
					console.error('❌ Discord WebSocket error:', error);
					reject(error);
				};

			} catch (error) {
				console.error('❌ Failed to connect to Discord:', error);
				reject(error);
			}
		});
	}

	// Handle incoming messages from Lanyard
	private handleMessage(data: any) {
		const { op, d } = data;

		switch (op) {
			case 1: // Hello - Set up heartbeat
				this.setupHeartbeat(d.heartbeat_interval);
				this.subscribeToUser();
				break;

			case 0: // Dispatch - Presence update
				this.updatePresence(d);
				break;
		}
	}

	// Set up heartbeat to keep connection alive
	private setupHeartbeat(interval: number) {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
		}

		this.heartbeatInterval = setInterval(() => {
			if (this.ws?.readyState === WebSocket.OPEN) {
				this.ws.send(JSON.stringify({ op: 3 }));
			}
		}, interval);
	}

	// Subscribe to user's presence updates
	private subscribeToUser() {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({
				op: 2,
				d: { subscribe_to_id: this.userId }
			}));
		}
	}

	// Update presence data and notify listeners
	private updatePresence(data: any) {
		const presence: DiscordPresence = {
			user: {
				username: data.discord_user.username,
				id: data.discord_user.id,
				displayName: data.discord_user.display_name,
				avatar: data.discord_user.avatar,
				status: data.discord_status
			},
			status: data.discord_status,
			platforms: {
				desktop: data.active_on_discord_desktop,
				mobile: data.active_on_discord_mobile,
				web: data.active_on_discord_web
			},
			activities: this.processActivities(data.activities || []),
			lastUpdated: new Date()
		};

		// Handle Spotify data
		if (data.listening_to_spotify && data.spotify) {
			presence.spotify = this.processSpotifyData(data.spotify);
		}

		this.presenceData = presence;
		this.notifyListeners(presence);
		this.startProgressAnimation();
	}

	// Process activities to include proper asset URLs
	private processActivities(activities: any[]): DiscordActivity[] {
		console.log('Processing activities:', activities);
		return activities.map(activity => {
			const processed = {
				name: activity.name,
				type: activity.type,
				details: activity.details,
				state: activity.state,
				applicationId: activity.application_id,
				assets: activity.assets ? {
					largeImage: activity.assets.large_image,
					smallImage: activity.assets.small_image,
					largeText: activity.assets.large_text,
					smallText: activity.assets.small_text
				} : undefined,
				timestamps: activity.timestamps ? {
					start: activity.timestamps.start,
					end: activity.timestamps.end
				} : undefined
			};
			console.log('Processed activity:', processed);
			return processed;
		});
	}

	// Process Spotify data with progress calculation
	private processSpotifyData(spotify: any): SpotifyData {
		const now = Date.now();
		const total = spotify.timestamps.end - spotify.timestamps.start;
		const progress = Math.max(0, Math.min(100, 
			((now - spotify.timestamps.start) / total) * 100
		));

		return {
			trackId: spotify.track_id,
			song: spotify.song,
			artist: spotify.artist,
			album: spotify.album,
			albumArtUrl: spotify.album_art_url,
			timestamps: spotify.timestamps,
			progress,
			elapsed: this.formatTime(now - spotify.timestamps.start),
			remaining: this.formatTime(spotify.timestamps.end - now)
		};
	}

	// Format time in MM:SS format
	private formatTime(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// Start progress animation for Spotify/activities
	private startProgressAnimation() {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
		}

		// Only run animation on client side
		if (typeof window !== 'undefined' && window.requestAnimationFrame) {
			const animate = () => {
				if (this.presenceData?.spotify) {
					this.presenceData.spotify = this.processSpotifyData({
						...this.presenceData.spotify,
						timestamps: this.presenceData.spotify.timestamps
					});
					this.notifyListeners(this.presenceData);
				}
				this.animationFrame = requestAnimationFrame(animate);
			};

			this.animationFrame = requestAnimationFrame(animate);
		}
	}

	// Reconnect with exponential backoff
	private reconnect() {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error('❌ Max reconnection attempts reached');
			return;
		}

		this.reconnectAttempts++;
		const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

		setTimeout(() => {
			console.log(`🔄 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
			this.connect().catch(() => this.reconnect());
		}, delay);
	}

	// Clean up resources
	private cleanup() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}

		if (this.animationFrame && typeof window !== 'undefined') {
			cancelAnimationFrame(this.animationFrame);
			this.animationFrame = null;
		}
	}

	// Public methods
	public getPresence(): DiscordPresence | null {
		return this.presenceData;
	}

	public onPresenceUpdate(callback: (presence: DiscordPresence) => void) {
		this.listeners.push(callback);
		return () => {
			this.listeners = this.listeners.filter(listener => listener !== callback);
		};
	}

	private notifyListeners(presence: DiscordPresence) {
		this.listeners.forEach(listener => listener(presence));
	}

	public disconnect() {
		this.cleanup();
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}

	// Utility methods
	public isOnline(): boolean {
		return this.presenceData?.status !== 'offline';
	}

	public isListeningToSpotify(): boolean {
		return !!this.presenceData?.spotify;
	}

	public getCurrentActivity(): DiscordActivity | null {
		return this.presenceData?.activities?.[0] || null;
	}

	public getStatusEmoji(): string {
		const status = this.presenceData?.status;
		switch (status) {
			case 'online': return '🟢';
			case 'idle': return '🟡';
			case 'dnd': return '🔴';
			case 'offline': return '⚫';
			default: return '⚫';
		}
	}

	public getPlatformEmojis(): string[] {
		const platforms = this.presenceData?.platforms;
		const emojis: string[] = [];
		
		if (platforms?.desktop) emojis.push('💻');
		if (platforms?.mobile) emojis.push('📱');
		if (platforms?.web) emojis.push('🌐');
		
		return emojis;
	}
}

// Create and export the Discord integration instance
export const discordIntegration = new DiscordIntegration(
	'803060151082418217',
	'alex5402'
);

// Legacy export for backward compatibility
export const user = {
	username: 'alex5402',
	id: '803060151082418217'
};

// Initialize connection
discordIntegration.connect().catch(console.error);
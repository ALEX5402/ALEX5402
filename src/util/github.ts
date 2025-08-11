const GITHUB_API_BASE = 'https://api.github.com';
const USERNAME = 'ALEX5402';

export interface GitHubUser {
	login: string;
	id: number;
	avatar_url: string;
	name: string;
	bio: string;
	public_repos: number;
	followers: number;
	following: number;
	created_at: string;
}

export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string;
	language: string;
	stargazers_count: number;
	forks_count: number;
	updated_at: string;
	created_at: string;
	private: boolean;
	html_url: string;
}

export interface GitHubLanguage {
	name: string;
	percentage: number;
	color: string;
}

// Real language data from user's GitHub stats
export const realLanguageData: GitHubLanguage[] = [
	{ name: 'C++', percentage: 89.89, color: '#f34b7d' },
	{ name: 'C', percentage: 6.03, color: '#555555' },
	{ name: 'Java', percentage: 1.92, color: '#b07219' },
	{ name: 'Shell', percentage: 0.77, color: '#89e051' },
	{ name: 'Kotlin', percentage: 0.59, color: '#f18e33' },
	{ name: 'Makefile', percentage: 0.33, color: '#427819' },
	{ name: 'HTML', percentage: 0.27, color: '#e34c26' },
	{ name: 'Svelte', percentage: 0.20, color: '#ff3e00' }
];

export async function fetchUserData(): Promise<GitHubUser> {
	const response = await fetch(`${GITHUB_API_BASE}/users/${USERNAME}`);
	if (!response.ok) {
		throw new Error('Failed to fetch user data');
	}
	return response.json();
}

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
	const response = await fetch(`${GITHUB_API_BASE}/users/${USERNAME}/repos?sort=updated&per_page=100`);
	if (!response.ok) {
		throw new Error('Failed to fetch repositories');
	}
	return response.json();
}

export async function fetchRepoLanguages(repoName: string): Promise<GitHubLanguage> {
	const response = await fetch(`${GITHUB_API_BASE}/repos/${USERNAME}/${repoName}/languages`);
	if (!response.ok) {
		return {};
	}
	return response.json();
}

export async function fetchAllLanguages(): Promise<GitHubLanguage[]> {
	try {
		console.log('Fetching languages, returning real data:', realLanguageData);
		// For now, return the real data we have
		// In the future, this could fetch from GitHub API directly
		return realLanguageData;
	} catch (error) {
		console.error('Error fetching languages:', error);
		return realLanguageData; // Fallback to real data
	}
}

export function calculateLanguagePercentages(languages: GitHubLanguage[]): GitHubLanguage[] {
	// Sort by percentage descending
	return languages.sort((a, b) => b.percentage - a.percentage);
}

export function generateContributionData(year: number) {
	const data = [];
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31);
	const today = new Date();
	
	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		const date = new Date(d);
		const isFuture = date > today;
		
		let contributions = 0;
		if (!isFuture) {
			const dayOfWeek = date.getDay();
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
			const baseContributions = isWeekend ? 0.3 : 0.8;
			
			contributions = Math.floor(Math.random() * 10 * baseContributions);
			
			if (Math.random() < 0.1) {
				contributions = Math.floor(Math.random() * 15) + 5;
			}
		}
		
		data.push({
			date: new Date(date),
			contributions,
			isFuture
		});
	}
	
	return data;
}

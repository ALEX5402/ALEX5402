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
	[key: string]: number;
}

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

export async function fetchAllLanguages(): Promise<GitHubLanguage> {
	const repos = await fetchUserRepos();
	const allLanguages: GitHubLanguage = {};
	
	for (const repo of repos) {
		const languages = await fetchRepoLanguages(repo.name);
		for (const [lang, bytes] of Object.entries(languages)) {
			allLanguages[lang] = (allLanguages[lang] || 0) + bytes;
		}
	}
	
	return allLanguages;
}

export function calculateLanguagePercentages(languages: GitHubLanguage) {
	const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
	const percentages: { name: string; percentage: number; color: string }[] = [];
	
	const languageColors: { [key: string]: string } = {
		TypeScript: '#3178c6',
		JavaScript: '#f1e05a',
		Python: '#3572A5',
		Rust: '#dea584',
		Go: '#00ADD8',
		'C++': '#f34b7d',
		Java: '#b07219',
		PHP: '#4F5D95',
		Ruby: '#701516',
		Swift: '#ffac45',
		Kotlin: '#F18E33',
		HTML: '#e34c26',
		CSS: '#563d7c',
		SCSS: '#cf649a',
		Shell: '#89e051',
		'C#': '#178600',
		Vue: '#2c3e50',
		React: '#61dafb',
		Svelte: '#ff3e00'
	};
	
	for (const [lang, bytes] of Object.entries(languages)) {
		const percentage = Math.round((bytes / total) * 100);
		if (percentage > 0) {
			percentages.push({
				name: lang,
				percentage,
				color: languageColors[lang] || '#6a737d'
			});
		}
	}
	
	return percentages.sort((a, b) => b.percentage - a.percentage);
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

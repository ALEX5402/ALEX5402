import { useState, useEffect } from 'react';

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  homepage: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
}

export const useGitHubPinned = (username: string) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }
        const userData = await userResponse.json();

        // Fetch all public repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!reposResponse.ok) {
          throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
        }
        const allRepos = await reposResponse.json();

        // Filter and format repositories
        const formattedRepos: GitHubRepo[] = allRepos
          .filter((repo: any) => !repo.fork) // Exclude forked repositories
          .map((repo: any) => ({
            id: repo.id.toString(),
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || 'No description available',
            htmlUrl: repo.html_url,
            homepage: repo.homepage,
            language: repo.language || 'Other',
            stargazersCount: repo.stargazers_count,
            forksCount: repo.forks_count,
            topics: repo.topics || [],
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            isPinned: false, // We'll determine this based on criteria
          }))
          .sort((a: GitHubRepo, b: GitHubRepo) => {
            // Sort by stars, then by forks, then by updated date
            if (b.stargazersCount !== a.stargazersCount) {
              return b.stargazersCount - a.stargazersCount;
            }
            if (b.forksCount !== a.forksCount) {
              return b.forksCount - a.forksCount;
            }
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });

        // Get top 6 repositories (most popular/active)
        const topRepos = formattedRepos.slice(0, 6).map(repo => ({
          ...repo,
          isPinned: true
        }));

        setUser({
          login: userData.login,
          name: userData.name || userData.login,
          bio: userData.bio || '',
          avatarUrl: userData.avatar_url,
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
        });

        setRepos(topRepos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
        console.error('GitHub API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }
  }, [username]);

  return { repos, user, loading, error };
};

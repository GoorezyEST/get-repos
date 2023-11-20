export interface GitHubRepository {
  name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  description: string | null;
  html_url: string;
  created_at: string;
  stargazers_count: number;
}

class RepositoriesRetrievalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoriesRetrievalError";
  }
}

export async function retrieveUserRepositories(username: string) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    if (!response.ok) {
      throw new RepositoriesRetrievalError(
        `Failed to retrieve repositories for user ${username}`
      );
    }

    const repositories: GitHubRepository[] = await response.json();

    const sortedRepositories = repositories.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    return sortedRepositories;
  } catch (error) {
    if (error instanceof RepositoriesRetrievalError) {
      console.error(`Error retrieving user repositories: ${error.message}`);
      return [];
    } else {
      console.error(`Unexpected error: ${error}`);
      return [];
    }
  }
}

export interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

class ProfileRetrievalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileRetrievalError";
  }
}

export async function retrieveUserProfile(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new ProfileRetrievalError(
        `Failed to retrieve repositories for user ${username}`
      );
    }

    const user: GitHubProfile = await response.json();

    return user;
  } catch (error) {
    if (error instanceof ProfileRetrievalError) {
      console.error(`Error retrieving user repositories: ${error.message}`);
      return null;
    } else {
      console.error(`Unexpected error: ${error}`);
      return null;
    }
  }
}

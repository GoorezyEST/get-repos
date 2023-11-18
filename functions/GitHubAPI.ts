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
    } else {
      console.error(`Unexpected error: ${error}`);
    }
    throw error;
  }
}

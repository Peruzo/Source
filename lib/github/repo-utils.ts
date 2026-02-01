/**
 * Parse GitHub URL to owner/repo.
 * Supports: https://github.com/owner/repo, https://github.com/owner/repo/, https://github.com/owner/repo/tree/branch
 */
export function parseGitHubRepoUrl(url: string): { owner: string; repo: string } | null {
  const trimmed = (url || '').trim();
  const match = trimmed.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\/|$)/i
  );
  if (!match) return null;
  const [, owner, repo] = match;
  if (!owner || !repo || repo === 'tree' || repo === 'blob') return null;
  return { owner, repo };
}

export function toRepoSlug(owner: string, repo: string): string {
  return `${owner}/${repo}`;
}

/**
 * Check if repo is private or inaccessible without auth.
 * Unauthenticated GET to GitHub API; 404/403 or private === true means requires GitHub OAuth.
 */
export async function checkRepoAccess(repoUrl: string): Promise<{
  ok: boolean;
  private: boolean;
  owner?: string;
  repo?: string;
  repoSlug?: string;
}> {
  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) {
    return { ok: false, private: false };
  }
  const { owner, repo } = parsed;
  const repoSlug = toRepoSlug(owner, repo);
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (res.status === 404 || res.status === 403) {
      return { ok: false, private: true, owner, repo, repoSlug };
    }
    if (!res.ok) {
      return { ok: false, private: false, owner, repo, repoSlug };
    }
    const data = (await res.json()) as { private?: boolean };
    return {
      ok: true,
      private: data.private === true,
      owner,
      repo,
      repoSlug,
    };
  } catch {
    return { ok: false, private: false, owner, repo, repoSlug };
  }
}

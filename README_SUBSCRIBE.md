Subscription flow (serverless via GitHub Actions)

1. Deploy a small Cloudflare Worker (or other serverless endpoint) that accepts POST { email }.
2. The Worker should call GitHub's repository_dispatch API for this repository with event_type `collect_email` and a client_payload containing the `email`.
3. Create a GitHub Personal Access Token with `repo` scope and add it as a secret `GITHUB_TOKEN` in the Worker (or use Workers Secrets / KV). The Worker uses that token to call the GitHub API.
4. The repository has a workflow `.github/workflows/collect-emails.yml` that listens for `repository_dispatch` of type `collect_email` and appends the email to `subscribers.json` and commits it.

Notes:
- This approach uses GitHub Actions for storage (committing to the repo). For production use, consider a database or mailing service.
- Keep the token secret and rotate periodically.

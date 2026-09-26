# Your portfolio is live

This folder contains the actual website, all recovered project posters, and the automation that publishes it to GitHub Pages. It has a fast Normal experience and a Fun experience with five looping worlds. Videos load only after a visitor presses Play.

## Your website and editing links

**Website: [lezoofx.github.io/portfolio](https://lezoofx.github.io/portfolio/)**

Your complete project is at **[github.com/LeZoofx/portfolio](https://github.com/LeZoofx/portfolio)**. The source, fonts and all 78 recovered project posters are uploaded. GitHub Pages is enabled and the first live deployment succeeded on 27 September 2026 (India time). There is no remaining setup step.

Committing an edit publishes the website automatically. For a manual rebuild, open **[Publish portfolio](https://github.com/LeZoofx/portfolio/actions/workflows/deploy.yml)**, select **Run workflow**, keep **main**, and press the green **Run workflow** button. Wait for its green check before checking the updated site.

The repository is public so GitHub Pages can host it on the free plan. Other people can view the site and source; they cannot edit your repository unless you grant them access. Keep repository collaborators empty. Publishing, project editing and image recovery also check that the person running them is the repository owner.

The site has no public admin page and no password or publishing token in its browser code. Editing happens inside your authenticated GitHub account.

## Add or update your work

1. Open **[Add or update a project](https://github.com/LeZoofx/portfolio/actions/workflows/update-project.yml)** in your repository.
2. Select **Run workflow**.
3. Enter a title, project URL and category. Add your role, description and AI disclosure where applicable.
4. Select **Feature on the home page** if desired. A new featured project moves to the front; the home page displays four.
5. Leave **project_id** empty to add work. To update an existing project, copy its ID from the end of its website address, such as `social-short-format-03`.
6. Press **Run workflow**. GitHub saves the change, rebuilds the site and publishes it. Wait for a green check under Actions.

When updating a project, enter all the optional text you want to keep: empty optional fields clear the existing text. YouTube posters are fetched automatically. Instagram and Drive additions use a typographic poster until you add an image in `public/media` and set that project's `poster` field in `content/projects.json`.

To update your biography, contact details or disciplines, open `content/site.json` in GitHub, click the pencil, change the text between quotation marks and commit. The site publishes automatically. To remove a project, delete its complete object from `content/projects.json`; use GitHub's Preview changes to check the edit. Ask me to handle this if you prefer.

## Publish a separate copy from your computer (optional)

Your existing repository is already published. The following script is only for creating a separate copy under a new repository name. Install the official **Node.js LTS**, **Git**, and **GitHub CLI** from their respective sites: https://nodejs.org/ · https://git-scm.com/ · https://cli.github.com/ .

Unzip the project. Open a terminal in the `prantik-portfolio` folder and run:

```sh
node scripts/publish.mjs portfolio-copy
```

The script opens GitHub's secure web sign-in when needed, creates a new repository with the supplied name, uploads this folder, enables GitHub Pages and starts publishing. It never replaces an existing repository. No npm installation is needed for this publishing step; GitHub installs build dependencies itself. Run it from a fresh unzipped copy.

If GitHub asks for its one-time Pages setting, open **Settings → Pages → Build and deployment → Source → GitHub Actions**, then **Actions → Publish portfolio → Run workflow**. The deployment output supplies the final website URL.

## Preview on your computer

In that same folder:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. To build the production files, run `npm run build`. The resulting `dist` folder is the static website; opening `index.html` as a local file will not run its JavaScript correctly, so use the preview command or GitHub Pages.

## A few content notes

- The migration preserves 79 project records: 42 original embedded videos and 37 linked image projects. It includes 78 local project posters; one stand-up video has a typographic fallback.
- Original AI disclosures are preserved. The source showreel was under maintenance, so its page directs visitors to existing projects.
- Some source links and videos can require a provider login or can stop working later. Each project keeps an original-source link as a fallback. Two original brand TinyURLs could not be resolved during migration and are preserved as supplied.
- Generic source titles remain where the old site did not supply a specific title. Per-project credits have not been invented. Replace these through the editing workflow when convenient.
- WebGL uses the full 3D renderer. If a browser cannot create WebGL, Fun automatically uses the lightweight zoom view. Reduced-motion settings replace zoom transitions with chapter changes.
- **[Restore missing portfolio images](https://github.com/LeZoofx/portfolio/actions/workflows/recover-media.yml)** can recover missing original posters. It keeps existing files and uses the original public image sources.

## Official references

- GitHub Pages workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- GitHub repository creation: https://cli.github.com/manual/gh_repo_create
- GitHub Pages setup API: https://docs.github.com/en/rest/pages/pages

See `docs/BUILD-NOTES.md` for technical details and verification limits.

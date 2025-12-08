# Installation Guide

This guide covers how to set up and run this Jekyll site locally, and how to use the customized Rain theme for your own project.

## Prerequisites

- **Ruby** 2.7 or higher
- **Bundler** gem
- **Jekyll** 4.0 or higher
- **Git**

### Check Your Environment

```bash
ruby -v        # Should be 2.7+
bundler -v     # Should be installed
jekyll -v      # Should be 4.0+
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kevtruo/kevtruo.github.io.git
cd kevtruo.github.io
```

### 2. Install Dependencies

```bash
bundle install
```

This will install all required gems specified in the `Gemfile`, including Jekyll and its dependencies.

### 3. Run the Development Server

```bash
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`

**Useful flags:**
- `--livereload` - Auto-refresh browser on changes
- `--drafts` - Include posts in `_drafts/` folder
- `--incremental` - Faster rebuilds (experimental)

```bash
bundle exec jekyll serve --livereload --drafts
```

### 4. Build for Production

```bash
bundle exec jekyll build
```

The static site will be generated in the `_site/` directory.

## Site Configuration

### Basic Settings

Edit `_config.yml` to customize:

```yaml
title: Your Site Title
description: Your site description
author: Your Name
url: "https://yourusername.github.io"
baseurl: ""

# Social links
github_username: yourusername
linkedin_username: yourprofile
mastodon:
  username: yourusername
  instance: mastodon.social

# Pagination
paginate: 10
paginate_path: "/page:num/"
```

### Theme Customization

#### Colors

Modify colors in `_sass/rain/_variables.scss`:

**Light mode variables:**
```scss
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --link-color: #007bff;
  // ... more variables
}
```

**Dark mode variables:**
```scss
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --link-color: #4da3ff;
  // ... more variables
}
```

#### Typography

Edit font families and sizes in `_sass/rain/_base.scss`:

```scss
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
```

## Content Management

### Creating Blog Posts

Create a new markdown file in `_posts/` with this naming format:

```
YYYY-MM-DD-title-of-post.md
```

**Example:** `2025-12-07-my-new-post.md`

#### Post Front Matter

```yaml
---
title: Your Post Title
date: 2025-12-07 14:30:00 -0400
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
---

Your post content starts here...
```

**Front matter fields:**
- `title` (required) - Post title
- `date` (required) - Publication date and time with timezone
- `categories` - List of categories (appears in URL)
- `tags` - List of tags for categorization
- `excerpt` (optional) - Custom excerpt text

### Creating Pages

Create markdown files in the root directory:

```markdown
---
layout: page
title: About Me
permalink: /about/
---

Page content here...
```

### Working with Drafts

Create draft posts in `_drafts/` without dates in filenames:

```
_drafts/
└── my-draft-post.md
```

Preview drafts with:
```bash
bundle exec jekyll serve --drafts
```

## Project Structure

```
kevtruo.github.io/
├── _config.yml          # Site configuration
├── Gemfile              # Ruby dependencies
├── Gemfile.lock         # Locked dependency versions
│
├── _includes/           # Reusable HTML components
│   └── head.html        # <head> section with dark mode
│
├── _layouts/            # Page templates
│   ├── default.html     # Base layout
│   ├── home.html        # Homepage layout
│   ├── page.html        # Static page layout
│   └── post.html        # Blog post layout
│
├── _posts/              # Blog posts (YYYY-MM-DD-title.md)
│   ├── 2025-06-12-sans-sec504-gcih-review.md
│   └── 2025-12-07-identity-federations.md
│
├── _sass/               # SCSS stylesheets
│   └── rain/
│       ├── _base.scss
│       ├── _layout.scss
│       ├── _post.scss
│       ├── _variables.scss
│       └── ...
│
├── assets/
│   ├── js/
│   │   └── theme-toggle.js  # Dark mode toggle
│   ├── main.scss            # Main stylesheet (imports _sass)
│   └── favicon files
│
├── images/              # Image assets for posts
│
├── index.html           # Homepage
├── about.md             # About page
├── categories.html      # Category listing page
└── rain.gemspec         # Theme gemspec
```

## Key Features & Customizations

### Dark Mode

This site includes a custom dark mode implementation:

- Toggle button in header
- System preference detection
- localStorage persistence
- CSS custom properties for theming

**Files involved:**
- `assets/js/theme-toggle.js` - Toggle logic
- `_includes/head.html` - Theme initialization
- `_sass/rain/_variables.scss` - Color definitions

### Pagination

Configured in `_config.yml`:

```yaml
paginate: 10
paginate_path: "/page:num/"
```

Older/newer navigation appears at the bottom of the homepage.

### Social Links

Update your social media links in `_config.yml`:

```yaml
github_username: kevtruo
linkedin_username: kevin-truong

mastodon:
  username: kevtruo
  instance: infosec.exchange
```

## Deployment

### GitHub Pages (Automatic)

Push to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Pages will automatically build and deploy your site.

### Custom Domain (Optional)

1. Create a `CNAME` file in the root with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS with your domain provider:
   - Add A records pointing to GitHub Pages IPs
   - Or add CNAME record pointing to `yourusername.github.io`

3. Enable HTTPS in GitHub repository settings

## Troubleshooting

### Dependency Issues

If you encounter gem dependency conflicts:

```bash
bundle update
bundle install
```

### Build Errors

Check for:
- Missing front matter in posts/pages
- Invalid YAML syntax
- Incorrect date formats
- Missing required gems

### Port Already in Use

If port 4000 is occupied:

```bash
bundle exec jekyll serve --port 4001
```

### Clean Build Cache

```bash
bundle exec jekyll clean
bundle exec jekyll build
```

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Rain Theme Repository](https://github.com/inelaah/rain)
- [Liquid Template Language](https://shopify.github.io/liquid/)

## Credits

- Original Rain theme by [Inela Avdic Hukic](https://github.com/inelaah/rain)
- Customizations and dark mode by Kevin Truong

# kevtruo.github.io

Personal website and blog built with Jekyll using the Rain theme.

🌐 **Live Site:** [https://kevtruo.github.io](https://kevtruo.github.io)

## Features

- 🌓 **Dark Mode Toggle** - Full light/dark theme switching with localStorage persistence
- 📱 **Responsive Design** - Mobile-friendly layout
- 📝 **Blog Posts** - Jekyll-powered blog with pagination
- 🔗 **Social Links** - GitHub, Mastodon, LinkedIn integration
- 🎨 **Clean UI** - Minimalist design focused on content
- ⚡ **Fast Loading** - Optimized static site generation

## Tech Stack

- **Framework:** [Jekyll](https://jekyllrb.com/)
- **Theme:** [Rain](https://github.com/inelaah/rain) (customized)
- **Hosting:** GitHub Pages
- **Styling:** SCSS/CSS with CSS custom properties
- **Icons:** [Font Awesome](https://fontawesome.com/)

## Local Development

### Prerequisites

- Ruby (2.7+)
- Bundler
- Jekyll

### Setup

1. Clone the repository:
```bash
git clone https://github.com/kevtruo/kevtruo.github.io.git
cd kevtruo.github.io
```

2. Install dependencies:
```bash
bundle install
```

3. Run the local server:
```bash
bundle exec jekyll serve
```

4. Visit `http://localhost:4000` in your browser

### Build for Production

```bash
bundle exec jekyll build
```

The site will be generated in the `_site` directory.

## Customization

### Site Configuration

Edit `_config.yml` to customize:
- Site title and description
- Author information
- Social media links
- Pagination settings

### Theme Colors

Modify theme colors in `_sass/rain/_variables.scss`:
- Light mode: `:root` variables
- Dark mode: `[data-theme="dark"]` variables

### Adding Blog Posts

Create a new markdown file in `_posts/` with the format:
```
YYYY-MM-DD-title-of-post.md
```

Example front matter:
```yaml
---
title: Your Post Title
date: 2025-01-15 12:00:00 -0400
categories: [Category]
tags: [tag1, tag2]
---

Your content here...
```

## Project Structure

```
kevtruo.github.io/
├── _config.yml          # Site configuration
├── _includes/           # Reusable HTML components
│   └── head.html
├── _layouts/            # Page layouts
│   ├── default.html
│   ├── home.html
│   └── post.html
├── _posts/              # Blog posts
├── _sass/               # SCSS stylesheets
│   └── rain/
├── assets/              # Static assets
│   ├── js/
│   │   └── theme-toggle.js
│   ├── main.scss
│   └── favicon files
└── index.html           # Homepage
```

## Customizations from Original Theme

- ✅ Replaced Twitter with Mastodon integration
- ✅ Added full dark mode support with toggle
- ✅ Updated author information and branding
- ✅ Removed example posts
- ✅ Custom color scheme for both light and dark modes
- ✅ Theme persistence using localStorage
- ✅ System preference detection for default theme

## License

This project uses the Rain theme, which is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Credits

- Original Rain theme by [Inela Avdic Hukic](https://github.com/inelaah/rain)
- Built with [Jekyll](https://jekyllrb.com/)
- Hosted on [GitHub Pages](https://pages.github.com/)

## Contact

- **GitHub:** [@kevtruo](https://github.com/kevtruo)
- **Mastodon:** [@kevtruo_@infosec.exchange](https://infosec.exchange/@kevtruo_)
- **Email:** [165167213+kevtruo@users.noreply.github.com](mailto:165167213+kevtruo@users.noreply.github.com)

---

Built with ❤️ using Jekyll and the Rain theme.

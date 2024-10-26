# Contributing to CF-TopHacker

Thank you for your interest in contributing to CF-TopHacker! This guide will help you set up the development environment and understand the contribution process.

## Getting Started

### Prerequisites
- Git installed on your machine
- Google Chrome browser
- A GitHub account

### Fork and Clone
1. Fork the repository by clicking the 'Fork' button at [CF-TopHacker](https://github.com/rahulharpal1603/CF-TopHacker)
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR-USERNAME/CF-TopHacker.git
cd CF-TopHacker
```

3. Add the upstream repository as a remote:
```bash
git remote add upstream https://github.com/rahulharpal1603/CF-TopHacker.git
```

### Creating a Branch
1. Ensure you're on the main branch:
```bash
git checkout main
```

2. Create and switch to a new branch:
```bash
git checkout -b feature/your-feature-name
```
Use descriptive branch names like `feature/add-sorting` or `fix/popup-layout`.

## Development

### Loading the Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked"
4. Select the `src` directory from the cloned repository folder.

### Testing Changes
1. After modifying code:
   - Click the refresh icon (🔄) next to the extension in `chrome://extensions/`


2. Testing Guidelines:
   - Test on a Codeforces contest page
   - Ensure popup renders properly
   - Check the Chrome DevTools console for any errors

### Code Style Guidelines
- Follow JavaScript best practices
- Keep code modular and reusable
- Comment complex logic
- Use meaningful variable names related to Codeforces terminology

## Submitting Changes

1. Commit your changes:
```bash
git add .
git commit -m "Description of changes"
```

2. Push to your fork:
```bash
git push origin feature/your-feature-name
```

3. Create a Pull Request:
   - Go to [CF-TopHacker](https://github.com/rahulharpal1603/CF-TopHacker)
   - Click "New Pull Request"
   - Choose your fork and branch
   - Include in your PR:
     - Description of changes
     - Screenshots of the extension in action
     - Any related Codeforces features/pages affected
     - Testing performed

## Pull Request Review Process
1. Maintainers will review your PR
2. Make any requested changes
3. Once approved, your PR will be merged

## Keeping Your Fork Updated
Regularly sync your fork with the upstream repository:
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Troubleshooting
If you encounter issues:
1. Verify the extension is loaded correctly in `chrome://extensions/`
2. Check the Console in Chrome DevTools for errors
3. Ensure you're testing on Codeforces pages
4. Try clearing Chrome's cache and reloading the extension

## Feature Suggestions
Before working on new features:
1. Open an issue to discuss the feature
2. Include use cases and benefits for Codeforces users
3. Wait for maintainer approval before starting work

## Questions or Problems?
- Open an issue in the repository
- Provide:
  - Description of the problem
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
  - Chrome version and OS

Thank you for contributing to CF-TopHacker!

# ![report](https://icongr.am/octicons/comment-discussion.svg?size=22&color=abb4bf)   Playwright Report Summary

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)

A GitHub action to report Playwright test results as a pull request comment.

- Parse the JSON test report generated by Playwright
- Generate a markdown summary of the test results
- Post the summary as a pull request comment
- Uses GitHub's official [icons](https://primer.style/design/foundations/icons) and [color scheme](https://primer.style/design/foundations/color)

## Examples

<img src="assets/comment-passed.png" width="701">

<img src="assets/comment-failed.png" width="701">

## Usage

### Basic usage

Playwright must be configured to [generate a JSON report](https://playwright.dev/docs/test-reporters#json-reporter)
and write it to disk. This action receives the report file path as input, in this case `results.json`:

```yaml
jobs:
  test:
    name: Run playwright tests
    needs: install
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - run: PLAYWRIGHT_JSON_OUTPUT_NAME=results.json npx playwright test --reporter json

      - uses: daun/playwright-report-summary@v3
        with:
          report-file: results.json
```

### With all options

```yaml
- uses: daun/playwright-report-summary@v3
  with:
    # The GitHub access token to use for API requests. Defaults to the standard GITHUB_TOKEN.
    github-token: ''

    # Path to the JSON report file generated by Playwright. Required.
    report-file: 'result.json'

    # URL to a published html report, uploaded by another action in a previous step.
    # Example pipeline: https://playwright.dev/docs/test-sharding#publishing-report-on-the-web
    report-url: 'https://user.github.io/repo/yyyy-mm-dd-id/'

    # A unique tag to represent this report when reporting on multiple test runs
    # Defaults to the current workflow name
    report-tag: ''

    # Title/headline to use for the created pull request comment.
    # Default: Playwright test results
    comment-title: 'Results'

    # Create a job summary comment for the workflow run
    # Default: false
    job-summary: true

    # Icon style to use: octicons | emojis
    # Default: octicons
    icon-style: 'emojis'
```

## Output

The action creates two output variables:

### summary

The rendered markdown summary of the test report.

### comment-id

The ID of the comment that was created or updated

# License

[MIT](./LICENSE)

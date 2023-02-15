// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Higher-Order Typescript',
  tagline:
    'A lodash-like library for types with support for type-level lambda functions.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://hotscript.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'gvergnaud', // Usually your GitHub org/user name.
  projectName: 'HOTScript', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/gvergnaud/HOTScript/tree/main/docusaurus/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light', // I recommend dark mode
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'HOTScript',
        logo: {
          alt: 'HOTScript Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: 'docs/category/api',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://github.com/gvergnaud/HOTScript',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Resources',
            items: [
              {
                label: 'API',
                to: '/docs/category/api',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/gvergnaud/HOTScript',
              },
              {
                label: 'Discord',
                // todo(adamsuskin): get discord server link
                href: 'https://github.com/gvergnaud/HOTScript',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/GabrielVergnaud',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()}. Created by Gabriel Vergnaud. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config

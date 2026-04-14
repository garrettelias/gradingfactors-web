// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
					},
				},
			],
			title: 'Grading Factors',
			description: 'Canadian grain grading data, machine-readable at last.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/garrettelias/gradingfactors-web' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Overview', slug: 'getting-started/overview' },
						{ label: 'Authentication', slug: 'getting-started/authentication' },
						{ label: 'Quickstart', slug: 'getting-started/quickstart' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'GET /grains', slug: 'api-reference/grains' },
						{ label: 'GET /grains/{grain_id}', slug: 'api-reference/grains-grain-id' },
						{ label: 'GET /changelog', slug: 'api-reference/changelog' },
					],
				},
				{
					label: 'Data Model',
					items: [
						{ label: 'Field Reference', slug: 'data-model/field-reference' },
						{ label: 'Update Model', slug: 'data-model/update-model' },
					],
				},
				{
					label: 'About',
					items: [
						{ label: 'About this project', slug: 'about/about-this-project' },
					],
				},
			],
			components: {
				SocialIcons: './src/components/NavLinks.astro',
			},
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
		}),
	],
});
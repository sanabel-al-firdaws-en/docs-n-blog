import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import type { ManifestOptions } from "vite-plugin-pwa";
import manifest from "./webmanifest.json";
import AstroPWA from "@vite-pwa/astro";
import starlightBlog from 'starlight-blog'
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import mdx from '@astrojs/mdx'; 
import starlightViewModes from 'starlight-view-modes';

import remarkCustomHeaderId from "remark-custom-header-id";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkMark } from "remark-mark-highlight";
import AutoImport from 'astro-auto-import';

import compress from "astro-compress";
import { readdirSync } from 'node:fs';

// Get a list of all the components in a specific directory:
const componentDir = './src/components/global/';
const components = readdirSync(componentDir);


// https://astro.build/config
export default defineConfig({
	site: "https://sanabel-al-firdaws.github.io",
	markdown: {
				gfm: false,
				rehypePlugins: [[rehypeAutolinkHeadings, {
				  // Wrap the heading text in a link.
				  behavior: "wrap",
				  properties: {
					className: ["section_heading"]
				  }
				}]],
				remarkPlugins: [remarkCustomHeaderId, remarkMark]
			  },
			
	integrations: [
		AutoImport({
			imports: [
			  // Add paths to each component to the auto-import array:
			  ...components.map(filename => componentDir + filename),
			],
		  }),
		starlight({
	
			plugins: [
				starlightViewModes({
					zenModeCloseButtonPosition: 'top-left'
				  }), 
				starlightBlog({
					postCount: 10,
					authors: {
					  hakkem: {
						name: "عبدالحكيم الشنقيطي",
						title: "طالب علم",
						picture: "/maskable-icon-512x512.png",
						// Images in the `public` directory are supported.
						url: "https://github.com/sanabel-al-firdaws"
					  }
					}
				}),
				starlightUtils({ multiSidebar: {
				switcherStyle: "horizontalList"
			  }}),
			],
			title: 'موقعي',
			description: "وصف الموقع",
			credits: true,
			lastUpdated: true,
			editLink: {
				baseUrl: "https://github.com/sanabel-al-firdaws/sanabel-al-firdaws.github.io/edit/main/"
			  },
			  social: {
				youtube: "https://www.youtube.com/@سنابل-الفردوس",
				telegram: "https://t.me/abdullhakim_alshanqiti",
				github: "https://github.com/sanabel-al-firdaws/sanabel-al-firdaws.github.io/"
			  },
			defaultLocale: "ar",
			locales: {
			  root: {
				label: "العربية",
				lang: "ar",
				dir: "rtl"
			  }
			},
			tableOfContents: {
				minHeadingLevel: 1,
				maxHeadingLevel: 6
			  },
			customCss: ["./src/styles/custom.css", "./src/fonts/font-face.css"],
			sidebar: [{
				label: "القائمة", 
				collapsed: true,
				items: [{
				  label: "القسم 1",
				  collapsed: true,
				  autogenerate: {
					directory: "dir1"
				  }
				}, 
				 {
					label: "القسم 2",
					collapsed: true,
				  autogenerate: {
					directory: "dir2"
				  }
				},
			]
			  }, {
				label: "المدونة",
				collapsed: true,
				items: [{
				  label: "كل المقالات",
				  link: "/blog"
				}, {
				  label: "أحدث المقالات",
				  collapsed: true,
				  autogenerate: {
					directory: "blog"
				  }
				}, {
				  label: "الأقسام",
				  collapsed: true,
				  items: [{
					label: "القسم الأول",
					link: "blog/tags/القسم-الأول"
				  }]
				}]
			  }],
			components: {
				Head: './src/components/Head.astro',
				Search: './src/components/Search.astro',
				ThemeProvider: "./src/components/starlight/ThemeProvider.astro",
				EditLink: './src/components/starlight/EditLink.astro',
				ThemeSelect: "./src/components/blog-override/ThemeSelect.astro",
				SocialIcons: "./src/components/starlight/SocialIcons.astro",
				Pagination: "./src/components/starlight/Pagination.astro",
				Sidebar: "./src/components/starlight/Sidebar.astro",
				LastUpdated: "./src/components/starlight/LastUpdated.astro",
				SiteTitle: "./src/components/starlight/SiteTitle.astro",
				// TableOfContents: "./src/components/starlight/TableOfContents.astro"
			}
		}),
		AstroPWA({
			workbox: {
				skipWaiting: true,
				clientsClaim: true,
				navigateFallback: "/404",
				ignoreURLParametersMatching: [/./],
				globPatterns: ["**/*.{html,js,css,png,svg,json,woff2,woff,pf_fragment,pf_index,pf_meta,pagefind,wasm}"]
			  },
			  experimental: {
				directoryAndTrailingSlashHandler: true
			  },
			  mode: "production",
			  registerType: "autoUpdate",
			  manifest: manifest as Partial<ManifestOptions>
			}),

		mdx(),compress()
	],
});

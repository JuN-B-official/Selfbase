export const siteConfig = {
  name: 'Selfbase Design System',
  url: 'https://selfbase.com/design-system',
  ogImage: 'https://selfbase.com/design-system/og.jpg',
  description: 'Design System of Selfbase',
  links: {
    twitter: 'https://twitter.com/selfbase',
    github: 'https://github.com/selfbase/selfbase/tree/master/apps/design-system',
    credits: {
      radix: 'https://www.radix-ui.com/themes/docs/overview/getting-started',
      shadcn: 'https://ui.shadcn.com/',
      geist: 'https://vercel.com/geist/introduction',
    },
  },
}

export type SiteConfig = typeof siteConfig

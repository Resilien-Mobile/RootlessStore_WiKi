import { defineConfig } from 'vitepress'

const base = '/RootlessStore_WiKi/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Rootless Store",
  description: "Rootless Store Wiki",
  base,
  head: [
    ['link', { rel: 'icon', type: 'image/webp', href: `${base}logo.webp` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}logo.webp` }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.webp',
    editLink: {
      pattern: 'https://github.com/Resilien-Mobile/RootlessStore_WiKi/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    socialLinks: [
      { icon: 'telegram', link: 'https://t.me/+3yjgOb4EpE5jNjFl', ariaLabel: 'Telegram' },
      { icon: 'qq', link: 'https://qun.qq.com/universal-share/share?ac=1&authKey=ZubO%2FbgKK8WWLB4933YkaBSKlUGFmx6JeZqWVanHIXJe0pi0ktWmCWWSXiQyhtta&busi_data=eyJncm91cENvZGUiOiIxMDkzOTkwMzE4IiwidG9rZW4iOiJVSzdKYURkclpQcGhUdXRNYkVURkc2dEFicHpjQXBOLytldy9qOHZndzhrSURhUEVyRWdpbWNKOFhoL2hpTTRuIiwidWluIjoiMTMwMjA2NDM5NiJ9&data=q1ZKNAEimSszcWAAYKUpb9GHdgrbg6SfwQv5PlSSDF4wfuNZmTAAOMME92lp1oWop2kilhL2Ta3-CAUzjPgIhw&svctype=4&tempid=h5_group_info', ariaLabel: 'QQ' },
      { icon: 'github', link: 'https://github.com/Resilien-Mobile/RootlessStore', ariaLabel: 'GitHub' }
    ],
    nav: [
      { text: '首页', link: '/' },
      { text: '心智模型', link: '/articles/why-rootless' },
      { text: '插件开发', link: '/plugin-development/' },
      { text: '使用指引', link: '/user-guide/how-to-use-rootless-store' },
      { text: '安全模型', link: '/signature/index' },
    ],

    sidebar: [
      {
        text: 'Rootless 心智模型',
        items: [
          { text: '引出 Rootless 的思考', link: '/articles/why-rootless' },
          { text: 'Rootless 的生态模型', link: '/articles/ecosystem-cluster' },
          { text: 'Sources 与当前想法', link: '/articles/sources-and-ideas' },
          { text: '项目局限性与预期完成时间', link: '/articles/limitations-and-timeline' }
        ]
      },
      {
        text: 'Rootless 安全模型',
        items: [
          { text: '引出 “安全” 的思考', link: '/signature/index' },
        ]
      },
      {
        text: '插件开发细节',
        items: [
          { text: '关于插件开发的细节', link: '/plugin-development/' },
          { text: 'Plugin：运行时插件', link: '/plugin-development/client-runtime-plugin' },
          { text: 'Environment：运行时环境包', link: '/plugin-development/environment-runtime-package' },
          { text: 'Server：Market 与 Source 接口', link: '/plugin-development/server-sources-backend' }
        ]
      },
      {
        text: 'Code Brick拓展 (New)',
        items: [
          { text: '什么是 CodeBrick', link: '/code-brick/' },
          { text: 'CodeBrick 的玩法大全', link: '/code-brick/playing-method' },
          { text: 'CodeBrick Gallery', link: '/code-brick/brick-gallery' },
        ]
      },
      {
        text: '使用指引',
        items: [
          { text: '如何正确使用 Rootless Store', link: '/user-guide/how-to-use-rootless-store' }
        ]
      }
    ]
  }
})

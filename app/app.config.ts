export default defineAppConfig({
  ui: {
    colors: {
      primary: "indigo",
      neutral: "slate"
    },
    main: {
      base: "min-h-0 size-full"
    },
    footer: {
      slots: {
        root: "outline-1 outline-default h-(--ui-footer-height) box-border",
        left: "text-sm text-muted"
      }
    },
    pageHero: {
      slots: {
        container: "py-0 sm:py-0 lg:py-0 h-(--ui-main-height)"
      }
    }
  },
  seo: {
    siteName: "Cyclo-Score"
  },
  header: {
    title: "Cyclo-Score",
    to: "/",
    logo: {
      alt: "",
      light: "",
      dark: ""
    },
    search: true,
    colorMode: true,
    links: []
  },
  footer: {
    credits: `Licence MIT 🄯 ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      "icon": "i-simple-icons-bento",
      "to": "https://bento.me/altis",
      "target": "_blank",
      "aria-label": "Site web d'origine"
    }, {
      "icon": "i-lucide-globe",
      "to": "https://altisplay.fr/cyclo-score/",
      "target": "_blank",
      "aria-label": "Site web d'origine"
    }, {
      "icon": "i-simple-icons-github",
      "to": "https://alexisdechiara/cyclo-score",
      "target": "_blank",
      "aria-label": "Code source sur GitHub"
    }]
  },
  toc: {
    title: "Table des matières",
    bottom: {
      title: "Participer",
      edit: "https://github.com/alexisdechiara/cyclo-score/edit/main/content"
    }
  }
})

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
        root: "border-t border-default",
        left: "text-sm text-muted"
      }
    },
    pageHero: {
      slots: {
        container: "py-0 sm:py-0 lg:py-0 h-[calc(100vh-8rem)]"
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
    links: [{
      "icon": "i-simple-icons-github",
      "to": "https://alexisdechiara/cyclo-score",
      "target": "_blank",
      "aria-label": "GitHub"
    }]
  },
  footer: {
    credits: `Réalisé par Alexis De Chiara • © ${new Date().getFullYear()}`,
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
      edit: "https://github.com/nuxt-ui-templates/docs/edit/main/content"
    }
  }
})

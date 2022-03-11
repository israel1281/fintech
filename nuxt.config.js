export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Welcome to ' + process.env.APP_NAME,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { href: '/plugins/simplebar/css/simplebar.css', rel: 'stylesheet' },
      { href: '/plugins/perfect-scrollbar/css/perfect-scrollbar.css', rel: 'stylesheet' },
      { href: '/plugins/metismenu/css/metisMenu.min.css', rel: 'stylesheet' },
      { href: '/css/bootstrap.min.css', rel: 'stylesheet' },
      { href: '/css/app.css', rel: 'stylesheet' },
      { href: '/css/icons.css', rel: 'stylesheet' }
    ],
    script: [
      { src: '/js/bootstrap.bundle.min.js', body: true },
      { src: '/js/jquery.min.js', body: true },
      { src: '/plugins/simplebar/js/simplebar.min.js', body: true },
      { src: '/plugins/metismenu/js/metisMenu.min.js', body: true },
      { src: '/plugins/perfect-scrollbar/js/perfect-scrollbar.js', body: true }
    ],
    metaInfo: {
      title: 'Welcome to ' + process.env.APP_NAME,
      titleTemplate: '%s - ' + process.env.APP_NAME
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/global.css',
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/element-ui.js',
    { src: '~/plugins/v-animate-css.js', mode: 'client' },
    '~/plugins/axios.js',
    '~/plugins/api.js',
    '~/plugins/lodash.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/google-fonts',
    '@nuxtjs/date-fns'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  loading: {
    color: 'blue',
    height: '2px'
  },

  googleFonts: {
    families: {
      'Noto+Sans': true
    },
    display: 'swap'
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    credentials: true
  },

  publicRuntimeConfig: {
    axios: {
      baseUrl: process.env.API_URL,
      common: {
        Accept: 'application/json'
      }
    },
    apiUrl: process.env.API_URL,
    appUrl: process.env.APP_URL,
    appName: process.env.APP_NAME,
    currency: process.env.CURRENCY,
    aesKey: process.env.BANK_AES_KEY,
    ivKey: process.env.BANK_IV_KEY,
    fwEncryptKey: process.env.FW_ENCRYPTION_KEY
  },

  privateRuntimeConfig: {
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      home: '/dashboard'
    },
    localStorage: false,
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: process.env.API_URL || 'http://127.0.0.1:8000',
        user: {
          property: 'data',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/api/me', method: 'get' }
        }
      }
    },
    cookie: {
      options: {
        secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production'
      }
    }
  }
}

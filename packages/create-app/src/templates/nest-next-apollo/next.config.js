module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    emotion: true,
  },
  experimental: {
    modularizeImports: {
      'date-fns': {
        transform: 'date-fns/{{member}}',
      },
      'lodash': {
        transform: 'lodash/{{member}}',
      },
    },
  },
};

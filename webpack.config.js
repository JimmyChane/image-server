const path = require('node:path');

module.exports = function (options, webpack) {
  const isDev = process.env.APP_ENV_MODE === 'dev';

  return {
    ...options,
    devtool: isDev ? 'source-map' : false,

    output: {
      ...options.output, // Preserve existing output options like 'path', 'filename', etc.
      devtoolModuleFilenameTemplate: (info) => {
        const normalizedPath = path.normalize(info.absoluteResourcePath).replace(/\\/g, '/');

        const projectRoot = path.resolve(__dirname);
        const relativePath = path.relative(projectRoot, normalizedPath);

        return `file:///${normalizedPath}`;
      },
    },
  };
};

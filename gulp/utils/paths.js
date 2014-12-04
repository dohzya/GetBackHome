module.exports = {
  styles: {
    dir: './styles',
    build: './build/styles/**/*.css',
    dest: './build/styles'
  },
  scripts: {
    dir: './scripts',
    build: './build/scripts/**/*.js',
    dest: './build/scripts'
  },
  bower: {
    dir: './bower_components'
  },
  coffee: {
    all: './scripts/**/*.coffee'
  },
  browserify: {
    app: './scripts/app.js'
  },
  less: {
    all: './styles/**/*.less',
    app: './styles/app.less'
  },
  images: {
    all: ['./images/**/*', '!./images/icons/**/*.svg']
  },
  build: {
    dir: './build'
  },
  deploy: {
    dir: './deploy'
  }
};

const gulp = require('gulp')
const ghPages = require('gulp-gh-pages')

function deploy() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages())
}

gulp.task('deploy', deploy)

const gulp = require('gulp'),
    babel = require('gulp-babel'),
    gulpSequence = require('gulp-sequence');

gulp.task('es', () =>
    gulp.src(['./src/**','!./src/pm2-apps/**'])
    .pipe(babel({
        plugins: ['transform-runtime']
    }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('package', gulpSequence('es'));
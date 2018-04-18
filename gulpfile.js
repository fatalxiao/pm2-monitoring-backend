const gulp = require('gulp'),
    babel = require('gulp-babel'),
    gulpSequence = require('gulp-sequence');

gulp.task('es', () =>
    gulp.src(['./src/**'])
    .pipe(babel({
        plugins: ['transform-runtime']
    }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('package', gulpSequence('es'));
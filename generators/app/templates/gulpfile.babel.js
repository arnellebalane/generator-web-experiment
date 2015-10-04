import gulp from 'gulp';
import plumber from 'gulp-plumber';
import jade from 'gulp-jade';
import stylus from 'gulp-stylus';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';


gulp.task('templates', () => {
    return gulp.src('src/**/*.jade', { base: 'src' })
        .pipe(jade({ pretty: '    ' }))
        .pipe(gulp.dest('build'));
});


gulp.task('stylesheets', () => {
    return gulp.src('src/**/*.styl', { base: 'src' })
        .pipe(stylus())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(gulp.dest('build'));
});


gulp.task('javascripts', () => {
    return gulp.src('src/**/*.js', { base: 'src' })
        .pipe(babel())
        .pipe(gulp.dest('build'));
});


gulp.task('watch', () => {
    gulp.watch('src/**/*.jade', ['templates']);
    gulp.watch('src/**/*.styl', ['stylesheets']);
    gulp.watch('src/**/*.js', ['javascripts']);
});


gulp.task('default', ['templates', 'stylesheets', 'javascripts', 'watch']);

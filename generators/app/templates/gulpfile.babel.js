import gulp from 'gulp';
import plumber from 'gulp-plumber';
<% if (markup === 'jade') { -%>
import jade from 'gulp-jade';
<% } -%>
<% if (styles === 'less') { -%>
import less from 'gulp-less';
<% } else if (styles === 'sass') { -%>
import sass from 'gulp-sass';
<% } else if (styles === 'stylus') { -%>
import stylus from 'gulp-stylus';
<% } -%>
import autoprefixer from 'gulp-autoprefixer';
<% if (es6) { -%>
import babel from 'gulp-babel';
<% } -%>
import browserSync from 'browser-sync';


gulp.task('templates', () => {
    return gulp.src('src/**/*.<%= markup %>', { base: 'src' })
<% if (markup === 'jade') { -%>
        .pipe(plumber())
        .pipe(jade({ pretty: '    ' }))
<% } -%>
        .pipe(gulp.dest('dist'));
});


gulp.task('stylesheets', () => {
<% if (styles === 'less') { -%>
    return gulp.src('src/**/*.less', { base: 'src' })
<% } else if (styles === 'sass') { -%>
    return gulp.src(['src/**/*.sass', 'src/**/*.scss'], { base: 'src' })
<% } else if (styles === 'stylus') { -%>
    return gulp.src('src/**/*.styl', { base: 'src' })
<% } else { -%>
    return gulp.src('src/**/*.css', { base: 'src' })
<% } -%>
<% if (styles !== 'css') { -%>
        .pipe(plumber())
<% if (styles === 'less') { -%>
        .pipe(less())
<% } else if (styles === 'sass') { -%>
        .pipe(sass().on('error', sass.logError))
<% } else if (styles === 'stylus') { -%>
        .pipe(stylus())
<% } -%>
<% } -%>
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(gulp.dest('dist'));
});


gulp.task('javascripts', () => {
    return gulp.src('src/**/*.js', { base: 'src' })
<% if (es6) { -%>
        .pipe(plumber())
        .pipe(babel())
<% } -%>
        .pipe(gulp.dest('dist'));
});


gulp.task('copy', () => {
    return gulp.src(['src/static/images/**/*', 'src/static/fonts/**/*'],
        { base: 'src' })
        .pipe(gulp.dest('dist'));
});


gulp.task('serve', ['build', 'watch'], () => {
    browserSync.init({
        server: { baseDir: './dist/' }
    });
});


gulp.task('templates-watch', ['templates'], browserSync.reload);
gulp.task('stylesheets-watch', ['stylesheets'], browserSync.reload);
gulp.task('javascripts-watch', ['javascripts'], browserSync.reload);
gulp.task('build', ['templates', 'stylesheets', 'javascripts', 'copy']);


gulp.task('watch', () => {
    gulp.watch('src/**/*.<%= markup %>', ['templates-watch']);
<% if (styles === 'less') { -%>
    gulp.watch('src/**/*.less', ['stylesheets-watch']);
<% } else if (styles === 'sass') { -%>
    gulp.watch('src/**/*.sass', ['stylesheets-watch']);
<% } else if (styles === 'stylus') { -%>
    gulp.watch('src/**/*.styl', ['stylesheets-watch']);
<% } else { -%>
    gulp.watch('src/**/*.css', ['stylesheets-watch']);
<% } -%>
    gulp.watch('src/**/*.js', ['javascripts-watch']);
});


gulp.task('default', ['build', 'watch']);

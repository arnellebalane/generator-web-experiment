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


gulp.task('templates', () => {
    var source = 'src/**/*.<%= markup %>';
    return gulp.src(source, { base: 'src' })
<% if (markup === 'jade') { -%>
        .pipe(plumber())
        .pipe(jade({ pretty: '    ' }))
<% } -%>
        .pipe(gulp.dest('dist'));
});


gulp.task('stylesheets', () => {
<% if (styles === 'less') { -%>
    var source = 'src/**/*.less';
    var compiler = less();
<% } else if (styles === 'sass') { -%>
    var source = ['src/**/*.sass', 'src/**/*.scss'];
    var compiler = sass({ outputStyle: 'expanded' })
        .on('error', sass.logError);
<% } else if (styles === 'stylus') { -%>
    var source = 'src/**/*.styl';
    var compiler = stylus();
<% } else { -%>
    var source = 'src/**/*.css';
<% } -%>
    return gulp.src(source, { base: 'src' })
<% if (styles !== 'css') { -%>
        .pipe(plumber())
        .pipe(compiler)
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


gulp.task('build', ['templates', 'stylesheets', 'javascripts', 'copy']);


gulp.task('watch', () => {
    gulp.watch('src/**/*.jade', ['templates']);
    gulp.watch('src/**/*.styl', ['stylesheets']);
    gulp.watch('src/**/*.js', ['javascripts']);
});


gulp.task('default', ['build', 'watch']);

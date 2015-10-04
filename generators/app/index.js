var generators = require('yeoman-generator');


module.exports = generators.Base.extend({
    prompting: function() {
        var done = this.async();
        var questions = [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of this web experiment?',
                validate: function(input) {
                    return input.trim()
                        ? true
                        : 'Please provide a name for this web experiment';
                }
            }
        ];
        this.prompt(questions, function(answers) {
            this.answers = answers;
            done();
        }.bind(this));
    },

    writing: function() {
        var directories = [
            'src/static/stylesheets',
            'src/static/javascripts',
            'src/static/images',
            'src/static/fonts'
        ];
        directories.forEach(function(directory) {
            this.mkdir(directory);
        }.bind(this));

        var files = [
            '.gitignore',
            'gulpfile.babel.js',
            'src/index.jade',
            'src/static/stylesheets/application.styl',
            'src/static/javascripts/application.js'
        ];
        files.forEach(function(file) {
            var template = this.templatePath(file + '.template');
            var target = this.destinationPath(file.replace(/\.template$/, ''));
            this.template(template, target);
        }.bind(this));
    },

    install: function() {
        var npmDependencies = [
            'gulp',
            'gulp-plumber',
            'gulp-jade',
            'gulp-stylus',
            'gulp-autoprefixer',
            'babel',
            'babel-core',
            'gulp-babel'
        ];
        this.npmInstall(npmDependencies, { saveDev: true });

        var bowerDependencies = [
            'jquery',
            'requirejs',
            'mustache'
        ];
        this.bowerInstall(bowerDependencies, { save: true });
    }
});

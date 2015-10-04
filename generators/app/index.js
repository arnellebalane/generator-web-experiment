var generators = require('yeoman-generator');
var _ = require('lodash');


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
                },
                filter: function(input) {
                    return _.kebabCase(input);
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'Please provide description for this web experiment:'
            },
            {
                type: 'input',
                name: 'username',
                message: 'What is your name (to be used in project files)?',
                store: true
            },
            {
                type: 'input',
                name: 'email',
                message: 'What is your email (to be used in project files)?',
                store: true
            }
        ];
        this.prompt(questions, function(answers) {
            this.answers = answers;
            done();
        }.bind(this));
    },

    writing: function() {
        var files = [
            'gulpfile.babel.js',
            'src/index.jade',
            'license',
            'package.json',
            { src: 'gitignore', dest: '.gitignore' },
            {
                src: 'src/static/stylesheets/application.styl',
                dest: 'src/static/stylesheets/' + this.answers.name + '.styl'
            },
            {
                src: 'src/static/javascripts/application.js',
                dest: 'src/static/javascripts/' + this.answers.name + '.js'
            }
        ];

        this.answers.currentYear = (new Date()).getFullYear();
        files.forEach(function(file) {
            var template = this.templatePath(typeof file === 'string'
                ? file : file.src);
            var target = this.destinationPath(typeof file === 'string'
                ? file : file.dest);
            this.fs.copyTpl(template, target, this.answers);
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

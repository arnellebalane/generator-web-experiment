var generators = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');


module.exports = generators.Base.extend({
    prompting: function() {
        var done = this.async();
        var questions = [
            {
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
                name: 'description',
                message: 'Please provide description for this web experiment:'
            },
            {
                type: 'list',
                name: 'markup',
                message: 'What do you want to use for your markup?',
                choices: ['html', 'jade'],
                default: 'html'
            },
            {
                type: 'list',
                name: 'styles',
                message: 'What do you want to use for your styles?',
                choices: ['css', 'less', 'sass', 'stylus'],
                default: 'css'
            },
            {
                name: 'es6',
                message: 'Will you be using ES6 features (Y/n)?',
                default: 'Y'
            },
            {
                name: 'username',
                message: 'What is your name (to be used in project files)?',
                store: true
            },
            {
                name: 'email',
                message: 'What is your email (to be used in project files)?',
                store: true
            }
        ];
        this.prompt(questions, function(answers) {
            answers.es6 = answers.es6 === 'Y';
            this.answers = answers;
            done();
        }.bind(this));
    },

    configuring: function() {
        var configFiles = ['gitignore', 'jshintrc', 'jscsrc'];
        configFiles.forEach(function(file) {
            var template = this.templatePath(file);
            var target = this.destinationPath('.' + file);
            this.fs.copyTpl(template, target, this.answers);
        }.bind(this));
    },

    writing: function() {
        var styleExtension = this.answers.styles;
        if (this.answers.styles === 'stylus') {
            styleExtension = 'styl';
        }

        var files = [
            'gulpfile.babel.js',
            'src/index.jade',
            'license',
            'package.json',
            {
                src: 'src/static/stylesheets/application.' + styleExtension,
                dest: 'src/static/stylesheets/' + this.answers.name + '.'
                    + styleExtension
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
            'gulp-autoprefixer',
            'babel',
            'babel-core',
            'browser-sync'
        ];
        if (this.answers.markup === 'jade') {
            npmDependencies.push('gulp-jade');
        }
        if (this.answers.styles !== 'css') {
            npmDependencies.push('gulp-' + this.answers.styles);
        }
        if (this.answers.es6) {
            npmDependencies.push('gulp-babel');
        }
        this.npmInstall(npmDependencies, { saveDev: true });

        var bowerDependencies = [
            'jquery',
            'requirejs',
            'mustache'
        ];
        this.bowerInstall(bowerDependencies, { save: true });
    },

    end: function() {
        var instructions = [''];
        if (this.answers.styles !== 'css') {
            instructions.push('To compile your ' + this.answers.styles
                + ' files to CSS, run ' + chalk.yellow.bold('gulp build'));
        }
        if (this.answers.es6) {
            instructions.push('To compile your ES6 code to ES5, run '
                + chalk.yellow.bold('gulp build'));
        }
        instructions.push('To watch for changes in your files, run '
            + chalk.yellow.bold('gulp'));
        instructions.push('To serve your web experiment, run '
            + chalk.yellow.bold('gulp serve'));
        this.log(instructions.join('\n'));
    }
});

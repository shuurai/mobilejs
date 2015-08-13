module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            build: {
                cwd: '',
                src: ['index.html', 'robots.txt', 'humans.txt', 'img/**/*', 'vendor/**/*'],
                dest: 'build',
                expand: true
            },
            ejs: {
                cwd: '',
                src: ['ejs/**/**/*'],
                dest: 'build',
                expand: true
            },
            css: {
                cwd: '',
                src: ['css/**/*.min.css', 'css/fonts/**/*'],
                dest: 'build',
                expand: true
            },
            js: {
                cwd: '',
                src: ['js/app_packaged.min.js', 'js/*.min.js', 'js/**/*.min.js'],
                dest: 'build',
                expand: true
            }
        },

        clean: {
            build: {
                src: ['build']
            },
            post: {
                src: ['js/*.min.js', 'js/**/*.min.js', 'css/**/*.min.css']
            }
        },
        
        cssmin: {
            fonts:{
                src: 'css/foundation-icons.css',
                dest: 'css/foundation-icons.min.css'
            }
        },
        
        sass: {
            options: {
                includePaths: ['vendor/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'css/app.min.css': 'scss/app.scss'
                }
            }
        },

        concat: {
            basic: {
                src: ['tpl/header.tpl', 'tpl/common/*.tpl', 'tpl/app.tpl', 'tpl/footer.tpl'],
                dest: 'index.html'
            }
        },

        uglify: {
            js: {
                options: {
                    mangle: false,
                    compress: false
                },
                files: {
                    // String files if it exists, always prepend
                    'js/app_packaged.min.js': ['js/config.js', 'js/app.js'], // Include all files to concatenate
                    'js/common.min.js': ['js/common_str.en.js', 'js/common.js'],
                    
                    // Features are loaded dynamically
                    'js/features/home.min.js': ['js/features/home_str.en.js', 'js/features/home.js'],
                    'js/features/fish.min.js': ['js/features/fish_str.en.js','js/features/fish.js']
                    
                    // Common components are all merged into one file `components.min.js`
                    'js/components/components.min.js': [
                        'js/components/auto_address.js', 
                        'js/components/auto_address_x.js', 
                        'js/components/date_picker.js',
                        'js/components/page_slider.js',
                        'js/components/popup_str.en.js', 
                        'js/components/popup.js',
                        'js/components/splash_error.js']
                }
            }
        },

        watch: {
            js: {
                files: ['!js/*.min.js', 'js/*.js', 'js/**/*.js', '!js/**/*.min.js'], // Watch all files to watch for
                tasks: ['uglify:js', 'copy:js', 'clean:post']
            },
            fonts: {
                files: ['css/foundation-icons.css'],
                tasks: ['cssmin', 'copy:css', 'clean:post']
            },
            index: {
                files: ['tpl/*.tpl', 'tpl/common/*.tpl'],
                tasks: ['concat']
            },
            ejs: {
                files: ['ejs/**/**/*'],
                tasks: ['copy:ejs']
            },
            others: {
                files: ['index.html', 'kitchen.html'],
                tasks: ['copy:build']
            },
            grunt: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['sass:dist', 'copy:css', 'clean:post']
            }
        },

        connect: {
            server: {
                options: {
                    port: 1777,
                    base: 'build',
                    hostname: '*'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    //grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['clean:build', 'concat', 'sass:dist', 'cssmin', 'uglify:js', 'copy', 'clean:post']);
    grunt.registerTask('default', ['build', 'connect', 'watch']);
}
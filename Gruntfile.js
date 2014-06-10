module.exports = function (grunt) {

    var baseSrc = 'js/src';

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    grunt.initConfig({
        uglify: {
            options: {
                separator: ';'
            },
            compile: {
                src: [
                    baseSrc + '/klass.js',
                    baseSrc + '/Actor/PointActor.js',
                    baseSrc + '/**/*.js'
                ],
                dest: 'dist/physics-pong.js'
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'css/src',
                src: ['*.css', '!*.min.css'],
                dest: 'css',
                ext: '.min.css'
            },
            combine: {
                files: {
                    'dist/physics-pong.css': ['css/*.min.css']
                }
            }
        },
        watch: {
            scripts: {
                files: 'js/src/**/*.js',
                tasks: ['scripts:dist']
            },
            styles: {
                files: 'css/src/**/*.css',
                tasks: ['styles:dist']
            }
        }
    });

    grunt.registerTask('default', ['dist']);
    grunt.registerTask('dist', ['scripts:dist', 'styles:dist']);

    grunt.registerTask('scripts:dist', ['uglify:compile']);
    grunt.registerTask('styles:dist', ['cssmin:minify', 'cssmin:combine']);
};
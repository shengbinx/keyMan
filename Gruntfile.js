module.exports = function (grunt) {
    var project = grunt.file.readJSON('package.json'),
        publish_tasks = ['concat', 'uglify', 'cssmin'],
        concatList = [
            'src/js/lib/jquery/jquery-1.11.3.min.js',
            'src/js/lib/jquery/jquery.cookie.js',
            'src/js/lib/angular/angular.min.js',
            'src/js/lib/angular/w5cValidator.min.js',
            'src/js/lib/uuid/uuid.core.js',
            'src/js/lib/tablecloth/tablecloth.js',
            'src/js/lib/ng-grid/ui-grid-unstable.min.js',
            'src/js/constant/constant.js',
            'src/js/filter/filter.js',
            'src/js/factory/factory.js',
            'src/js/service/service.js',
            'src/js/controller/controller.js',
            'src/js/directive/directive.js',
            'src/js/app.js'
        ];
    // 项目配置
    function initConfig(){
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                options: {
                    separator: ';'
                },
                dist: {
                    src: concatList,
                    dest: project.path.dist + project.current.version + '/js/keyman.min.js'
                }
            },
            uglify: {
                build: {
                    src: project.path.dist + project.current.version + '/js/keyman.min.js',
                    dest: project.path.dist + project.current.version + '/js/keyman.min.js'
                }
            },
            cssmin: {
                compress: {
                    files: {
                        "<%=pkg.path.dist%><%=pkg.current.version%>/css/keyman.min.css": [
                            project.path.css + "*.css"
                        ]
                    }
                }
            }
        });
    }
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    initConfig();

    // 默认任务
    grunt.registerTask('publish', function (){
        project.current.version = "publish";
        grunt.task.run(publish_tasks);
    });
};
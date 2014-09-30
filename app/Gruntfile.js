'use-strict';

module.exports = function( grunt ) {

require('time-grunt')(grunt);

  grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  		
  		// Caminhos padrões
		paths: {
            build: {
                dev: 'dev',
                deploy: 'deploy'
            },
            views:  'src/views',
            sass:   'src/scss',
            js:    'src/js',
            statics: 'src/statics'
        },
        
        // Uglify
		uglify: {
			options: {mangle: false},
			dev: {
				files: {'<%= paths.build.dev %>/assets/js/javascript.js':['<%= paths.js %>/main.js']}
			},
			deploy: {
				files: {'<%= paths.build.deploy %>/assets/js/javascript.js':['<%= paths.js %>/main.js']}
			}			
		},
	
		// CSSMin
		cssmin: {
			dev: {
				files:[
					{src: '<%= paths.build.dev %>/assets/css/style.css', dest: '<%= paths.build.dev %>/assets/css/style.css'}
				]
			},
			deploy: {
				files:[
					{src: '<%= paths.build.dev %>/assets/css/style.css', dest: '<%= paths.build.dev %>/assets/css/style.css'}
				]
			}
		},
		
		//Uncss
		uncss: {
		    options: {
		    	htmlroot: 'build',
		    	report: 'gzip'
		    },
			dev: {
				files:[
					{src: '<%= paths.build.dev %>/index.html', dest: '<%= paths.build.dev %>/assets/css/style.css'}
				]
			},
			deploy: {
				files:[
					{src: '<%= paths.build.dev %>/index.html', dest: '<%= paths.build.dev %>/assets/css/style.css'}
				]
			}
		},
		
		//SASS	
		sass: {	
			dev: {
				files: {'<%= paths.build.dev %>/assets/css/style.css':'<%= paths.sass %>/main.scss'}
			},
			deploy: {
				files: {'<%= paths.build.deploy %>/assets/css/style.css':'<%= paths.sass %>/main.scss'}
			}
		},

		//HTMLMin
		htmlmin: {
			options: {
				removeCommentsFromCDATA: true,
				removeComments: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true,
				removeEmptyElements: false
			},
			dev: {
				files: [{expand: true,cwd: 'src/views/',src: '**/*.html',dest: '<%= paths.build.dev %>/'}]
			},
			deploy: {
				files: [{expand: true,cwd: 'src/views/',src: '**/*.html',dest: '<%= paths.build.deploy %>/'}]
			}
		},	
		
		//Watch
		watch: {
	      dev: {
	        files: ['<%= paths.js %>/**/*','<%= paths.sass %>/**/*'],
	        tasks: ['sass:dev']
	      },
	      deploy: {
	        files: ['<%= paths.js %>/**/*','<%= paths.sass %>/**/*'],
	        tasks: ['sass:prod']
	      }
	    },
	    
	    //Clean
		clean: {
		  dev: {
		    src: ['<%= paths.build.dev %>/**/*']
		  },		
		  deploy: {
		    src: ['<%= paths.build.deploy %>/**/*']
		  }
		},
		
		//Pageres
	    pageres: {
	        dev: {
	            options: {
	                url: 'www.terra.com.br',
	                sizes: ['1280x1000','1024x1000','800x1000','600x1000','480x1000','320x1000'],
	                crop: true,
	                dest: 'test/dev/screenshot'
	            }
	        },
	        deploy: {
	            options: {
	                url: 'www.globo.com.br',
	                sizes: ['1280x1000','1024x1000','800x1000','600x1000','480x1000','320x1000'],
	                crop: true,
	                dest: 'test/deploy/screenshot'
	            }
	        }
	    },
    
		//Imagemin
	    imagemin: {
			options: {
			    optimizationLevel: 7,
			    progressive: true
			},
	        dev: {
	            files: [{expand: true,cwd:'<%= paths.build.dev %>/assets/img',src: '**/*.{png,jpg,gif}',dest: '<%= paths.build.dev %>/assets/img'}]
	        },
	        deploy: {
	            files: [{expand: true,cwd:'<%= paths.build.deploy %>/assets/img',src: '**/*.{png,jpg,gif}',dest: '<%= paths.build.deploy %>/assets/img'}]
	        }
	    },  
	  
		//Browser Sync
		browserSync: {
            env: {
                bsFiles: {
                    src : '<%= paths.build.dev %>/assets/css/*.css'
                },
                options: {
                    watchTask: true,
                    proxy: "padrao.dev",
                    server: {
								baseDir: "<%= paths.build.dev %>"
					}
                }
            }
        },
		
		//Copy files
		copy: {
			dev: {
				expand: true,
				dot: true,
				cwd: '<%= paths.statics %>',
				src: '**',
				dest: '<%= paths.build.dev %>'
			},
			deploy: {
				expand: true,
				dot: true,
				cwd: '<%= paths.statics %>',
				src: '**',
				dest: '<%= paths.build.deploy %>'
			},
		},
  });

  // Plugins do Grunt
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-pageres');
  grunt.loadNpmTasks('grunt-uncss');
  


  //Tarefas para produção
  grunt.registerTask('compile:prod',['sass:prod']);	// Compila os arquivos .scss
  grunt.registerTask('minify:prod',['htmlmin:prod', 'uncss:prod', 'uglify:prod', 'cssmin:prod', 'imagemin:prod']);	// Minifica o html, css, js e optimiza as imagens.
  grunt.registerTask('build:prod',['clean:prod', 'copy:prod', 'compile:prod', 'minify:prod']);	// Executa as tarefas de minificar, limpar o diretório e compilar.

  //Tarefas para desenv.
  grunt.registerTask('compile:dev',['sass:dev']);	// Compila os arquivos .scss
  grunt.registerTask('minify:dev',['htmlmin:dev', 'uncss:dev', 'uglify:dev', 'cssmin:dev', 'imagemin:dev']);	// Minifica o html, css, js e optimiza as imagens.
  grunt.registerTask('build:dev',['clean:dev', 'copy:dev', 'compile:dev', 'minify:dev']);	// Executa as tarefas de minificar, limpar o diretório e compilar. 
  grunt.registerTask('validate:dev',['jshint:dev', 'validation:dev']);	// Valida arquivos js e html.
  grunt.registerTask('print:dev',['pageres:dev']);	// Tira print das páginas nas principais resoluções mobile.
  grunt.registerTask('live:dev', ["browserSync:dev", "watch:dev"]);	// Sincroniza browser com diferentes dispositivos.
  grunt.registerTask('validate:dev',['jshint:dev', 'validation:dev']);	// Valida arquivos js e html.
};
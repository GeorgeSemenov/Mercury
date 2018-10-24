var gulp = require('gulp'),
    less = require('gulp-less'),
    haml = require('gulp-haml'),
    browserSync = require('browser-sync'),//Для обновления браузера при изменении
    concat = require('gulp-concat'),//Для объединения файлов js.
    uglify = require('gulp-uglifyjs'),//Для сжатия кода.
    cssnano = require('gulp-cssnano'),//Для минификации css
    rename = require('gulp-rename'),//Для переименовывания файлов.
    del = require('del'),//Для удаления неугодных файлов.
    imagemin = require('gulp-imagemin'),//Для работы с изображениями жырными
    pngquant = require('imagemin-pngquant'),//Для работы с png
    giflossy = require('imagemin-giflossy'),
    mozjpeg = require('imagemin-mozjpeg'),
    responsive = require('gulp-responsive-images'),
    cache = require('gulp-cache'),//Для кэширования изображений.
    autoprefixer = require('gulp-autoprefixer');//Эта штуковина будет добавлять автоматически вендорные приставки к свойствам css, вроде -webkit-flex, -moz-flex и т.п.

gulp.task('default',['watcher']);

gulp.task('lessTask',function(){
    return gulp.src(['app/less/**/*.less','!app/less/_*.less'])
        .pipe(less({}))
        .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'],{cascade:true}))//Создаём префиксы
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('hamlTask',function(){
    return gulp.src('app/*.haml')
        .pipe(haml())
        .pipe(gulp.dest('app/'))
})

gulp.task('brsyTask', function(){
   browserSync({
       server:{
           baseDir: 'app'
       },
       notify:false
   }) ;
});

gulp.task('buildScripts', function(){
    return gulp.src([//Указываем объединяемые файлы
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/popper/dist/popper.min.js'
    ])
    .pipe(concat('libs.min.js'))//Объединяемые файлы будут собранны в
    .pipe(uglify())//Сжимаем файлик libs.min.js
    .pipe(gulp.dest('app/js'));//Выкладываем получившийся файлик в app/js
});

gulp.task('buildCSS',['lessTask'],function(){
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(concat('libs.min.css'))
    .pipe(cssnano())
    //.pipe(rename({suffix:'.min'}))//Добавляем суффикс .min
    .pipe(gulp.dest('app/css'));
});

gulp.task('watcher',['brsyTask','lessTask','buildScripts','buildCSS'],function(){//Я убрал lessTask из списка первоначального исполнеиня т.к. из-за его первоначального срабатывания возникали проблемы.
    gulp.watch('app/less/**/*.less',['lessTask']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/*.haml',['hamlTask']);
    console.log("Wathcer is watch on you.");
});

gulp.task('imgWatcher', function(){//ещё один watcher чтобы обрабатывать адаптивные изображения, без него не получается.
    var watchaga = gulp.watch('app/img/**/*', ['convertImg']);
    setTimeout(watchaga.end,30*1000);//Смотрящий выключится через 30 секунд и не будет наблюдать.
})

//Чтобы обработать изображения - запусти buildImg
gulp.task('buildImg', function() {
    gulp.src('app/img/**/*')
    .pipe(responsive({
        '**/*.*': [{
            width: 2240,
            suffix: '-2240',
            quality: 70
        }, {
            width: 1920,
            suffix: '-1920',
            quality: 70
        }, {
            width: 1600,
            suffix: '-1600',
            quality: 70
        }, {
            width: 1280,
            suffix: '-1280',
            quality: 70
        }, {
            width: 1280,
            height: 300,
            crop: true,
            gravity: 'Center',
            suffix: '-thumbwide',
            quality: 70
        }, {
            width: 960,
            suffix: '-960',
            quality: 70
        }, {
            width: 640,
            suffix: '-640',
            quality: 70
        }, {
            width: 480,
            suffix: '-480',
            quality: 70
        }, {
            width: 320,
            suffix: '-320',
            quality: 70
        }]
    }))
    .pipe(gulp.dest(function(file) {
        var str = file.base.replace("app/img/originalImg","app/img/")
        return str;
    }));
});

gulp.task('convertImg', function() {
    return gulp.src(['app/img/**/*'])
        .pipe(cache(imagemin([
            //png
            pngquant({
                speed: 1,
                quality: 72 //Этот параметр нужен для того, чтобы увеличивить сжимаемость png файлов, особой потери качества я не заметил.
            }),
            giflossy({
                optimizationLevel: 3,
                optimize: 3, //keep-empty: Preserve empty transparent frames
                lossy: 2
            }),
            //svg
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),
            //jpg lossless
            imagemin.jpegtran({
                progressive: true
            }),
//            jpg very light lossy, use vs jpegtran
            mozjpeg({
                quality: 85//Этот параметр нужен для того, чтобы увеличивить сжимаемость jpg файлов, особой потери качества я не заметил.
            })
        ])))
//        .pipe(rename({suffix:'-converted'})) //Учти, что суффикс будет добавляться и подпапкамы
        .pipe(gulp.dest(function(file){
            console.log('file = ' + file.name);
            return file.base;
    }))
});

gulp.task('clearCache', function(){
          return cache.clearAll();
          })

gulp.task('clean',function(){
    return del.sync('dist');//Удаляем все файлы в папке dist
})

gulp.task('build',['clean','lessTask','buildScripts','hamlTask'],function(){
    var distCSS = gulp.src([ //Назначая переменным действия мы одновременно их выплоняем.
        'app/css/style.css',
        'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'))
    
    var distFonts = gulp.src([
        'app/fonts/**/*'
    ])
    .pipe(gulp.dest('dist/fonts'))
    
    var distJS = gulp.src([
        'app/js/**/*'
    ])
    .pipe(gulp.dest('dist/js'))
 
    var distImg = gulp.src(['app/img/**/*'])
    .pipe(gulp.dest('dist/img'))
       
    var distHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

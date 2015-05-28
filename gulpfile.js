/*
创建Gulp配置文件
 */

//引入 gulp
var gulp = require('gulp');

//引入功能组件

var compass = require('gulp-compass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var jshint = require('gulp-jshint');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
// 图像处理

// var imagemin = require('gulp-imagemin'); //十分大
//var pngquant = require('imagemin-pngquant');
// var spritesmith = require('gulp.spritesmith');
// var imageResize = require('gulp-image-resize');


// 错误处理
var plumber = require("gulp-plumber");
var stylish = require("jshint-stylish");

// 设置相关路径
var paths = {
    assets: 'public/assets',
    sass: 'dev/css/sass/**/*',
    css: 'dev/css',
    js: 'dev/js/**/*', //js文件相关目录
    img: 'dev/img/**/*', //图片相关
};

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

// 图片精灵处理
gulp.task('sprite', function() {
    var spriteData = gulp.src('dev/img/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite@2x.png',
        cssName: '_sprite.scss',
        algorithm: 'alt-diagonal'
    }));
    spriteData.img.pipe(gulp.dest('dev/img/')); // 输出合成图片
    spriteData.css.pipe(gulp.dest('dev/css/sass/')); // 输出的CSS
    // spriteData.pipe(gulp.dest('path/to/output/'));
});


// Sass 处理
gulp.task('sass', function() {
    gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(gulp.dest(paths.css))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.css))
        .pipe(minifycss())
        .pipe(sourcemaps.write({
            sourceRoot: 'dev/css/sass'
        }))
        .pipe(rename('dev.min.css'))
        .pipe(gulp.dest('public/assets/css'));

    gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(paths.css))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.css))
        .pipe(minifycss())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('public/assets/css'));

});




// JS检查
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    gulp.src(paths.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('public/assets/js'))
        .pipe(rename('dev.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets/js'));

});



// 处理图像
gulp.task('image', function() {
    return gulp.src(paths.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/assets/images'));
});



gulp.task('watch', function() {
    gulp.watch(paths.js, ['scripts']);
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['watch', 'scripts']);
gulp.task('watch:base', ['watch']);

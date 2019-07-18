/************************************************
 * Image Carousel
 ***********************************************/
angular.module('myApp', ['ngAnimate']).
//イメージスライドサービス
service('ImageSlideService', function() {
    var ImageSlideService = {};

    ImageSlideService.currentIndex = 0;         //現在のインデックス
    ImageSlideService.totalImageCount = 0;      //イメージの総数
    ImageSlideService.imageArea = {};           //イメージ表示エリア
    ImageSlideService.imageList = {};           //イメージリスト
    ImageSlideService.imageSizeObject = {};     //イメージサイズオブジェクト
    ImageSlideService.moveDirection = 'left';   //スライドサイン変数

    /**
     * 初回イメージ数、イメージリストを格納
     *
     * @param imageList
     */
    ImageSlideService.init = function(imageList) {
        ImageSlideService.setTotalImageCount(imageList.length);
        ImageSlideService.setImageList(imageList);
    };

    /**
     * イメージリストを変数に格納
     *
     * @param imageList
     */
    ImageSlideService.setImageList = function(imageList) {
        ImageSlideService.imageList = imageList;
    };

    /**
     * イメージ総数を変数に格納
     *
     * @param totalImageCount
     */
    ImageSlideService.setTotalImageCount = function (totalImageCount) {
        ImageSlideService.totalImageCount = totalImageCount;
    };

    /**
     * イメージ表示エリアを変数に格納
     *
     * @param imageArea
     */
    ImageSlideService.setImageArea = function (imageArea) {
        ImageSlideService.imageArea = imageArea;
    };

    /**
     * イメージサイズオブジェクトを変数に格納
     *
     * @param imageSizeObject
     */
    ImageSlideService.setImageSizeObject = function (imageSizeObject) {
        ImageSlideService.imageSizeObject = imageSizeObject;
    };

    /**
     * イメージリストを返却
     *
     * @returns {*}
     */
    ImageSlideService.getImageList = function() {
        return ImageSlideService.imageList;
    };

    /**
     * 現在のインデックスを返却
     *
     * @returns {number}
     */
    ImageSlideService.getCurrentIndex = function() {
        return ImageSlideService.currentIndex;
    };

    /**
     * イメージサイズオブジェクトを返却
     *
     * @returns {*}
     */
    ImageSlideService.getImageSizeObject = function () {
        return ImageSlideService.imageSizeObject;
    };

    /**
     * スライドサイン変数を返却
     *
     * @returns {string}
     */
    ImageSlideService.getMoveDirection = function () {
        return ImageSlideService.moveDirection;
    };

    /**
     * 左へスライド
     */
    ImageSlideService.slideLeft = function() {
        //イメージ総数が1つであれば、処理停止
        if(ImageSlideService.totalImageCount <= 1) return;

        ImageSlideService.currentIndex++;
        ImageSlideService.moveDirection = 'left';

        if ((ImageSlideService.totalImageCount - 1) < ImageSlideService.currentIndex) {
            ImageSlideService.currentIndex = 0;
        }
    };

    /**
     * 右へスライド
     */
    ImageSlideService.slideRight = function() {
        //イメージ総数が1つであれば、処理停止
        if(ImageSlideService.totalImageCount <= 1) return;

        ImageSlideService.currentIndex--;
        ImageSlideService.moveDirection = 'right';

        if (ImageSlideService.currentIndex < 0) {
            ImageSlideService.currentIndex = ImageSlideService.totalImageCount - 1
        }
    };

    return ImageSlideService;
}).
//イメージスライダー機能追加
directive('imageSlider', function(ImageSlideService, $interval) {
    return {
        restrict: 'E',
        replace: true,
        template:
            '<div class="viewArea">'
            + '<div class="slideWrapper marginCentering">'
            + '<ul class="imageArea">'
            + '<li ng-repeat="img in imageList" ng-show="$index == currentIndex" ng-class="{active: $index == currentIndex}" class="slide-animation" item-index="{{$index}}"><a><img ng-src="{{img.src}}"></a></li>'
            + '</ul>'
            + '</div>'
            + '<div ng-click="movePrev()" class="leftArrow arrowButton"></div>'
            + '<div ng-click="moveNext()" class="rightArrow arrowButton"></div>'
            + '<ul class="navigationPoint">'
            + '<li ng-repeat="point in imageList" ng-class="{activePoint: currentIndex == $index}">'
            + '</ul>'
            + '</div>',
        scope: false,
        controller: function($scope) {
            var ImageSliderController = {};

            var $imageArea = $('.imageArea');
            var imageWidth = $imageArea.width();
            var imageHeight = imageWidth / 2;
            var slideInterval = null;

            ImageSlideService.init(imageList);
            $scope.imageList = ImageSlideService.getImageList();
            $scope.currentIndex = ImageSlideService.currentIndex;

            //イメージ表示エリアを変数に格納
            ImageSlideService.setImageArea($imageArea);

            //画像サイズ設定
            ImageSlideService.setImageSizeObject({'width': imageWidth, 'height': imageHeight});
            ImageSliderController.imageSizeObject = ImageSlideService.getImageSizeObject();
            $imageArea.css({'height': ImageSliderController.imageSizeObject.height});

            //左へスライド、現在のインデックスを格納
            var autoSlide = function() {
                ImageSlideService.slideLeft();
                $scope.currentIndex = ImageSlideService.getCurrentIndex();
            };

            //次の画像を表示
            $scope.moveNext = function() {
                $interval.cancel(slideInterval);
                ImageSlideService.slideLeft();
                $scope.currentIndex = ImageSlideService.getCurrentIndex();
                slideInterval = $interval(autoSlide, 8000);
            };

            //前の画像を表示
            $scope.movePrev = function() {
                $interval.cancel(slideInterval);
                ImageSlideService.slideRight();
                $scope.currentIndex = ImageSlideService.getCurrentIndex();
                slideInterval = $interval(autoSlide, 8000);
            };

            //オートスライド
            slideInterval = $interval(autoSlide, 8000);

            return ImageSliderController;
        }
    }
}).
//アニメーション制御
animation('.slide-animation', function (ImageSlideService) {
    return {
        beforeAddClass: function (element, className, done) {
            if (className === 'ng-hide') {
                var finishPoint = ImageSlideService.imageSizeObject.width;
                if(ImageSlideService.moveDirection !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            } else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            if (className === 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = ImageSlideService.imageSizeObject.width;
                if(ImageSlideService.moveDirection === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
            } else {
                done();
            }
        }
    };
});
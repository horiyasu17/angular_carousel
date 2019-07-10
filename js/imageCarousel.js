/************************************************
 * Image Carousel
 ***********************************************/
angular.module('myApp', ['ngAnimate']).
service('ImageSlideService', function($interval) {
    var ImageSlideService = {};
    var slideInterval = null;

    ImageSlideService.currentIndex = 0;
    ImageSlideService.totalImageCount = 0;
    ImageSlideService.imageList = {};
    ImageSlideService.imageSizeObject = {};

    ImageSlideService.setIMageList = function(imageList) {
        ImageSlideService.imageList = imageList;
    };

    ImageSlideService.serCurrentIndex = function (index) {
        ImageSlideService.currentIndex = index;
    };

    ImageSlideService.setTotalImageCount = function (totalImageCount) {
        ImageSlideService.totalImageCount = totalImageCount;
    };

    ImageSlideService.setImageSizeObject = function (imageSizeObject) {
        ImageSlideService.imageSizeObject = imageSizeObject;
    };

    ImageSlideService.getIMageList = function() {
        return ImageSlideService.imageList;
    };

    ImageSlideService.getMoveNextCurrentIndex = function() {
        ImageSlideService.currentIndex++;
        if (ImageSlideService.totalImageCount - 1 < ImageSlideService.currentIndex) {
            ImageSlideService.currentIndex = 0;
        }

        return ImageSlideService.currentIndex;
    };

    ImageSlideService.getMovePrevCurrentIndex = function() {
        ImageSlideService.currentIndex--;
        if (ImageSlideService.currentIndex < 0) {
            ImageSlideService.currentIndex = ImageSlideService.totalImageCount - 1;
        }

        return ImageSlideService.currentIndex;
    };

    ImageSlideService.getImageSizeObject = function () {
        return ImageSlideService.imageSizeObject;
    };

    ImageSlideService.initSlideSet = function(element, itemIndex) {
        element.css({'left': ImageSlideService.imageSizeObject.width * itemIndex});
    };

    ImageSlideService.slideLeft = function(element) {
        element.css({'left': element.position().left - ImageSlideService.imageSizeObject.width});
    };

    ImageSlideService.slideRight = function(element) {
        element.css({'left': element.position().left + ImageSlideService.imageSizeObject.width});
    };

    ImageSlideService.autoSlideInterval = function(element) {
        var slideInterval = $interval(function() {
            ImageSlideService.slideLeft(
                element,
                ImageSlideService.imageSizeObject.width
            );
            // $interval.cancel(slideInterval);
        }, 3000);
    };

    return ImageSlideService;
}).
//イメージスライダー機能追加
directive('imageSlider', function(ImageSlideService) {
    return {
        restrict: 'E',
        replace: true,
        template:
            '<div class="viewArea">'
            + '<div class="slideWrapper marginCentering">'
            + '<ul class="imageArea">'
            + '<li ng-repeat="img in imageList" ng-class="{active: $index == currentIndex}" slide-item item-index="{{$index}}"><a><img ng-src="{{img.src}}"></a></li>'
            + '</ul>'
            + '</div>'
            + '<div ng-click="movePrev()" class="leftArrow arrowButton"></div>'
            + '<div ng-click="moveNext()" class="rightArrow arrowButton"></div>'
            + '<navigation-point />'
            + '</div>',
        scope: false,
        controller: function($scope) {
            var $imageArea = $('.imageArea');
            var imageWidth = $imageArea.width();
            var imageHeight = imageWidth / 2;

            $scope.currentIndex = ImageSlideService.currentIndex;
            $scope.totalImageCount =ImageSlideService.setTotalImageCount($scope.imageList.length);

            //画像サイズ設定
            ImageSlideService.setImageSizeObject({'width': imageWidth, 'height': imageHeight});

            //次の画像を表示
            $scope.moveNext = function() {
                $scope.currentIndex = ImageSlideService.getMoveNextCurrentIndex();
                ImageSlideService.slideLeft($imageArea);
            };

            //前の画像を表示
            $scope.movePrev = function() {
                $scope.currentIndex = ImageSlideService.getMovePrevCurrentIndex();
                ImageSlideService.slideRight($imageArea);
            };

            $scope.$watch('currentIndex', function (newVal, oldVal) {
            });

            // ImageSlideService.autoSlideInterval($imageArea);
        }
    }
}).
//スライドアイテム操作
directive('slideItem', function(ImageSlideService) {
    return {
        restrict: 'A',
        require: '^^imageSlider',
        scope: {
            itemIndex: '@'
        },
        controller($scope) {

            $scope.$watch(function () {
                return $scope.$parent.$parent.currentIndex;
            });
        },
        link: function(scope, elem, attr, ctrl) {
            var $imageArea = $('.imageArea');
            var $elem = $(elem[0]);
            var imageSizeObject = ImageSlideService.getImageSizeObject();
            scope.slidePoint = 0;

            $imageArea.css({
                'height': imageSizeObject.height
            });

            $elem.find('img').css({
                'width': imageSizeObject.width,
                'height': imageSizeObject.height
            });

            ImageSlideService.initSlideSet($elem, scope.itemIndex);
        }
    }
}).
//ナビゲーションポイント制御
directive('navigationPoint', function() {
    return {
        restrict: 'E',
        require: '^^imageSlider',
        replace: true,
        template:
            '<ul class="navigationPoint">'
            + '<li ng-repeat="point in imageList" ng-class="{activePoint: currentIndex == $index}">'
            + '</ul>',
        scope: false
    }
}).
//カルーセルアップコントローラー
controller('CarouselAppController', function($scope, ImageSlideService) {

    $scope.init = function() {
        ImageSlideService.setIMageList(imageList);
        $scope.imageList = ImageSlideService.getIMageList();
    };

});
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
    ImageSlideService.moveDirection = 'left';

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

    ImageSlideService.setMoveDirection = function (moveDirection) {
        ImageSlideService.moveDirection = moveDirection;
    };

    ImageSlideService.getIMageList = function() {
        return ImageSlideService.imageList;
    };

    ImageSlideService.getCurrentIndex = function() {
        return ImageSlideService.currentIndex;
    };

    ImageSlideService.getImageSizeObject = function () {
        return ImageSlideService.imageSizeObject;
    };

    ImageSlideService.getMoveDirection = function () {
        return ImageSlideService.moveDirection;
    };

    ImageSlideService.initSlideSet = function(imageItem, itemIndex) {
        imageItem.css({
            'left': ImageSlideService.imageSizeObject.width * itemIndex
        });
    };

    ImageSlideService.slideLeft = function(imageItem) {
        ImageSlideService.currentIndex++;
        if (ImageSlideService.totalImageCount - 1 < ImageSlideService.currentIndex) {
            ImageSlideService.currentIndex = 0;
        }

        imageItem.css({
            'left': imageItem.position().left - ImageSlideService.imageSizeObject.width
        });
    };

    ImageSlideService.slideRight = function(imageItem) {
        ImageSlideService.currentIndex--;
        if (ImageSlideService.currentIndex < 0) {
            ImageSlideService.currentIndex = ImageSlideService.totalImageCount - 1;
        }

        imageItem.css({
            'left': imageItem.position().left + ImageSlideService.imageSizeObject.width
        });
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

            //画像サイズ設定
            ImageSlideService.setImageSizeObject({'width': imageWidth, 'height': imageHeight});


            //次の画像を表示
            $scope.moveNext = function() {
                ImageSlideService.slideLeft($imageArea);
                $scope.currentIndex = ImageSlideService.getCurrentIndex();
            };

            //前の画像を表示
            $scope.movePrev = function() {
                ImageSlideService.slideRight($imageArea);
                $scope.currentIndex = ImageSlideService.getCurrentIndex();
            };

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
            $scope.initCount = 0;
            $scope.$elem = {};
        },
        link: function(scope, elem, attr, ctrl) {

            var $imageArea = $('.imageArea');
            var imageSizeObject = ImageSlideService.getImageSizeObject();
            scope.$elem = $(elem[0]);

            $imageArea.css({
                'height': imageSizeObject.height
            });

            scope.$elem.find('img').css({
                'width': imageSizeObject.width,
                'height': imageSizeObject.height
            });

            ImageSlideService.initSlideSet(scope.$elem, scope.itemIndex);

            // scope.$watch(function () {
            //     return scope.$parent.currentIndex;
            // }, function (newVal, oldVal) {
            //     if (scope.initCount == 0) {
            //         scope.initCount += 1;
            //         return;
            //     }

                // if(ImageSlideService.getMoveDirection() == 'left') {
                //     ImageSlideService.slideLeft(scope.$elem);
                // } else {
                //     ImageSlideService.slideRight(scope.$elem);
                // }
            // });
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
        $scope.currentIndex = ImageSlideService.currentIndex;
        $scope.totalImageCount =ImageSlideService.setTotalImageCount($scope.imageList.length);
    };

});
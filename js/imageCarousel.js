/************************************************
 * Image Carousel
 ***********************************************/
angular.module('myApp', []).
//イメージスライダー機能追加
directive('imageSlider', function() {
    return {
        restrict: 'E',
        replace: true,
        template:
            '<div class="viewArea">'
            + '<ul class="imageArea marginCentering">'
            + '<li ng-repeat="img in imageList" ng-class="{active: $index == currentIndex}" slide-item item-index="{{$index}}"><a><img ng-src="{{img.src}}"></a></li>'
            + '</ul>'
            + '<div ng-click="movePrev()" class="leftArrow arrowButton"></div>'
            + '<div ng-click="moveNext()" class="rightArrow arrowButton"></div>'
            + '<navigation-point />'
            + '</div>',
        scope: {
            imageList: '='
        },
        controller: function($scope) {
            var $imageArea = $('.imageArea');
            var $imageElem = $('.imageArea li');
            var $image = $('.imageArea li img');
            var imageWidth = $imageArea.width();
            var imageHeight = imageWidth / 2;

            $scope.currentIndex = 0;
            $scope.totalImageCount = $scope.imageList.length;

            //画像サイズ取得
            this.getAreaSize = function() {
                return {'width': imageWidth, 'height': imageHeight};
            };

            //次の画像を表示
            $scope.moveNext = function() {
                $scope.currentIndex++;
                if ($scope.totalImageCount - 1 < $scope.currentIndex) {
                    $scope.currentIndex = 0;
                }
            };

            //前の画像を表示
            $scope.movePrev = function() {
                $scope.currentIndex--;
                if ($scope.currentIndex < 0) {
                    $scope.currentIndex = $scope.totalImageCount - 1;
                }
            };
        }
    }
}).
//スライドアイテム操作
directive('slideItem', function() {
    return {
        restrict: 'A',
        require: '^^imageSlider',
        scope: {
            itemIndex: '@'
        },
        link: function(scope, elem, attr, ctrl) {
            var $imageArea = $('.imageArea');
            var $elem = $(elem[0]);
            var imageSizeObject = ctrl.getAreaSize();

            $imageArea.css({
                'height': imageSizeObject.height
            });

            $elem.find('img').css({
                'width': imageSizeObject.width,
                'height': imageSizeObject.height
            });

            $elem.css({
                'left': imageSizeObject.width * scope.itemIndex
            });
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
controller('CarouselAppController', function($scope) {

    $scope.imageList = imageList;

});
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
            + '<li ng-repeat="img in imageList" ng-if="$index == currentIndex" ng-class="{active: $index == currentIndex}" slide-item item-index="{{$index}}"><a><img ng-src="{{img.src}}"></a></li>'
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
            var areaSize = $imageArea.width();

            $scope.currentIndex = 0;
            $scope.totalImageCount = $scope.imageList.length;

            //画像サイズ取得
            this.getAreaSize = function() {
                return areaSize;
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
            var $elem = $(elem[0]);
            var areaSize = ctrl.getAreaSize();

            $elem.find('img').attr('width', areaSize);
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
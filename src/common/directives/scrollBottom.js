angular.module('directives.scrollBottom', [])

.directive('scrollBottom', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, el) {
			scope.isBottom = function () {
				return el.prop('offsetHeight') + el.scrollTop() >= el.prop('scrollHeight');
			};
			scope.scrollBottom = function () {
				$timeout(function () {
					el.scrollTop(el.prop('scrollHeight'));
				}, 0);
			};
		}
	};
})

;
var bootstrappedUser;

angular.element(document).ready(function() {
	$.getJSON('api/user', function (user) {
		bootstrappedUser = user;
		angular.bootstrap(document, ['mud']);
	});
});

angular.module('mud', [
	'templates-app',
	'templates-common',
	'mud.base',
	'mud.home',
	'ui.router',
	'ui.directives',
	'titleService',
	'filters.util',
	'filters.navs'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
})

.run(function bootstrapAppWithUser(User) {
	User.set(bootstrappedUser);
})

.run(function run(titleService) {
	titleService.setSuffix( ' | MUD Web Client' );
})

.run(function setTitleOfLabel($rootScope, titleService, $navs) {
	$rootScope.$on('$stateChangeSuccess', function (event, toState) {
		titleService.setTitle($navs.obj[toState.name].label);
	});
})

.controller('mud.AppCtrl', function AppCtrl($scope, User) {
	$scope.user = User.getUser();
})

;

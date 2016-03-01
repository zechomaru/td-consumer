angular.module('app', ['ngCordova','ionic', 'controllers'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
 
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $httpProvider, $urlRouterProvider) {
 // $httpProvider.defaults.useXDomain = true;
  //$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeTabCtrl'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .state('vendidos', {
      url: '/vendidos',
      templateUrl: 'templates/vendidos.html',
      controller: 'VendidosCtrl'
    })
    .state('canjeados', {
      url: '/canjeados',
      templateUrl: 'templates/canjeados.html',
      controller: 'CanjeadosCtrl'
    });




   $urlRouterProvider.otherwise('/sign-in');


});
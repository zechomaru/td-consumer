var a;
var b;
$rootScope =[];
angular.module('controllers', [])
.controller('SignInCtrl', function($scope, $state, $http, $window, $ionicPopup) {
  $scope.login = {};
  if (localStorage.getItem('id')) {
     $state.go('home');
  } else{
    $scope.signIn = function() {
      $http.post("http://10.25.224.113:8000/partner", {
      username: $scope.login.username,
      password: $scope.login.password
      }).success(function(data, status, headers, config){
        //console.log(data['login']);
        $window.localStorage['id'] = data['login'];
        if (localStorage.getItem('id')) {
            $state.go('home');
        } else{
            $state.go('signin');
        }; 
      }).error(function(error, status, headers, config){
        $ionicPopup.alert({
          title: 'Error',
          content: config + status + password + username
        });
      });
    };
  };
})
.controller('HomeTabCtrl', function($scope, $state, $http, $window) {
  if (localStorage.getItem('id')) {
    $scope.promotions=[];
    $scope.zones=[];
    $scope.viewPromomotion = false;
    $scope.viewZone = false;
    $http.get("http://td.dev/api/partner/" + $window.localStorage['id'],{
    }).success(function(data, status){
       $rootScope.partners = data;
      $scope.myNames = $rootScope.partners;
    }).error(function(error, status){
      $rootScope.partners = "Usuario";
    });
    

    $scope.promotion = function(){
      $http.get("http://10.25.224.113:8000/promotions/" + $window.localStorage['id'],{
      }).success(function(data, status, headers, config){
          $scope.viewPromomotion = !$scope.viewPromomotion;
          $scope.promotions = data;
      }).error(function(error, status, headers, config){
        
      });
    };
    $scope.zone = function($id){
      $scope.zones= [];
      $http.get("http://10.25.224.113:8000/zones/" + $id,{
      }).success(function(data, status, headers, config){
          $scope.zones = data;
      }).error(function(error, status, headers, config){
        
      });
    };
  } else{
    $state.go('signin');
  };
    $scope.viewSucursal = function(){
      $scope.viewZone = !$scope.viewZone;
    };
    $scope.promotionId = function($id){
      a = $id;
      $scope.zoneId = function($id){
        b = $id;
        $scope.b = b;
        $scope.search = function(){
          if (a && b) {
            $state.go('dashboard');
          };
        };
      };
    };
    
})
.controller('DashboardCtrl', function($scope, $state, $http, $window, $ionicPopup, $cordovaBarcodeScanner) {
   $scope.myNames = $rootScope.partners;
   $scope.promotions = [];
   $scope.zones = [];
   $scope.cv = [];
   $scope.cn = [];
   $scope.cc = [];
   $scope.return1 = function(){
      $state.go('home');
  };
  $scope.vendidos = function(){
      $state.go('vendidos');
  };
  $scope.canjeados = function(){
      $state.go('canjeados');
  };
  //scan
  $scope.scanBarcode = function() {
    $cordovaBarcodeScanner.scan()
      .then(function(barcodeData) {
        $http.patch("http://10.25.224.113:8000/coupons/qr/" + barcodeData.text +"/" + localStorage['id'],{
        }).success(function(data, status){
          $ionicPopup.alert({
            title: 'Correct',
            content: 'Canjeado exitoso'
          });
            $http.get("http://10.25.224.113:8000/coupons/exchange/count/" + a,{
            }).success(function(data, status){
               $scope.cc = data;
            }).error(function(error, status){
              $scope.cc = {"num":"0"};
            });
            $http.get("http://10.25.224.113:8000/coupons/nocanjeados/count/" + a,{
            }).success(function(data, status){
               $scope.cn = data;
            }).error(function(error, status){
              $scope.cn = {"num":"0"};
            });
        }).error(function(error, status){
          $ionicPopup.alert({
            title: 'Error',
            content: 'Cupon no valido'
          });
        });
      }, function(error) {
        // An error occurred
      });
  };
   //promotion name
   $http.get("http://10.25.224.113:8000/promotions/dashboard/" + a,{
   }).success(function(data, status){
       $scope.promotions = data;
   }).error(function(error, status){
     
   });
   //sucursal name

   $http.get("http://10.25.224.113:8000/zones/" + b,{
   }).success(function(data, status){
      $scope.zones = data;
   }).error(function(error, status){
   });
  //cupones vendidos
   $http.get("http://10.25.224.113:8000/coupons/vendidos/count/" + a,{
   }).success(function(data, status){
      $scope.cv = data;
   }).error(function(error, status){
     $scope.cv = {"num":"0"};
   });
   $http.get("http://10.25.224.113:8000/coupons/exchange/count/" + a,{
   }).success(function(data, status){
      $scope.cc = data;
   }).error(function(error, status){
     $scope.cc = {"num":"0"};
   });

   $http.get("http://10.25.224.113:8000/coupons/nocanjeados/count/" + a,{
   }).success(function(data, status){
      $scope.cn = data;
   }).error(function(error, status){
     $scope.cn = {"num":"0"};
   });

})
.controller('VendidosCtrl', function($scope, $state, $http, $window, $ionicPopup, $filter) {
   $scope.myNames = $rootScope.partners;
   var orderBy = $filter('orderBy');
   $scope.reverse = true;
   $scope.coupons = [];
   $scope.returnDash = function(){
      $state.go('dashboard');
  };
  //filter
  $scope.order = function(predicate) {
          $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
          $scope.predicate = predicate;
        };
  $scope.orderCanjeados = function(predicate, reverse) {
      $scope.coupons = orderBy($scope.coupons, predicate, reverse);
    };
    $scope.orderNoCanjeados = function(predicate, reverse) {
      $scope.coupons = orderBy($scope.coupons, predicate, !reverse);
    };
   //cupones vendidos
  $http.get("http://10.25.224.113:8000/coupons/vendidos/" + a,{
  }).success(function(data, status){
     $scope.coupons = data;
  }).error(function(error, status){
    console.log("error");
  });
})
.controller('CanjeadosCtrl', function($scope, $state, $http, $window, $ionicPopup) {
   $scope.myNames = $rootScope.partners;
   $scope.coupons = [];
   $scope.returnDash = function(){
      $state.go('dashboard');
  };
   //cupones vendidos
  $http.get("http://10.25.224.113:8000/coupons/canjeados/" + a,{
  }).success(function(data, status){
     $scope.coupons = data;
  }).error(function(error, status){
    console.log("error");
  });
});







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
      $http.post("http://td.dev/api/partner", {
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
          content: 'Usuario o Contraseña invalidos'
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
      $http.get("http://td.dev/api/promotions/" + $window.localStorage['id'],{
      }).success(function(data, status, headers, config){
          $scope.viewPromomotion = !$scope.viewPromomotion;
          $scope.promotions = data;
      }).error(function(error, status, headers, config){
        
      });
    };
    $scope.zone = function($id){
      $scope.zones= [];
      $http.get("http://td.dev/api/zones/" + $id,{
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
        $http.patch("http://td.dev/api/coupons/qr/" + barcodeData.text +"/" + localStorage['id'],{
        }).success(function(data, status){
          $ionicPopup.alert({
            title: 'Correct',
            content: 'Canjeado exitoso'
          });
            $http.get("http://td.dev/api/coupons/exchange/count/" + a,{
            }).success(function(data, status){
               $scope.cc = data;
            }).error(function(error, status){
              $scope.cc = {"num":"0"};
            });
            $http.get("http://td.dev/api/coupons/nocanjeados/count/" + a,{
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
   $http.get("http://td.dev/api/promotions/dashboard/" + a,{
   }).success(function(data, status){
       $scope.promotions = data;
   }).error(function(error, status){
     
   });
   //sucursal name

   $http.get("http://td.dev/api/zones/" + b,{
   }).success(function(data, status){
      $scope.zones = data;
   }).error(function(error, status){
   });
  //cupones vendidos
   $http.get("http://td.dev/api/coupons/vendidos/count/" + a,{
   }).success(function(data, status){
      $scope.cv = data;
   }).error(function(error, status){
     $scope.cv = {"num":"0"};
   });
   $http.get("http://td.dev/api/coupons/exchange/count/" + a,{
   }).success(function(data, status){
      $scope.cc = data;
   }).error(function(error, status){
     $scope.cc = {"num":"0"};
   });

   $http.get("http://td.dev/api/coupons/nocanjeados/count/" + a,{
   }).success(function(data, status){
      $scope.cn = data;
   }).error(function(error, status){
     $scope.cn = {"num":"0"};
   });

})
.controller('VendidosCtrl', function($scope, $state, $http, $window, $ionicPopup) {
   $scope.myNames = $rootScope.partners;
   $scope.coupons = [];
   $scope.returnDash = function(){
      $state.go('dashboard');
  };
   //cupones vendidos
  $http.get("http://td.dev/api/coupons/vendidos/" + a,{
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
  $http.get("http://td.dev/api/coupons/canjeados/" + a,{
  }).success(function(data, status){
     $scope.coupons = data;
  }).error(function(error, status){
    console.log("error");
  });
});







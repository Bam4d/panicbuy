// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
gh = angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'ui.router']);

gh.factory('ProductAPI', function($http) {

  var state = {
  };

  state.items = [];

  return {

    addItem: function(prod) {
      console.log(state.items);
      state.items.push(prod);
    },
    getState: function() {
      return state;
    },
    saveState: function(roundTime, priceLimit, speed) {
      state.roundTimer = roundTime;
      state.priceLimit = priceLimit;
      state.speed = speed;
    },
    getProductList: function() {
      return $http.post("http://api.gift-hacker.com/get", {price: state.priceLimit})
    }
  }
})

gh.controller('ConfigCtrl', function($scope, $state, ProductAPI) {

  $scope.time = 30;
  $scope.price = 10.00;
  $scope.speed = "fast";

  $scope.go = function() {
    ProductAPI.saveState($scope.time, $scope.price, $scope.speed);
    $state.go("play");
  };
 
});

gh.controller('CardsCtrl', function($scope, $state, $timeout, TDCardDelegate, ProductAPI ) {
  console.log('CARDS CTRL');
  
  $scope.time = ProductAPI.getState().roundTimer;
  console.log($scope.time);
  if(!$scope.time) {
    $state.go("config");
  }

  $scope.timer = new Date(1000*$scope.time);

  var countdown = function() {

    console.log($scope.timer);

    $scope.timer = new Date($scope.timer.getTime()-1000);

    if($scope.timer.getTime() > 0) {
      console.log($scope.timer);
      $timeout(countdown, 1000);
    } else {
      $state.go("items");
    }
  };

  ProductAPI.getProductList().then(function(xhr) {
    console.log(arguments);
    $scope.data = xhr.data;
    $scope.cards = Array.prototype.slice.call($scope.data, 0);

    countdown();
  });

  $scope.cardDestroyed = function(index) {
    console.log("index",index);
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function(index, add) {

    if(add) {
      ProductAPI.addItem($scope.cards[index]);
    }
  }

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard(index, false);
  };
  
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard(index, true);
  };

});

gh.controller('ItemsCtrl', function($scope, ProductAPI) {

  $scope.items = ProductAPI.getState().items;

  $scope.showMe = function(item) {
    window.open(item.link, '_blank');
  };

});

gh.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
});


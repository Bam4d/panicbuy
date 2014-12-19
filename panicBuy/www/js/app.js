// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
gh = angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'ui.router']);

gh.factory('ProductAPI', function($http) {

  var state = {
  };

  return {

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
    $state.go("items");
  };
 
});

gh.controller('CardsCtrl', function($scope, TDCardDelegate, ProductAPI ) {
  console.log('CARDS CTRL');
  var cardTypes = [
    { image: 'max.jpg' },
    { image: 'ben.png' },
    { image: 'perry.jpg' },
  ];

  ProductAPI.getProductList().then(function(xhr) {
    console.log(arguments);
    $scope.data = xhr.data;
  });

  $scope.cards = Array.prototype.slice.call(cardTypes, 0);

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
});

gh.controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
});

gh.controller('ItemsCtrl', function($scope, ProductAPI) {

  // Delte this!!!!!!!!
  ProductAPI.getProductList().then(function(xhr) {
    console.log(arguments);
    $scope.data = xhr.data;
    ProductAPI.getState().items = $scope.data;

    console.log("state:",ProductAPI.getState());

    $scope.items = ProductAPI.getState().items;
  });

  
  $scope.showMe = function(item) {

    window.open(item.link, '_blank', 'location=yes');

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


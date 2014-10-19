/*global jQuery:false*/
'use strict';

/**
 * @ngdoc overview
 * @name pppApp
 * @description
 * # pppApp
 *
 * Main module of the application.
 */
var mainModule = angular.module('gcbCreatorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.sortable'
]);

mainModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);



mainModule.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      // view -> model
    if($(element).is('span')){
      element.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(element.html());
        });
      });
    }
    else{ 
       $('body').on('hide.bs.modal','.modal', function() { 
            scope.$apply(function() {
              ctrl.$setViewValue(element.html());
            });
        });
    }

      // model -> view
      ctrl.$render = function() {
        element.html(ctrl.$viewValue);
      };
    }
  };
});



//******* FILTROS
mainModule.filter('unsafe',['$sce',  function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);

mainModule.filter('isUndefined', function() {
    return function(val) {
        return (val === undefined);
    };
});


//*********************  ANIMACIONES
// Animacion de las preguntas sd

mainModule.animation('.question-wrapper', function() {
    return {
        enter : function(element, done) { 
            jQuery(element).css({ 'opacity': 0 });
            jQuery(element).animate({'opacity': 1 }, 400, done);
        },

        /*leave : function(element, done) {
            jQuery(element).css({'opacity': 1 });
            jQuery(element).animate({'opacity': 0 }, 400, done);
        }*/
    };
});

mainModule.controller('HeaderController',['$scope','$location',  function ($scope, $location) {
    
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}]);

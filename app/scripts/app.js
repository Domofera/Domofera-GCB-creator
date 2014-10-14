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

mainModule.config(function ($routeProvider) {
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
});


//*********************  ANIMACIONES
// Animacion de las preguntas sd

mainModule.animation('.question-wrapper', function() {
    return {
        enter : function(element, done) { 
            var height = jQuery(element).height();
            jQuery(element).css({ 'max-height': 0, padding: '0 15px', 'opacity': 0 });
            jQuery(element).animate({'max-height': height+30, padding: '10px 15px', 'opacity': 1 }, 400, done);
        },

        leave : function(element, done) {
            var height = jQuery(element).height();
            jQuery(element).css({ 'max-height': height+30, padding: '10px 15px', 'opacity': 1 });
            jQuery(element).animate({'max-height': 0, padding: '0 15px', 'opacity': 0 }, 400, done);
        }
    };
});


function HeaderController($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}
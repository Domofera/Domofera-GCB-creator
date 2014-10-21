angular.module('gcbCreatorApp').controller('FormCtrl',['$scope',  function ($scope) {
    
    $scope.watch_errors = false;
    $scope.vacio = false;
    
    $scope.WatchErrors = function(){
        $scope.watch_errors = !$scope.watch_errors;
    }
    
    $scope.HacerPeticion = function(){
        
        if ($scope.main_form.$valid) {
          // Submit as normal
        } else {
          $scope.watch_errors = true;
        } 
    }
    
    
    /*
        <div class="error-container" ng-if="watch_errors && main_form.titulo.$invalid">
            <small class="help-block" ng-show="main_form.titulo.$error.required">Inserta un Título</small>
            <small class="help-block" ng-show="main_form.titulo.$error.pattern">Formato incorrecto</small>
        </div>
    */
    
}]);
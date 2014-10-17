/*global $:false, prompt:true*/
'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:Main2Ctrl
 * @description
 * # Este controlador se encarga de realizar las cosas auxiliares, como jQuery, u otras funciones no propias de AngularJS
 */

angular.module('gcbCreatorApp').controller('Main2Ctrl',['$scope', function ($scope) {
    

    var lastFocused;
    var isHover = false;
    var isFixed = false;


    function boldIt(){
        var edit = $('span[contenteditable=true]:focus');
        document.execCommand('bold', false, '');
        edit.focus();
    }

    function italicIt(){
        var edit = $('span[contenteditable=true]:focus');
        document.execCommand('italic', false, '');
        edit.focus();
    }

    function linkIt(url){
        var edit = $('span[contenteditable=true]:focus');
        document.execCommand('Createlink', false, url);
        edit.focus();
    }


    //***** jQuery

    $(document).ready(function () {

        $('#gcbc-toolbar .btn').tooltip({container: 'body'}); // Seteamos el tooltip

    // Cambiamos el valor de isFixed, para que ponga el toolbar fijo
        $(window).scroll(function(){
            if ($(this).scrollTop() > 105 && !isFixed) {
                $('#gcbc-toolbar').hide().fadeIn(300).addClass('fixed');
                $('#gcbc-toolbar .btn').tooltip('destroy');
                isFixed = !isFixed;
            } else if ($(this).scrollTop() <= 105 && isFixed){
                $('#gcbc-toolbar').hide().fadeIn(300).removeClass('fixed');
                $('#gcbc-toolbar .btn').tooltip({container: 'body'});
                isFixed = !isFixed;
            }
        });

        
    //****************** SORTABLE
        $('#questions-container').sortable({placeholder: 'sortable-placeholder'});
        
        $('#questions-container').on('sortbeforestop', function( event, ui ) {
            ui.item.removeClass('selected');
            ui.helper.removeClass('selected');
        });
        
        $('#questions-container').on('sortstart', function( event, ui ) {
            ui.helper.addClass('selected');
            ui.placeholder.height(ui.helper.outerHeight());
        });
        
        // Codigo para que no interfiera el UI-Sortable con el ContentEditable
        $('body').on('mouseenter mousedown','.questions-inside-left', function(){
            $('#questions-container').sortable('enable');
            $('.inner-sortable').sortable('disable');
        });
        $('body').on('mouseleave','.questions-inside-left', function(){
            $('#questions-container').sortable('disable');
        });
        
        // Seleccionar el bloque de la pregunta
        $('body').on('click','.questions-inside-left', function(){
            $(this).parent().addClass('selected');
        });
        
        
       // setTimeout(function(){ $('#questions-container').sortable('disable'); }, 100); //Esperamos 0.1s para que no de error
        
        
    // INNER SORTABLE
        $('.inner-sortable').sortable({placeholder: 'sortable-placeholder'});
        
        $('body').on('mouseenter mousedown','.inner-questions-inside-left', function(){
            $('#questions-container').sortable('disable');
            $('.inner-sortable').sortable('enable');
        });
        $('body').on('mouseleave','.inner-questions-inside-left', function(){
            $('.inner-sortable').sortable('disable');
        });
        
        $('body').on('click','.inner-questions-inside-left', function(){
            $(this).parent().addClass('selected');
        });
        
        
    // Quitar
        $('body').on('mouseup', function(e){
            var container = $('#questions-container>div');
            
            if (!container.is(e.target)){ // Si no es el bloque con las flechas de movimiento
                container.removeClass('selected');
            }
        });
        
        
        
        
        
    // Controlar los disabled de los botones
        $('body').on('focus','span[contenteditable=true]', function(){
            lastFocused = $(this);
        });
        $('body').on('mousedown','span[contenteditable=true]', function(){ 
            if(!$(this).is(':focus')){
                $('#questions-container').sortable('disable');
                $(this).focus();
            }
        });

        
        
    //******* ACORDEON
        $scope.colapsados = false;
        var animColDur = 1000;
        
      // Colapsar TODOS
        $('#boton-colapsado').on('click', function(e){
            $('#questions-container>div').each(function(index){
               if($scope.colapsados){ 
                    var h = $(this).find('.questions-inside-right').outerHeight(true) + $(this).height();
                    $(this).animate({ height: h }, animColDur);
                    $(this).removeClass('colapsado');
                    $(this).find('.question-collapse').children().eq(0).removeClass('fa-chevron-down').addClass('fa-chevron-up');
               }
               else{ 
                    $(this).animate({ height: 36 }, animColDur);
                    $(this).addClass('colapsado');
                    $(this).find('.question-collapse').children().eq(0).removeClass('fa-chevron-up').addClass('fa-chevron-down');
               }
            });
            
            $scope.$apply(function(){
                $scope.colapsados = !$scope.colapsados;
            });
        });
        
      // Colapsar UNO
        $scope.Collapse = function($index){ 
            var objeto = $($('#questions-container>div').get($index));

            if(objeto.hasClass('colapsado')){ 
                var h = objeto.find('.questions-inside-right').outerHeight(true) + objeto.height();
                objeto.animate({ height: h }, animColDur);
                objeto.removeClass('colapsado');
                objeto.find('.question-collapse').children().eq(0).removeClass('fa-chevron-down').addClass('fa-chevron-up');
           }
           else{ 
                objeto.animate({ height: 36 }, animColDur);
                objeto.addClass('colapsado');
                objeto.find('.question-collapse').children().eq(0).removeClass('fa-chevron-up').addClass('fa-chevron-down');
           }
        };
        
        
        

        //************* EDITOR DE TEXTO


        $('body').on('mouseenter','#editor-buttons>a, span[contenteditable=true]', function(){
            isHover = true;
        });

        $('body').on('mouseleave','#editor-buttons>a, span[contenteditable=true]', function(){
            isHover = false;
        });

        $('body').on('click', function(){
            if(isHover){
                $('#editor-buttons>a').removeClass('disabled');
                $('#editor-buttons').addClass('editor-glow');
            }else{
                $('#editor-buttons>a').addClass('disabled');
                $('#editor-buttons').removeClass('editor-glow');
            }
        });


        // Funciones bold, italic y link
        $('a[data-edit="bold"]').click(function(){
            boldIt();
            if(lastFocused){
                lastFocused.focus();
            }
        });
        $('a[data-edit="italic"]').click(function(){
            italicIt();
            if(lastFocused){
                lastFocused.focus();
            }
        });
        $('a[data-edit="link"]').click(function(){
            var urlp = prompt('Introduce el link:','http://');
            linkIt(urlp);
            if(lastFocused){
                lastFocused.focus();
            }
        });

    });
}]);


/*global $:false, prompt:true */
'use strict';

var lastFocused;
var isFixed = false;
var isHover = false;


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
/*
$$('body').on('tap','.questions-inside-left', function(){
        $('#questions-container').sortable('enable');
    });*/


//***** jQuery

$(document).ready(function () {

    //setTimeout(function(){ $('#questions-container').sortable('disable'); }, 1000);
    $('#gcbc-toolbar .btn').tooltip('destroy');
    $('#gcbc-toolbar .btn').tooltip({container: 'body'}); // Seteamos el tooltip
    
    $(window).scroll(function(){
        if ($(this).scrollTop() > 105 && !isFixed) {
            $('#gcbc-toolbar').hide().fadeIn(200).addClass('fixed');
            $('#gcbc-toolbar .btn').tooltip('destroy');
            console.log('entro222');
            isFixed = !isFixed;
        } else if ($(this).scrollTop() <= 115 && isFixed){
            $('#gcbc-toolbar').hide().fadeIn(200).removeClass('fixed');
            $('#gcbc-toolbar .btn').tooltip({container: 'body'});
            isFixed = !isFixed;
        }
    });


    // Codigo para que no interfiera el UI-Sortable con el ContentEditable
    $('body').on('mouseenter mousedown','.questions-inside-left', function(){
        $('#questions-container').sortable('enable');
    });
    
    $('body').on('mouseleave','.questions-inside-left', function(){
        $('#questions-container').sortable('disable');
    });

    
    // Obligar a que cuando se pulsa en un span, tenga el foco
    $('body').on('focus','span[contenteditable=true]', function(){
        lastFocused = $(this);
        $('#questions-container').sortable('disable');
    })
    .on('click','span[contenteditable=true]', function(){
        $(this).focus();
    })
    .on('blur','span[contenteditable=true]', function(){
        $('#questions-container').sortable('enable');
    });


    
    //************* EDITOR DE TEXTO

    // Controlar los disabled de los botones
    $('body').on('mouseenter','#editor-buttons>button, span[contenteditable=true]', function(){
        isHover = true;
    });

    $('body').on('mouseleave','#editor-buttons>button, span[contenteditable=true]', function(){
        isHover = false;
    });

    $('body').on('click', function(){
        if(isHover){
            $('#editor-buttons>button').removeClass('disabled');
        }else{
            $('#editor-buttons>button').addClass('disabled');
        }
    });


    // Funciones bold, italic y link
    $('button[data-edit="bold"]').click(function(){
        boldIt();
        if(lastFocused){
            lastFocused.focus();
        }
    });
    $('button[data-edit="italic"]').click(function(){
        italicIt();
        if(lastFocused){
            lastFocused.focus();
        }
    });
    $('button[data-edit="link"]').click(function(){
        var urlp = prompt('Introduce el link:','http://');
        linkIt(urlp);
        if(lastFocused){
            lastFocused.focus();
        }
    });
});
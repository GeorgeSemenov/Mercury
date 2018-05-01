$(document).ready(function(){
    //функция для плавного скролла до якоря (с помощью ссылок)
 $("ul.navbar-nav a:not(.dropdown-toggle)").click(function(){
     //Почему-то, если не добавить а:not(.dropdown-toggle), то при нажатии на ссылку с которой начинается выпадающее меню функция добавления класса active не будет срабатывать, я думаю это как-то связанно с animate, хотя на самом деле у меня нет никаких идей.
    var dropdownMenuHeight = $('div.dropdown-menu.show').css('height');
    var windowWidth = $(window).width();
    var isUndefined = dropdownMenuHeight == undefined;
    var isLgWidth = windowWidth > 991 ;
    var additionalOffset = (!isUndefined && !isLgWidth) ? (parseInt(dropdownMenuHeight)) : ( 0 )  ;
    var navHeight = $('nav').css('height');
 	$("body,html").stop(true,false).animate({
 		scrollTop:$("#" + $(this).data('value')).offset().top - (parseInt(navHeight) - additionalOffset)
 	},1000)
 });
    //функции которые позволяют классу active появляться в нужных местах в nav
    $("ul.navbar-nav li > a:not(.dropdown-toggle)").click(function(){
      $("ul.navbar-nav a").removeClass("active");
      $(this).addClass("active");
    });
    $("ul.navbar-nav li > a.dropdown-toggle").click(function(){
      $("ul.navbar-nav li > a").removeClass("active");
      $(this).addClass("active");
    });
    $("div.dropdown-menu > a").click(function(){
      $("div.dropdown-menu > a").removeClass("active");
      $(this).addClass("active");
    });

})

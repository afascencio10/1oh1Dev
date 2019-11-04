jQuery(function ($) {

    // Dropdown menu
    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if ($(this).parent().hasClass("active")) {
            $(".sidebar-dropdown").removeClass("active");
            $(this).parent().removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this).next(".sidebar-submenu").slideDown(200);
            $(this).parent().addClass("active");
        }

    });
    

    //toggle sidebar
    $("#responsiveMenu").click(function () {
        $(".page-wrapper").toggleClass("toggled");
    });
    $("#toggle-sidebar").click(function () {
        $(".page-wrapper").toggleClass("toggled");
    });
    $("#toggle-exit").click(function () {
        $(".page-wrapper").toggleClass("toggled");
    });
    //Pin sidebar
    $("#pin-sidebar").click(function () {
        if ($(".page-wrapper").hasClass("pinned")) {
            // unpin sidebar when hovered
            $(".page-wrapper").removeClass("pinned");
            $("#sidebar").unbind( "hover");
        } else {
            $(".page-wrapper").addClass("pinned");
            $("#sidebar").hover(
                function () {
                    console.log("mouseenter");
                    $(".page-wrapper").addClass("sidebar-hovered");
                },
                function () {
                    console.log("mouseout");
                    $(".page-wrapper").removeClass("sidebar-hovered");
                }
            )

        }
    });


    //toggle sidebar overlay
    $("#overlay").click(function () {
        $(".page-wrapper").toggleClass("toggled");
    });

    //switch between themes 
    var themes = "default-theme legacy-theme chiller-theme ice-theme cool-theme light-theme";
    $('[data-theme]').click(function () {
        $('[data-theme]').removeClass("selected");
        $(this).addClass("selected");
        $('.page-wrapper').removeClass(themes);
        $('.page-wrapper').addClass($(this).attr('data-theme'));
    });

    // switch between background images
    var bgs = "bg1 bg2 bg3 bg4";
    $('[data-bg]').click(function () {
        $('[data-bg]').removeClass("selected");
        $(this).addClass("selected");
        $('.page-wrapper').removeClass(bgs);
        $('.page-wrapper').addClass($(this).attr('data-bg'));
    });

    // toggle background image
    $("#toggle-bg").change(function (e) {
        e.preventDefault();
        $('.page-wrapper').toggleClass("sidebar-bg");
    });

    // toggle border radius
    $("#toggle-border-radius").change(function (e) {
        e.preventDefault();
        $('.page-wrapper').toggleClass("boder-radius-on");
    });
    //VARIABLE VALIDAR SI ESTA MOSTRANDO
    var isShow=0;
    $(".transparent1oh1Icon").click(function(){
        if(isShow == 0){
            console.log("Hola");
            $(".more_time_conflict").animate({left: '4px'});
            isShow=1;
        }else{
            isShow=0;
            $(".more_time_conflict").animate({left: '-330px'});
        }
    });
    //Modals
    $(".sessionIconsNoVideo").click(function(){
        if(isShow == 0){
            console.log("Mostrar");
            $(".more_time_conflict_5minutes").animate({left: '4px'});
            isShow=1;
        }else{
            isShow=0;
            $(".more_time_conflict_5minutes").animate({left: '-330px'});
        }
    });
    $(".sessionIconsEndCallCont").click(function(){
        if(isShow == 0){
            console.log("Mostrar");
            $(".more_time_conflict_remaining").animate({left: '4px'});
            isShow=1;
        }else{
            isShow=0;
            $(".more_time_conflict_remaining").animate({left: '-330px'});
        }
    });
    $(".sessionIconsMuteCont").click(function(){
        if(isShow == 0){
            console.log("Mostrar");
            $(".more_time_conflict_request").animate({left: '4px'});
            isShow=1;
        }else{
            isShow=0;
            $(".more_time_conflict_request").animate({left: '-330px'});
        }
    });
    $(".sessionIconsScreenSharingCont").click(function(){
        if(isShow == 0){
            console.log("Mostrar");
            $(".more_time_conflict_extra_request").animate({left: '4px'});
            isShow=1;
        }else{
            isShow=0;
            $(".more_time_conflict_extra_request").animate({left: '-330px'});
        }
    });

    //custom scroll bar is only used on desktop
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        
        $(".sidebar-content").addClass("desktop");

    }

    var sidebar = document.querySelector("#sidebar");
    var reviews = document.querySelector(".reviewsPage");
    if(sidebar || reviews){
      console.log("We have sidebar");
      var topbar = document.querySelector("#site-navbar");
      if(topbar){
        topbar.classList.add("topbarSide");
      }
    }

    
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
  });
$(document).ready(function(){
	console.log("begin script");
	var count = 0;
	var header_background_height_when_page_just_loaded = $(".header-background").css('height');
	var header_background_height_when_nav_expanded_no_px = parseInt(header_background_height_when_page_just_loaded) + 250; 
	var header_background_height_when_nav_expanded = header_background_height_when_nav_expanded_no_px + "px";
	console.log("header_background_height_when_page_just_loaded = " + header_background_height_when_page_just_loaded);
	$(".navbar-toggler").click(function(){
		console.log("click");
		count ++;
		console.log("count = " + count);
		if (count % 2 == 0 ){
			$(".header-background").css({"height": header_background_height_when_page_just_loaded});
			console.log("odd");
			console.log("header background height = " + header_background_height_when_page_just_loaded)
		}else{
			console.log("even");
			console.log("header background height = " + header_background_height_when_nav_expanded);
			$(".header-background").css({"height": header_background_height_when_nav_expanded});
		}
	})
})
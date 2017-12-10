function recalculateServicesWidth() {
	//Top_line size
	var count_li = jQuery('.top_line ul li').length;
	
	var nav_w = jQuery('.top_line ul').width();
	var nav_w_li = nav_w/(count_li);
	
	jQuery('.top_line ul li').css('width', nav_w_li + 'px');
	
	//Color_line size
	var count_li = jQuery('.color_line ul li').length;
	
	var nav_w = jQuery('.color_line ul').width();
	var nav_w_li = nav_w/(count_li);
	
	jQuery('.color_line ul li').css('width', nav_w_li + 'px');
	
	//Planning size
	var count_li = jQuery('.fist_line_planning a').length;
	
	var nav_w = jQuery('.fist_line_planning').width();
	var nav_w_li = nav_w/(count_li);
	
	jQuery('.fist_line_planning a').css('width', nav_w_li + 'px');
	
}


jQuery(window).bind('resize',function() {	
	//Service size
	recalculateServicesWidth();	
});

$(document).ready(function () {
    //build dropdown
    $("<select />").appendTo("nav#main_menu div");

    // Create default option "Go to..."
    $("<option />", {
        "selected": "selected",
        "value": "",
        "text": "Please choose page"
    }).appendTo("nav#main_menu select");

    // Populate dropdowns with the first menu items
    $("nav#main_menu li a").each(function () {
        var el = $(this);
        $("<option />", {
            "value": el.attr("href"),
            "text": el.text()
        }).appendTo("nav#main_menu select");
    });
    //Slider
    $('#camera_wrap_1').camera();
    //make responsive dropdown menu actually work			
    $("nav#main_menu select").change(function () {
        window.location = $(this).find("option:selected").val();
    });

    var $container = $('.projects');
    if ($container != null && $container.length > 0) {

        // initialize Isotope
        $container.isotope({
            // options...
            resizable: false, // disable normal resizing
            // set columnWidth to a percentage of container width
            masonry: { columnWidth: $container.width() / 12 }
        });

        // update columnWidth on window resize
        $(window).smartresize(function () {
            $container.isotope({
                // update columnWidth to a percentage of container width
                masonry: { columnWidth: $container.width() / 12 }
            });
        });


        $container.isotope({
            itemSelector: '.element',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: true
            }
        });
        var $optionSets = $('#options .option-set'),
	    $optionLinks = $optionSets.find('a');

        $optionLinks.click(function () {
            var $this = $(this);
            // don't proceed if already selected
            if ($this.hasClass('selected')) {
                return false;
            }
            var $optionSet = $this.parents('.option-set');
            $optionSet.find('.selected').removeClass('selected');
            $this.addClass('selected');

            // make option object dynamically, i.e. { filter: '.my-filter-class' }
            var options = {},
	         key = $optionSet.attr('data-option-key'),
	         value = $this.attr('data-option-value');
            // parse 'false' as false boolean
            value = value === 'false' ? false : value;
            options[key] = value;
            if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
                // changes in layout modes need extra logic
                changeLayoutMode($this, options)
            } else {
                // otherwise, apply new options
                $container.isotope(options);
            }

            return false;
        });
    }

    //Iframe transparent
    $("iframe").each(function () {
        var ifr_source = $(this).attr('src');
        var wmode = "wmode=transparent";
        if (ifr_source.indexOf('?') != -1) {
            var getQString = ifr_source.split('?');
            var oldString = getQString[1];
            var newString = getQString[0];
            $(this).attr('src', newString + '?' + wmode + '&' + oldString);
        }
        else $(this).attr('src', ifr_source + '?' + wmode);
    });
    //setup email here
    $('#button-send').click(function (event) {
        $('#button-send').html('Sending E-Mail...');
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'send_form_email.php',
            data: $('#contact_form').serialize(),
            success: function (html) {
                if (html.success == '1') {
                    $('#button-send').html('Send E-Mail');
                    alert('Your e-mail has been sent successfully');
                }
                else {
                    $('#button-send').html('Send E-Mail');
                    alert('Unable to send e-mail at the moment, please try later');
                }
            },
            error: function () {
                $('#button-send').html('Send E-Mail');
                alert('Unable to send e-mail at the moment, please try later');
            }
        });
    });

    //setup email here
    $('.btn-send').click(function (event) {
        $('.btn-send').html('Sending E-Mail...');
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'send_form_email.php',
            data: $('#cform').serialize(),
            success: function (html) {
                if (html.success == '1') {
                    $('.btn-send').html('Send E-Mail');
                    alert('Your e-mail has been sent successfully');
                }
                else {
                    $('.btn-send').html('Send E-Mail');
                    alert('Unable to send e-mail at the moment, please try later');
                }
            },
            error: function () {
                $('.btn-send').html('Send E-Mail');
                alert('Unable to send e-mail at the moment, please try later');
            }
        });
    });
    //Twitter Setup
    if ($('.tweet').length > 0) {
        $('.tweet').htweet({
            twitterId: 'egrappler',
            noOfTweets: 2,
            defaultProfileImage: 'images/twitter-bird.png',
            showProfileImage: false,
            showDefaultProfileImage: true
        });
    }

    //PrettyPhoto
    $("a[rel^='prettyPhoto']").prettyPhoto();

    //Image hover
    $(".proj_block, .post_img, .post").live('mouseover', function () {
        var info = $(this).find("img");
        info.stop().animate({ opacity: 0.5 }, 400);
        $(".preloader").css({ 'background': 'none' });
    });
    $(".proj_block, .post_img, .post").live('mouseout', function () {
        var info = $(this).find("img");
        info.stop().animate({ opacity: 1 }, 400);
        $(".preloader").css({ 'background': 'none' });
    });
    //Service size
    recalculateServicesWidth();
});





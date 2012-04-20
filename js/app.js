$(function (){
	var $window = $(window),
		$nameplate_panel = $("#nameplate-panel"),
		$social_buttons = $nameplate_panel.find("#social"),
		$message_panel = $("#message-panel");

	var windowWidth = 0,
		windowHeight = 0,

		nameplatePanelWidth = 0,
		nameplatePanelHeight = 0,

		messagePanelWidth = 0,
		messagePanelHeight = 0;

	var updateWindowMetrics = function (){
		windowWidth = $window.innerWidth();
		windowHeight = $window.innerHeight();
	};
	updateWindowMetrics();

	var updateNameplateMetrics = function (){
		nameplatePanelWidth = $nameplate_panel.outerWidth(true);
		nameplatePanelHeight = $nameplate_panel.outerHeight(true);
	};
	updateNameplateMetrics();

	var updateMessagePanelMetrics = function (){
		messagePanelWidth = $message_panel.outerWidth(true);
		messagePanelHeight = $message_panel.outerHeight(true);
	};
	updateMessagePanelMetrics();

	var resize = function (){
		/*console.log("resize", 
			"window: " + windowHeight + "x" + windowWidth,
			"panel: " + nameplatePanelHeight + "x" + nameplatePanelWidth
		);*/

		$nameplate_panel.css({
			top: (windowHeight - nameplatePanelHeight) / 2,
			left: (windowWidth - nameplatePanelWidth) / 2
		});
	};
	resize();

	$window.on("resize", function (){
		updateWindowMetrics();
		resize();
	});

	$social_buttons.find("a").hover(function (){
		$(this).find("span.highlight").stop(true, false).fadeIn();
	}, function (){
		$(this).find("span.highlight").stop(true, false).fadeOut();
	});

	$social_buttons.find("span").hide();

	var messagePanelIsDisplayed = false;
	$social_buttons.find("a.email").bind("click", function (e){
		e.preventDefault();

		if(messagePanelIsDisplayed){
			$(this).find("span.active").hide();
		} else {
			$(this).find("span.active").show();
		}

		messagePanelIsDisplayed = !messagePanelIsDisplayed;
	});
});

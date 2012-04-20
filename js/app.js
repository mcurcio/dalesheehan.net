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

	// now that all dimensions have been calculated, some setup
	$message_panel.css("top", windowHeight);

	var resize = function (){
		$nameplate_panel.css({
			top: (windowHeight - nameplatePanelHeight) / 2,
			left: (windowWidth - nameplatePanelWidth) / 2
		});

		$message_panel.css({
			left: (windowWidth - messagePanelWidth) / 2
		});
	};
	resize();

	$window.on("resize", function (){
		updateWindowMetrics();
		resize();
	});

	$social_buttons.find("a").hover(function (){
		$(this).find("span.highlight").stop(true, false).fadeIn(250);
	}, function (){
		$(this).find("span.highlight").stop(true, false).fadeOut(200);
	});

	$social_buttons.find("span").hide();

	var messagePanelIsDisplayed = false;
	$social_buttons.find("a.email").bind("click", function (e){
		e.preventDefault();

		var DURATION = 300,
			EASE = "easeOutBack";

		if(messagePanelIsDisplayed){
			$(this).find("span.highlight").fadeOut(0);
			$(this).find("span.active").hide();

			$nameplate_panel.queue("slide", function (next){
				$(this).animate({
					top: (windowHeight - nameplatePanelHeight) / 2
				}, DURATION, EASE, next);
			}).dequeue("slide");

			$message_panel.queue("slide", function (next){
				$(this).animate({
					top: windowHeight
				}, DURATION, EASE, next);
			}).dequeue("slide");
		} else {
			$(this).find("span.active").show();
			$(this).find("span.highlight").fadeOut(0);

			$nameplate_panel.queue("slide", function (next){
				$(this).animate({
					top: (windowHeight - nameplatePanelHeight - messagePanelHeight) / 2
				}, DURATION, EASE, next);
			}).dequeue("slide");

			$message_panel.queue("slide", function (next){
				$(this).animate({
					top: (windowHeight - nameplatePanelHeight + messagePanelHeight) / 2
				}, DURATION, EASE, next);
			}).dequeue("slide");

		}

		messagePanelIsDisplayed = !messagePanelIsDisplayed;
	});
});

$(function (){
	var DEBUG = true,
		log = (function (){
			if (console && console.log){
				return console.log.bind(console);
			} else {
				return function (){};
			}
		})();

	var $window = $(window),
		$nameplate_panel = $("#nameplate-panel"),
		$social_buttons = $nameplate_panel.find("#social"),
		$message_panel = $("#message-panel");

	var STATE_MESSAGE_OFFSTAGE = 0,
		STATE_MESSAGE_ONSTAGE = 1,
		STATE_MESSAGE_ENTERING = 2,
		STATE_MESSAGE_LEAVING = 3;

	var messageState = STATE_MESSAGE_ONSTAGE;

	var windowWidth = 0,
		windowHeight = 0,

		nameplatePanelWidth = 0,
		nameplatePanelHeight = 0,

		messagePanelWidth = 0,
		messagePanelHeight = 0;

	var updateWindowMetrics = function (){
		windowWidth = $window.innerWidth();
		windowHeight = $window.innerHeight();

		log("windowWidth: " + windowWidth);
		log("windowHeight: " + windowHeight);
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
	messageState = STATE_MESSAGE_OFFSTAGE;

	var resize = function (){
		var nameplatePanelLeftOffset = (windowWidth - nameplatePanelWidth) / 2,
			nameplatePanelTopOffset = false,
			messagePanelLeftOffset = (windowWidth - messagePanelWidth) / 2,
			messagePanelTopOffset = false;

		if (messageState === STATE_MESSAGE_OFFSTAGE){
			nameplatePanelTopOffset = (windowHeight - nameplatePanelHeight) / 2;
			messagePanelTopOffset = (windowHeight);
		} else if (messageState === STATE_MESSAGE_ONSTAGE){
			nameplatePanelTopOffset = (windowHeight - nameplatePanelHeight - messagePanelHeight) / 2;
			messagePanelTopOffset = (windowHeight - nameplatePanelHeight + messagePanelHeight) / 2;
		}

		if( nameplatePanelLeftOffset){
			$nameplate_panel.css("left", nameplatePanelLeftOffset);
		}

		if (nameplatePanelTopOffset){
			$nameplate_panel.css("top", nameplatePanelTopOffset);
		}

		if (messagePanelLeftOffset){
			$message_panel.css("left", messagePanelLeftOffset);
		}

		if (messagePanelTopOffset){
			$message_panel.css("top", messagePanelTopOffset);
		}
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

	$social_buttons.find("a.email").bind("click", function (e){
		e.preventDefault();

		var DURATION = 6000,
			EASE = "easeOutBack";

		if(messageState !== STATE_MESSAGE_OFFSTAGE){
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
				}, DURATION, EASE, function (){
					messageState = STATE_MESSAGE_OFFSTAGE;
					next();
				});

				messageState = STATE_MESSAGE_LEAVING;
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
				}, DURATION, EASE, function (){
					messageState = STATE_MESSAGE_ONSTAGE;
					next();
				});

				messageState = STATE_MESSAGE_ENTERING;
			}).dequeue("slide");

		}
	});

	// register background tile noise
	var TILE_NOISE_RATIO = 0.3,
		TILE_WIDTH = 72,
		TILE_HEIGHT = 72,
		TILES_PER_ROW = 5,
		TILES_PER_COL = 4;

	var tilesInAGridRow = Math.ceil(windowWidth / TILE_WIDTH),
		tileRowOverflowSize = tilesInAGridRow * TILE_WIDTH - windowWidth,
		offsetLeft = 0 - tileRowOverflowSize / 2,
		
		tilesInAGridCol = Math.ceil(windowHeight / TILE_HEIGHT),
		tileColOverflowSize = tilesInAGridCol * TILE_HEIGHT - windowHeight,
		offsetTop = 0 - tileColOverflowSize / 2;

	log("tiles across: " + tilesInAGridRow);
	log("overflow across: " + tileRowOverflowSize);
	log("offsetLeft: " + offsetLeft);

	var tilesInGrid = tilesInAGridRow * tilesInAGridCol,
		noiseToDraw = Math.ceil(tilesInGrid * TILE_NOISE_RATIO);
	log("adding noise: " + noiseToDraw + " tiles");

	var $noiseContainer= $("#grid-noise");
	var noiseCache = {};
	for (var i = 0; i < noiseToDraw; i++){
		var tileRow = Math.floor(Math.random() * TILES_PER_ROW),
			tileCol = Math.floor(Math.random() * TILES_PER_COL);

		// add 1 to the tile count, because we want to choose between 0 and n
		// inclusive, instead of 0 to n-1 as random() normally chooses
		var gridRow, gridCol, key;
		do {
			gridRow = Math.floor(Math.random()*(tilesInAGridCol + 1)),
			gridCol = Math.floor(Math.random()*(tilesInAGridRow + 1));
			key = gridRow + "-" + gridCol;
		} while (noiseCache.hasOwnProperty(key));

		var left = offsetLeft + gridCol*TILE_WIDTH,
			top = offsetTop + gridRow*TILE_HEIGHT;

		var $tile = $("<div />", {
			style: [
				"background-position: -" + (tileRow*TILE_HEIGHT) + "px -" + (tileCol*TILE_WIDTH) + "px",
				"top: " + top + "px",
				"left: " + left + "px"
			].join("; ")
		});

		$noiseContainer.append($tile);

		noiseCache[key] = {
			row: gridRow,
			col: gridCol,
			$el: $tile
		};
	}
});

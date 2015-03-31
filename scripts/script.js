var APP = (function(){

	var elements = {
		app:   qs('.app'),
		items: qs('.app__items'),
		ad:    qs('.app__item')
	};

	var pu        = parseURL(),
			q         = pu.query;
	var url = getURL();

	function init () {
		var data = loadJSONP(url, renderADS);
	}

	function getURL () {
		var mobileOS = getMobileOperatingSystem(),
				id,
				count = returnCountOfAd();
				cat = q.cat || "";
				pbk = q.pbk || "";

		if (mobileOS === "iOS") {
			id = q.ios_id;
		} else if (mobileOS = 'Android') {
			id = q.android_id;
		} else {
			id = '';
		};
		staticURL = 'https://admin.appnext.com/offerWallApi.aspx?id='+id+'&cnt='+count+'&cat='+cat+'&pbk='+pbk+'&type=json';
		return staticURL;
	}

function getMobileOperatingSystem() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i))
		{
				return 'iOS';
		}
		else if (userAgent.match(/Android/i))
		{
				return 'Android';
		}
	}

	function parseURL () {
		var queryParams = {};
		var url         = window.location.href;
		var parser      = document.createElement('a');
		parser.href     = url;
		
		var splitURL = url.split("?");

		var query = parser.search.substr(1).split("&");
		query.forEach(function(el, i, arr) {
			var values = arr[i].split("=");
			queryParams[values[0]] = values[1];
		});
		return {
			parser:       parser,
			beforeSearch: splitURL[0],
			query:        queryParams,
		}
	};

	function renderADS (data) {
		var countOfAds = returnCountOfAd();
		if (countOfAds > 1) {
			for (var i = countOfAds; i > 1; i--) {
				var cln = elements.ad.cloneNode(true);
				elements.items.appendChild(cln);
			};
		};
		replaceContent(data);
	}


	function addElements () {
			elements.ads     = qsa('.app__item');
			elements.titles  = qsa('.title');
			elements.descs   = qsa('.description');
			elements.images  = qsa('.image-container img');
			elements.buttons = qsa('.button > span');
			elements.osLogo  = qsa('.os-logo img');
	}

	function returnCountOfAd () {
		var countOfAds = {
			1: [ [216, 36], [300,50], [320, 50], [336, 280], [480, 320] ],
			2: [ [120,600], [160,600], [320, 480], [468,60], [728,90] ],
			3: [ [1024,90] ],
		}

		for (key in countOfAds) {
			var arr = countOfAds[key];
			for (var i = arr.length - 1; i >= 0; i--) {
				if (arr[i].toString() == iframeSize().toString()) {
					return key;
				};
			};
		};
	}

	function iframeSize () {
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		return [w, h];
	}

	function replaceContent (data) {
		var btn_text = q.btn_text,
				mobileOS  = getMobileOperatingSystem();
				btn_color = (q.btn_color) ? '#'+q.btn_color : "";
		addElements();
		data['apps'].forEach(function(el, i) {			
			elements.titles[i].textContent = el.title;
			elements.descs[i].textContent  = el.desc;
			elements.images[i].setAttribute('src', el.urlImg);
			elements.ads[i].addEventListener('click', function() {
				window.top.location.href = el.urlApp;
			})
			
			if (btn_text) {
				elements.buttons[i].textContent  = q.btn_text;	
			};

			if (btn_color) {
				elements.buttons[i].parentNode.style.backgroundColor = btn_color;
			};

			if (mobileOS == "iOS") {
				elements.osLogo[i].src = "images/apstore-logo.png";
			};

			if (q.roboto_font == 1) {
				var link, head, body;
				link = document.createElement('link');
				head = qs('head');
				body = qs('body');

				link.href = 'http://fonts.googleapis.com/css?family=Roboto:400,400italic,500,500italic,700';
				link.rel  = 'stylesheet';
				link.type = 'text/css';
				head.appendChild(link);
				addClass(body, 'roboto-font');
			};

			elements.app.style.display = 'block';
		});
	}

	function loadJSONP (url, callback, context) {
		var unique = 0;
		var name = "_jsonp_" + unique++;

		if (url.match(/\?/)) url += "&callback="+name;
		else url += "?callback="+name;

		// Create script
		var script  = document.createElement('script');
		script.type = 'text/javascript';
		script.src  = url;

		// Setup handler
		window[name] = function(data){
			callback.call((context || window), data);
			document.getElementsByTagName('head')[0].removeChild(script);
			script = null;
			delete window[name];
		};

		// Load JSON
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	return {
		init: init
	}	
}());

APP.init();
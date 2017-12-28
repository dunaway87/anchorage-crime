var AppRouter = require('routers/AppRouter');
var AppRoutes = require('routes/AppRoutes');
var MapView = require('views/MapView.js');

(function ($) {
	Backbone.emulateJSON = true;
	Backbone.emulateHTTP = true;

	app = {
		title: 'MHP',
		events: Backbone.Radio.channel('global'),
		routers: {},

		init: function() {
			log.enableAll();
			log.info("showing all log messages");

			app.host = window.location.hostname;

			// Create an Application
			var m = new Marionette.Application();

			// Add a region
			m.addRegions({

				main: "#main",
				

			});
			

		
/*			
			
			m.getRegion('header').attachView(new HeaderView());
			m.getRegion('sidebar').attachView(new SidebarView());
*/
			m.start();

			this.m = m;

			var that = this;

			this.routers.router = new AppRouter();

			var history = [];
			Backbone.history.on("route", function (name, args) {

			  document.title = app.title;

			  history.push({
			    name : name,
			    args : args,
			    fragment : Backbone.history.fragment
			  });
			});
			this.history = history;

			Backbone.history.start({
				pushState: Modernizr.history
			});
			
			app.router = app.routers.router;

			app.router.navigate(AppRoutes.mapView(), true);
		}
	};

	app.init();
})(jQuery);
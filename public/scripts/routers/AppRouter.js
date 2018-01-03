var Routing = require('routers/Routing');
var MapView = require('views/MapView');

//Router
module.exports = Backbone.Router.extend({
	routes: {
		'crime': 'mainView',
		
	},
	mainView: function() {

		app.m.getRegion('main').show(new MapView());
	}
	
}); //router
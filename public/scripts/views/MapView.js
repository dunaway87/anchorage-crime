
var routes = require('routes/AppRoutes');

var tmpl = require('MapView.tmpl');
var SidebarView = require('views/SidebarLayout');
var MapContainerTemplate = require('MapContainer.tmpl');

//MapView
module.exports = Backbone.Marionette.LayoutView.extend({
	template:tmpl,

	regions:{
		map:"#map-container",
		sidebar_container:"#sidebar-container"
	},

	
	

	onShow:function(){
/*		require.ensure([], function() {
			require("leaflet/leaflet.css");
			require("leaflet/leaflet.js");
			require("leaflet/leaflet-src.js");
			require("leaflet-draw")
		});
*/
		

		this.options.wmsLayer={};
		this.options.map={};

		
		this.showMap();
		this.showSidebar(this.options);



	},

	showSidebar:function(options){
		var that = this;
		var sidebar_view;
		$.get("/filters").done(function(data){
			sidebar_view = new SidebarView(data);
			that.getRegion('sidebar_container').show(sidebar_view);
			sidebar_view.on('reloadHeatmap', function(){
				that.options.map_view.trigger("reloadHeatmap")
			})
			sidebar_view.on('drawPolygon',function(){
				that.options.map_view.trigger("drawPolygon")
			});

			that.options.map_view.addHeatmap();

		})
		
	},


	showMap:function(options){
		var that = this;
		var map_view = new MapView(that.options)
		
		map_view.on("reloadHeatmap",function(){
			map_view.addHeatmap()
		})
		map_view.on("drawPolygon", function(){
			map_view.drawPolygon();
		})


		that.getRegion('map').show(map_view);
		


		this.options.map_view=map_view;

	},




	initialize: function(options){
		this.options = options;

		this.model = new Backbone.Model();
	}


	}); 




var MapView = Marionette.View.extend({
	id:'map',
	template:MapContainerTemplate,

	onShow:function(){	
		var that = this;

		//this.getDomPoints();
		that.options.map = L.map('map',{
			center:[61.15,-149.9],
			zoom:11,
				
		});

		that.options.map.doubleClickZoom.disable();

	    var mapboxID ='dunaway87.hffcoej7';
			
		var	basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				    baselayer: true

		});


		that.options.map.addLayer(basemap)


     	var drawnItems = new L.FeatureGroup();
    	that.options.map.addLayer(drawnItems);

		var drawControl = new L.Control.Draw({
        	edit: {
           		featureGroup: drawnItems
        	}
     	});
     	that.options.map.addControl(drawControl);



		var lat;
		var lon;

	/*	that.options.map.clicked=0;
		

		that.options.map.on('click', function(e){
			
			that.options.map.clicked = that.options.map.clicked+1;
			setTimeout(function(){
		        if(that.options.map.clicked == 1){
		        	lat = e.latlng.lat;
					lon = e.latlng.lng;
		            that.options.point_model=new Backbone.Model({
						lat:lat,
						lon:lon
					})

			
					//that.trigger('hunt:summary', that.options.point_model);               
		            that.options.map.clicked = 0;
		        }
		     }, 300);
		})*/

		that.options.map.on('dblclick', function(e){
		    that.options.map.clicked = 0;
		    that.options.map.setView(new L.LatLng( e.latlng.lat, e.latlng.lng),that.options.map.getZoom()+1)
		   
		});

		this.options.addHeatmapLayer =null;
		//this.addHeatmap();


	},

	drawPolygon:function(){
	   var that = this;

       that.options.map.on(L.Draw.Event.CREATED, function (e) {
	       var type = e.layerType;
		   var layer = e.layer;
		   if (type === 'marker') {
		       // Do marker specific actions
		   }
	   // Do whatever else you need to. (save to db; add to map etc)
	       that.options.map.addLayer(layer);
      });
	  that.options.map.on('draw:edited', function (e) {
         var layers = e.layers;
         layers.eachLayer(function (layer) {
             //do whatever you want; most likely save back to db
         });
     });
	},


	addHeatmap:function(year,crimetype){
		var year = $(".year-select").val();
		var code = $(".crime-select").val();
		var that = this;
	if(this.options.heatmapLayer){
		that.options.map.removeLayer(that.options.heatmapLayer)
	}
	$.get('/crimeGeoJson?year='+year+'&crimetype='+code).done(function(response){

		var data = {
				max: 10,
				data: response
		
		}
		
		var cfg = {
			  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
			  // if scaleRadius is false it will be the constant radius used in pixels
			  "radius": .005,
			  "maxOpacity": .8, 
			  // scales the radius based on map zoom
			  "scaleRadius": true, 
			  // if set to false the heatmap uses the global maximum for colorization
			  // if activated: uses the data maximum within the current map boundaries 
			  //   (there will always be a red spot with useLocalExtremas true)
			  "useLocalExtrema": false,
			  // which field name in your data represents the latitude - default "lat"
			  latField: 'lat',
			  // which field name in your data represents the longitude - default "lng"
			  lngField: 'lng',
			  // which field name in your data represents the data value - default "value"
			  valueField: 'count'
			};
	that.options.heatmapLayer = new HeatmapOverlay(cfg);

	that.options.heatmapLayer.setData(data);
	that.options.map.addLayer(that.options.heatmapLayer)
		
	})
	},

	initialize:function(options){
		this.options=options
	}
				
})





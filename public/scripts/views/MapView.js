
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
		$.get(rootUrl+"/filters").done(function(data){
			sidebar_view = new SidebarView(data);
			that.getRegion('sidebar_container').show(sidebar_view);
			sidebar_view.on('reloadHeatmap', function(){
				that.options.map_view.trigger("reloadHeatmap")
			})
			sidebar_view.on('drawPolygon',function(){
				that.options.map_view.trigger("drawPolygon")
			});
			sidebar_view.on('removePolygon',function(){
				that.options.map_view.trigger("removePolygon")
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
		map_view.on("removePolygon", function(){
			map_view.removePolygon();
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


that.options.editableLayers = new L.FeatureGroup();
//that.options.map.addLayer(editableLayers);



polygon_options = {
            showArea: false,
            shapeOptions: {
                stroke: true,
                color: '#000000',
                weight: 4,
                opacity: 0.5,
                fill: true,
                fillColor: null, //same as color by default
                fillOpacity: 0.2,
                clickable: true
            }
        }

 that.options.polygonDrawer = new L.Draw.Polygon(that.options.map,polygon_options);



that.options.editableLayers = new L.FeatureGroup();
that.options.map.addLayer(that.options.editableLayers);

that.options.map.on('draw:created', function(e) {
  that.options.editableLayers.removeLayer(that.options.layer)
  that.options.layer = e.layer;
  that.options.editableLayers.addLayer(that.options.layer);

  var drawnCoords ='';

  for (var i = 0; i < e.layer._latlngs[0].length; i++) {
    console.log(e.layer._latlngs[0][i]);
    var lat = e.layer._latlngs[0][i].lat
    var lng = e.layer._latlngs[0][i].lng
    if(i != 0){
    	drawnCoords+= ','
    }
    drawnCoords+=lng+" "+lat
  }

  console.log("draw coords: %o", drawnCoords)
var year = $(".year-select").val();
		var code = $(".crime-select").val();

$.get(rootUrl+"/polygonData?crime="+code+"&year="+year+"&polygon="+drawnCoords).done(function(data){
	console.log("data: %o", data)

		$('#popover').show();
		$('.close-popover').click(function(){
			$('#popover').hide()
		})
var trace1 = {
  x: data.years,
  y: data.values,
  type: 'scatter'
};


var trace = [trace1];

Plotly.newPlot('crime-graph', trace);


})


});


	that.options.map.on("draw:deleted", function(e) {
    	drawControlEditOnly.removeFrom(map);
    	drawControlFull.addTo(map);
	});

		var lat;
		var lon;


		that.options.map.on('dblclick', function(e){
		    that.options.map.clicked = 0;
		    that.options.map.setView(new L.LatLng( e.latlng.lat, e.latlng.lng),that.options.map.getZoom()+1)
		   
		});

		this.options.addHeatmapLayer =null;
		//this.addHeatmap();


	},
	drawPolygon:function(){
	   $('#delete-polygon').show();
       this.options.polygonDrawer.enable();

	},
	removePolygon:function(){
	   var that = this;
	   $('#delete-polygon').hide();
	   that.options.editableLayers.removeLayer(that.options.layer)
		$('#popover').hide()
	},


	addHeatmap:function(year,crimetype){
		var year = $(".year-select").val();
		var code = $(".crime-select").val();
		var that = this;
	if(this.options.heatmapLayer){
		that.options.map.removeLayer(that.options.heatmapLayer)
	}
	$.get(rootUrl+'/crimeGeoJson?year='+year+'&crimetype='+code).done(function(response){

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
	},
	closePopover:function(){

		$('#popover').hide();

	}
				
})





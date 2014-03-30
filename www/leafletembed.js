var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var footprintPolygon;

var MultiIcon = L.Icon.Label.extend({
  options: {
    iconUrl: 'images/icon.png',
    shadowUrl: null,
    iconSize: new L.Point(0, 0),
    iconAnchor: new L.Point(0, 0),
    labelAnchor: new L.Point(-8, -10),
    wrapperAnchor: new L.Point(0, 0),
    labelClassName: 'sweet-deal-label'
  }
});

var blackIcon = L.icon({
  iconUrl: 'images/icon_black.png',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor : [0, -5]
});

var greenIcon = L.icon({
  iconUrl: 'images/icon_green.png',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor : [0, -5]
});

var redIcon = L.icon({
  iconUrl: 'images/icon_red.png',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor : [0, -5]
});

var orangeIcon = L.icon({
  iconUrl: 'images/icon_orange.png',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor : [0, -5]
});


function onClick(e) {
  e.target.bindPopup(e.target.data, {autoPan:false,maxWidth:400})
          .openPopup();
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  map.stopLocate();
}

function permalink() {
  var center = map.getCenter();
  var lat = Math.round(center.lat * 100000000) / 100000000;
  var lon = Math.round(center.lng * 100000000) / 100000000;
  var serverUrl='http://' + window.location.hostname + '/index.php';
  var layer = map.hasLayer(osmTiles) ? "&layer=osm" : "";
  var newLoc=serverUrl + "?lat=" + lat + "&lon=" + lon + "&zoom=" + map.getZoom() + layer;
  window.location=newLoc;
}

// Layers
var osmTiles;
var mapQuestTiles;


function initmap() {

  // set up AJAX request
  ajaxRequest=getXmlHttpObject();
  if (ajaxRequest==null) {
    alert ("This browser does not support HTTP Request");
    return;
  }

  // set up the map
  map = new L.Map('map');

  // create the tile layers with correct attribution
  var permalink=' — <a href=#" onClick="permalink();return false;">Permalink</a>';
  var dataAttrib='Map data (c) <a href="http://www.osm.org" target="_blank">OpenStreetMap</a> contributors';

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib=dataAttrib + permalink;
  osmTiles = new L.TileLayer(osmUrl, {minZoom: 4, maxZoom: 18, attribution: osmAttrib});		
  var mapQuestUrl='http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png'; 
  var mapQuestAttrib='Tiles: <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> - ' + dataAttrib + permalink;
  mapQuestTiles = new L.TileLayer(mapQuestUrl, {minZoom: 4, maxZoom: 18, attribution: mapQuestAttrib, subdomains: '1234'});		

  var baseLayers = {
    "MapQuest": mapQuestTiles,
    "OpenStreetMap": osmTiles
  };

  // start the map in default position
  map.setView(new L.LatLng(initialLat,initialLon),initialZoom);
  if (isMobile && initialIsDefault) {
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.locate( { setView:true });
  }
  if (initialLayer == 'osm') {
    map.addLayer(osmTiles);
  } else {
    map.addLayer(mapQuestTiles);
  }
  L.control.layers(baseLayers, null, {position: 'topleft'}).addTo(map);

  askForPlots();
  map.on('moveend', onMapMove);

}

function onMapMove(e) { askForPlots(); }

function getXmlHttpObject() {
  if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
  if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
  return null;
}

function askForPlots() {
  // request the marker info with AJAX for the current bounds
  var bounds=map.getBounds();
  var minll=bounds.getSouthWest();
  var maxll=bounds.getNorthEast();
  var size=map.getSize();
  var msg='getwifi.php?bbox='+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat+'&zoom='+map.getZoom()+'&width='+size.x+'&height='+size.y+'&debug='+debug;
  ajaxRequest.onreadystatechange = stateChanged;
  ajaxRequest.open('GET', msg, true);
  ajaxRequest.send(null);
}

function isNumeric(s) {
  var intRegex = /^\d+$/;
  var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
  return ((intRegex.test(s) || floatRegex.test(s)));
}

function drawFootprint(val) {
  val = JSON.parse(val);
  var pts= [];
  for (x in eval(val)) {
    pts.push(new L.LatLng(val[x]['lat'], val[x]['lon'], false));
  }
  if (footprintPolygon != null) {
    map.removeLayer(footprintPolygon);
  }
  footprintPolygon = L.polygon(pts, { color:'blue', weight : 1, fillOpacity:0.1 });
  footprintPolygon.addTo(map);
}

function stateChanged() {
  // if AJAX returned a list of markers, add them to the map
  if (ajaxRequest.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.status==200) {
      plotlist=eval("(" + ajaxRequest.responseText + ")");
      removeMarkers();
      for (i=0;i<plotlist.length;i++) {
        var plotmark = '';
        var plotll;
        if (plotlist[i].rectangle=='yes') {
          var southWest = new L.LatLng(plotlist[i].latMin, plotlist[i].lonMin),
              northEast = new L.LatLng(plotlist[i].latMax, plotlist[i].lonMax),
              bounds = new L.LatLngBounds(southWest, northEast);
          plotmark = new L.Rectangle(bounds, {color:'blue',fillOpacity:0,weight:1});

        } else if (plotlist[i].error) {
          alert(plotlist[i].error);

        } else if (plotlist[i].multi=='yes') {
          plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
          if (plotlist[i].poly) {
            var polyTxt='[';
            var sepPoly='';
            for (x in plotlist[i].poly) {
              polyTxt=polyTxt
                     + sepPoly
                     + '{&quot;lat&quot;:&quot;' + plotlist[i].poly[x]['lat'] + '&quot;,'
                     + ' &quot;lon&quot;:&quot;' + plotlist[i].poly[x]['lon'] + '&quot;}';
              sepPoly=",";
            }
            polyTxt=polyTxt + "]";
            countTxt='<span ' + (isMobile ? 'onclick' : 'onmouseover') + '="drawFootprint(\'' + polyTxt + '\')">' + plotlist[i].count + "</span>";
          } else {
            countTxt =  plotlist[i].count;
          }
          theMultiIcon = new MultiIcon({labelText: countTxt });
          plotmark = new L.Marker(plotll, { icon: theMultiIcon });
          //plotmark.data = plotlist[i].poly;

        } else {
          try {
          plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
//          var iconName = 'fixed';
		  var iconName = 'black';
          if (plotlist[i]['crypt'] == 'Open') {
            iconName = 'green';
          } else if (plotlist[i]['crypt'] == 'WPA2') {
            iconName = 'red';
          } else if (plotlist[i]['crypt'] == 'WpaPsk	') {
            iconName = 'red';			
          } else if (plotlist[i]['crypt'] == 'Wep') {
            iconName = 'orange';
          } 
		  
          iconName = iconName + 'Icon';
          theIcon = eval(iconName);
          plotmark = new L.Marker(plotll, {icon : theIcon});

       
          plotmark.data='<table class="popup-content">'
                       +'<tr><td>id</td><td>' + (plotlist[i].id) + '</td></tr>'
                       +'<tr><td>latitude</td><td>'+(plotlist[i].lat)+'</td></tr>'
                       +'<tr><td>longitude</td><td>'+(plotlist[i].lon)+'</td></tr>';
          for (x in plotlist[i]) {
            if (plotlist[i][x] != '' && x != 'multi' && x != 'multi' && x != 'id' && x != 'lat' && x != 'lon' && x != 'userid') {
              plotmark.data=plotmark.data + '<tr><td>' + x + '</td><td>';
              var descr=plotlist[i][x];
              if (descr.substr(0, 4) == 'http') {
                var suffix=descr.slice(-3).toLowerCase();
                if (suffix == "jpg" || suffix == "gif" || suffix == "png") {
                  plotmark.data=plotmark.data + '<a href="' + descr + '"><img alt="image" src="' + descr + '" width="200"/></a>';
                } else {
                  plotmark.data=plotmark.data + '<a href="' + descr + '">Lien</a>';
                }
              } else {
                plotmark.data=plotmark.data + plotlist[i][x];
              }
              plotmark.data=plotmark.data + '</td></tr>';
            }
          }
          plotmark.data=plotmark.data +'</table>';
          plotmark.on('click', onClick);
          } catch(e) {
          }
        }
        if (plotmark != '') {
          map.addLayer(plotmark);
          plotlayers.push(plotmark);
        }
      }
    }
  }
}

function removeMarkers() {
	for (i=0;i<plotlayers.length;i++) {
		map.removeLayer(plotlayers[i]);
	}
	plotlayers=[];
}
initmap()


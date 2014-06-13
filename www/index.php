<?php
  include 'config.php';

  require_once 'Mobile_Detect.php';
  $detect = new Mobile_Detect();
  $isMobile = $detect->isMobile(); 

  $language='en';
  $locale = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
  $lstLng = explode(',', $locale);
  foreach($lstLng as $lng) {
    $lng = substr(trim($lng), 0, 2);
    if ($lng == 'fr') {
      $language = 'fr';
      break;
    } else if ($lng == 'en') {
      $language = 'en';
      break;
    }
  }

  $initialIsDefault='true';

  if (array_key_exists('zoom', $_GET)) {
    $initialZoom = $_GET['zoom'];
    if (is_numeric($initialZoom) 
        && intval($initialZoom) >= 1 && intval($initialZoom) <= 18) {
      $initialIsDefault='false';
    } else {
      $initialZoom = DEFAULT_ZOOM;
    }
  } else {
    $initialZoom = DEFAULT_ZOOM;
  }

  if (array_key_exists('lat', $_GET) && array_key_exists('lon', $_GET)) {
    $initialLat = $_GET['lat'];
    $initialLon = $_GET['lon'];
    if ( is_numeric($initialLat) && is_numeric($initialLon)) { 
      $initialIsDefault='false';
    } else {
      $initialLat = DEFAULT_LAT;
      $initialLon = DEFAULT_LON;
    }
  } else {
    $initialLat = DEFAULT_LAT;
    $initialLon = DEFAULT_LON;
  }

  $initialLayer='';
  if (array_key_exists('layer', $_GET)) {
    $initialLayer = $_GET['layer'];
    if ($initialLayer != 'osm') {
      $initialLayer='';
    }
  }


  $debug = (array_key_exists('debug', $_GET) 
            && ($_GET['debug'] == 'yes' 
                || $_GET['debug'] == 'true')) ? 'yes' : 'no';
    
?>        
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <?php
    if ($language == "pl") { 
  ?>
    <title>Mapa punktów wifi</title>
  <?php
    } else {
  ?>
    <title>Wifi hotspot map</title>
  <?php
    }
  ?>
  <?php
    /* Disable unwanted scaling */
    if ($isMobile) {
  ?>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <?php
    }
  ?>
</head>
<body>
<link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
<link href='http://api.tiles.mapbox.com/mapbox.js/v1.6.2/mapbox.css' rel='stylesheet' />
<link href='http://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.css' rel='stylesheet' />
<!--[if lt IE 9]>
  <link href='http://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.21.0/L.Control.Locate.ie.css' rel='stylesheet' />
<![endif]-->
<link href='http://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.2/leaflet.fullscreen.css' rel='stylesheet' />
<link rel="stylesheet" href="L.Control.Sidebar.css" />
<link rel="stylesheet" href="Icon_Label.css" />

<style>
body {
    padding: 0;
    margin: 0;
}
html, body, #map {
    height: 100%;
}

.sweet-deal-label {
  background-color: #FE57A1;
  background-color: rgba(254, 87, 161, 0.66);
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  color: #fff;
  font-weight: bold;
}

.popup-content {
  margin: 0px 0px 0px 2px;
}
  
.leaflet-bar a {
  text-align: center;
}  

.leaflet-sidebar.right {
    right: -500px;
    transition: right 0.5s, width 0.5s;
    padding-left: 0;
}

.leaflet-sidebar.right.visible {
    right: 50px;
}
.leaflet-sidebar {
      width: 200px;
      height: 50%;	  
}
.leaflet-sidebar.right.visible ~ .leaflet-right {
        right: 0px;
    }

</style>


<script language="javascript">
<?php
  echo "var initialLat=$initialLat;\n";
  echo "var initialLon=$initialLon;\n";
  echo "var initialZoom=$initialZoom;\n";
  echo "var initialIsDefault=$initialIsDefault;\n";
  echo "var debug='$debug'\n";
  if ($isMobile) {
    echo "var isMobile=true;\n";
  } else {
    echo "var isMobile=false;\n";
  }
  if ($initialLayer != '') {
    echo "var initialLayer='$initialLayer';\n";
  } else {
    echo "var initialLayer='mapquest';\n";
  }
?>
</script>
<script src='http://api.tiles.mapbox.com/mapbox.js/v1.6.2/mapbox.js'></script>
<script src='http://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.js'></script>
<script src='http://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.2/Leaflet.fullscreen.min.js'></script>
<script src="L.Control.Sidebar.js"></script>
<script src="L.Control.EasyButtons.js"></script>
<script src="Icon_Label.js"></script>
    <div id="filter">
        <h1>Crypt</h1>
   </div>
<div id="map"></div>
<script src="leafletembed.js"></script>
</body>
</html>
<?php
header('Content-type: text/html; charset="UTF-8"');
?>
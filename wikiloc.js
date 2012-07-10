<?php

$url = 'http://api.wikilocation.org/articles?lat=31.772631&lng=35.21878&radius=2000';

$json = file_get_contents($url);

$data = json_decode($json);

// var_dump($data);
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="content-type" content="text/html;
    charset=utf-8"/>
    <title>Wikipedia Around Me</title>
    <!-- script src="http://maps.google.com/maps?file=api&v=2&key=AIzaSyD72kGi4xTNaJIlPpquAJcQW1Oz5JyQYdU" type="text/javascript"></script -->
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyD72kGi4xTNaJIlPpquAJcQW1Oz5JyQYdU&sensor=false"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
    <script type="text/javascript">
    //<![CDATA[


    // Position API Errors
    // 1: 'Permission denied',
    // 2: 'Position unavailable',
    // 3: 'Request timeout'
      
    var wikidata;
    var map;

    function createMarker(point, text, title) {
      var marker = new google.maps.Marker(
        { 
          position: point,
          title:title
        }
      );

      var infowindow = new google.maps.InfoWindow({ content: text });

      google.maps.event.addListener(
        marker, "click", function() { infowindow.open(map,marker); }
      );
      
      return marker;
    }

    function renderData(wikidata){

      for(d in wikidata) { 

        point = new google.maps.LatLng(wikidata[d]['lat'], wikidata[d]['lng']);
      
        html = "<a href=\"" + wikidata[d]['mobileurl'] + "\">" + wikidata[d]['title'] + "</a>";
        var marker = createMarker(point, html, wikidata[d]['title']);
        // map.addOverlay(marker); 
        marker.setMap(map);
      }
    }

    function getData(location_lat, location_lng){
      $.getJSON(
        "http://api.wikilocation.org/articles?jsonp=?",
        {
          lat:location_lat, // 31.772631,
          lng:location_lng, // 35.21878,
          radius:3000
        },
        function(data) { renderData(data['articles']); }
      );
    }

    function initMap(lat,lng) {
      var myOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      
      map = new google.maps.Map(document.getElementById("map"), myOptions);

    }        

    function load() {

      navigator.geolocation.getCurrentPosition(
        function(position){

          lat = position.coords.latitude;
          lng = position.coords.longitude;
        
          initMap(lat, lng)
          getData(lat, lng);
        }, 

        function(err) { alert("Error: " + errors[error.code]); },
        
        { enableHighAccuracy: true, timeout: 10000000, maximumAge: 0 }
      );
    }
    
    //]]>
    </script>
  </head>
  <body onload="load()" onunload="GUnload()">
    <div id="map"
    style="width: 500px; height: 300px"></div>
  </body>
</html>


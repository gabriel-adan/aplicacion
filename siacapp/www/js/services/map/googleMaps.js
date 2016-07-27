'use strict';
 
 angular.module('appsiac.services')
.factory('GoogleMaps', function($ionicLoading, $rootScope, $cordovaNetwork, ConnectivityMonitor, $ionicPopup,$ionicHistory,$q){
 
  var apiKey = false;
  var map = null;

  var marker;
  var geocoder;
  var myLatlng;
  var contador= 0;

  function initMap(elementMap, text, callback){

  
    var options = {timeout: 10000, enableHighAccuracy: true};
    geocoder = new google.maps.Geocoder();
    myLatlng = new google.maps.LatLng(-26.8388,-65.2063);

        var mapOptions = {
            zoom: 15,
            center: myLatlng
        }
 
    
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            draggable: true,
            title: 'SIAC'
            
         });
        google.maps.event.addListener(marker, 'dragend', function(evento) {
            var position = evento.latLng;
            if(validarPosicion(position)){
                var latitud = position.lat();
                var longitud = position.lng();
                var location = new google.maps.LatLng(latitud, longitud);
                geocoder.geocode({location: location}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            text.value = results[0].formatted_address;
                            callback(position);
                        } else {
                          text.value = '';
                            alert('No se encontró la dirección...');
                        }
                    } else {
                      text.value = '';
                        alert('Ocurrió un problema, vuelva a interntar en unos segundos...');
                    }
                }); 
            }else{
              text.value = '';
            }
        });
 
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
        
        enableMap();
      });
 
  
 
  }
  function getDireccionAsync($q, direccion){
      return $q(function(resolve, reject){
        geocoder.geocode({address: direccion + " San Miguel de Tucuman, Tucuman"}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK){
            var position = results[0].geometry.location;
              if(validarPosicion(position)){
                  marker.setPosition(position);
                  map.setCenter(position);
                  var dir = {
                    direccion: results[0].formatted_address,
                    position: position
                  }
                  resolve(dir);
              }else{
                reject(null);
              }
          }else{
            reject(null);
          }
        });
      });
    }
  function validarPosicion(position){
        var latitud = position.lat();
        var longitud = position.lng();
        
        if((latitud < -26.78530077380037 & latitud > -26.892519689424365) & (longitud > -65.26702877656248 & longitud < -65.16780850068358)){
            var coordenadas = position.lat() + ", " + position.lng();
            return true;
        }else{
            alert('LA DIRECCION INDICADA ESTA FUERA DE SAN MIGUEL DE TUCUMAN');
            return false;
        }
    }
 
  function enableMap(){
    $ionicLoading.hide();
  }
 
  function disableMap(){
    $ionicPopup.show({ 
                     template: ' <div class="card color-vr">'+
                        '<div class="item item-divider color-vr">'+
                        '<i></i>ATENCIÓN</div><div class="alert-mensaje">'+
                        '<p>No tiene conexion a internet</p></div></div></div>',
                    buttons: [ 
                    { text: 'Aceptar',
                      type: 'button-positive',
                      onTap: function(e){ 
                         //  navigator.app.exitApp();
                         $ionicHistory.goBack();
                      }

                     }

                    ]
                });
  }
 
  function loadGoogleMaps(elementMap, text, callback){
  
    $ionicLoading.show({
      template: 'Cargando Google Maps'
    });
 
    //This function will be called once the SDK has been loaded
    window.mapInit = function(){
           initMap(elementMap, text, callback);
           
         };
    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";
 
    //Note the callback function in the URL is the one we created above 
    script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
    document.body.appendChild(script);
 
  }
 
  function checkLoaded(elementMap, text, callback){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
       console.log("pase por aqui checkLoaded");
      loadGoogleMaps(elementMap, text, callback);
    } else {
      enableMap();
    }       
  }
 
  function addInfoWindow(marker, message, record) {
 
      var infoWindow = new google.maps.InfoWindow({
          content: message
      });
 
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
 
  }

  function loadGoogleMapsForConsulta(map,coorde1,coorde2){
    
    $ionicLoading.show({
      template: 'Cargando Google Maps'
    });
 
    //This function will be called once the SDK has been loaded

    window.mapInitConsulta = function(){

           setPosicionMap(map,coorde1,coorde2);
           
         };
    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";
 
    //Note the callback function in the URL is the one we created above
    
    script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInitConsulta';
    
 
    document.body.appendChild(script);
 
  }
  function setPosicionMap(map,coorde1,coorde2){

       
       geocoder = new google.maps.Geocoder();
       myLatlng = new google.maps.LatLng(coorde1,coorde2);
      

        var mapOptions = {
            zoom: 15,
            center: myLatlng,
            draggable:false
        }

        map = new google.maps.Map(map, mapOptions);

          
        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            draggable: false,
            title: 'SIAC',
            label:'Reclamo'
          //  animation: google.maps.Animation.BOUNCE

        });
       google.maps.event.addListenerOnce(map, 'idle', function(){
        
        enableMap();
      });

  }


 
  function addConnectivityListeners($scope, elementMap, text, callback){
 
    if(ionic.Platform.isWebView()){
      // Check if the map is already loaded when the user comes online, 
//if not, load it
      var onlineEvent = $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        checkLoaded(elementMap, text, callback);
      });
 
      // Disable the map when the user goes offline
      var offlineEvent = $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableMap();
      });

      $scope.$on('$destroy', function() {
          onlineEvent();
          offlineEvent();
      });
 
    }
    else {
 
      //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
        checkLoaded();
      }, false);    
 
      window.addEventListener("offline", function(e) {
        disableMap();
      }, false);  
    }
 
  }

  
 
  return {

    init: function($scope, elementMap, text, callback){
   
    if(typeof google == "undefined" || typeof googleMaps == "undefined"){
 
        //disableMap();
 
        if(ConnectivityMonitor.isOnline()){
          loadGoogleMaps(elementMap, text, callback);
        }else{
           disableMap();
        }

      }
      else {
        if(ConnectivityMonitor.isOnline()){
         
          initMap(elementMap, text, callback);
          enableMap();
        } else {
          disableMap();
        }
      }
 
      addConnectivityListeners($scope, elementMap, text, callback);
     
 
    },
    buscaPosicion: function(direccion){
        var promise = getDireccionAsync($q, direccion);
        return promise;
      },


  setPosicion: function($scope, map,coorde1,coorde2){   
    
    if(typeof google == "undefined" || typeof googleMaps == "undefined"){
      //  disableMap();
        if(ConnectivityMonitor.isOnline()){
          loadGoogleMapsForConsulta(map,coorde1,coorde2); 
         
        }
    }
    else {
        if(ConnectivityMonitor.isOnline()){
           
          setPosicionMap(map,coorde1, coorde2);
          enableMap();
        } else {
          disableMap();
        }
      }

  }


  }
 
});



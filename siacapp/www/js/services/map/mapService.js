(function(){
	'use strict';

	angular.module('appsiac.services')
	.factory('MapService', ['$q', mapService]);

	function mapService($q){
		var map;
		var marker;
		var geocoder;
		var myLatlng;
    
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

		function getDireccionAsync($q, direccion){
			return $q(function(resolve, reject){
				geocoder.geocode({address: direccion + " San Miguel de Tucuman Tucuman"}, function(results, status) {
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

		return {
			initMap: function(elementMap, text, callback){
				geocoder = new google.maps.Geocoder();
				myLatlng = new google.maps.LatLng(-26.8388,-65.2063);

				var mapOptions = {
				    zoom: 15,
				    center: myLatlng
				}

				map = new google.maps.Map(elementMap, mapOptions);

				  
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
			},

			buscaPosicion: function(direccion){
				var promise = getDireccionAsync($q, direccion);
				return promise;
			},

			setPosicion: function(elementMap,coorde1,coorde2){
			   
		        geocoder = new google.maps.Geocoder();
				myLatlng = new google.maps.LatLng(coorde1,coorde2);

				var mapOptions = {
				    zoom: 15,
				    center: myLatlng,
				    draggable:false
				}

				map = new google.maps.Map(elementMap, mapOptions);

				  
				marker = new google.maps.Marker({
				    position: myLatlng,
				    map: map,
				    draggable: false,
				    title: 'SIAC',
				    label:'Reclamo'
				  //  animation: google.maps.Animation.BOUNCE

				});
			}
		}
	}
})();
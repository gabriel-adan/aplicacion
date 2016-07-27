(function(){
	'use strict';
	angular.module('appsiac.services')

	.factory('ConexionService', ['$rootScope', conectar]);

	function conectar($rootScope){
		return {
			isOnline: function(){
		      	if(ionic.Platform.isWebView()){
		        	return $cordovaNetwork.isOnline();    
		      } else {
		        	return navigator.onLine;
		      }
		    },
		    isOffline: function(){
		      	if(ionic.Platform.isWebView()){
		        	return !$cordovaNetwork.isOnline();    
		      } else {
		        	return !navigator.onLine;
		      }
		    },
		    startWatching: function(onLine, offLine, $scope){
		        if(ionic.Platform.isWebView()){
		          	var onlineEvent = $rootScope.$on('$cordovaNetwork:online', onLine);
		 
		          	var offlineEvent = $rootScope.$on('$cordovaNetwork:offline', offLine);
		 			
		 			$scope.$on('$destroy', function() {
				        onlineEvent();
				        offlineEvent();
				    });
		        }
		        else {
		          	window.addEventListener("online", onLine, true);    
		 
		          	window.addEventListener("offline", offLine, true);

		          	$scope.$on('$destroy', function() {
		          		//window.removeEventListener("online", onLine);
		          		//window.removeEventListener("offline", offLine);
				    });
		        }       
		    }
		}
	}
})();
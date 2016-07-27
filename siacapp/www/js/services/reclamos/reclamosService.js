(function(){
	'use restrict';
	angular.module('appsiac.services')

	.factory('ReclamosService', ['$http', serviceReclamos]);

	function serviceReclamos($http){
		var list = [];

		return {
			listTiposCategorias: function(id_categoria){
				var promise = $http.post('http://siac.smt.gob.ar/apiphp/FrontController.php', {metodo: 'listarTiposCategorias', id_categoria: id_categoria})
					.then(function(res){
						return res.data;
					}, function(err){
						return list;
				});
				return promise;
			},

			listCategories: function(){
				var promise = $http.post('http://siac.smt.gob.ar/apiphp/FrontController.php', {metodo: 'listarCategorias'})
				    .then(function(res){
				      	return res.data;
				    }, function(err){
				    	return [];
				});
				return promise;
			},

			buscarReclamo: function(id_reclamo){
				var promise = $http.post('http://siac.smt.gob.ar/apiphp/FrontController.php', {metodo: 'buscarReclamo', id_reclamo: id_reclamo})
					.then(function(data){
						return data;
					}, function(err){
						return [];
				});
				return promise;
			},
			traerMovimientos: function(id_reclamo){
				var promise = $http.post('http://siac.smt.gob.ar/apiphp/FrontController.php', {metodo: 'traerMovimientos', id_reclamo: id_reclamo})
					.then(function(data){
						return data;
					}, function(err){
						return [];
				});
				return promise;
			},
			ultimaDerivacion: function(id_reclamo){
				var promise = $http.post('http://siac.smt.gob.ar/apiphp/FrontController.php', {metodo: 'traerUltimoMovimientoPorDerivacion', id_reclamo: id_reclamo})
					.then(function(data){
						return data;
					}, function(err){
						return [];
				});
				return promise;
			},
			registrarReclamo: function(reclamo){
				var promise = $http.post('http://siac.smt.gob.ar/apiphp/FrontController.php', {metodo: 'registrarReclamo', reclamo: reclamo})
					.then(function(data){
						return data.data;
					}, function(err){
						return err;
				});
				return promise;
			}
		}
	}
})();
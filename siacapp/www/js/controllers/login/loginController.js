angular.module('appsiac.controllers')

.controller('LoginCtrl', ['$ionicHistory', loginController]);

function loginController($ionicHistory){
	var vm = this;

	vm.user = { user_name: '', password: '' };

	vm.cancel = function(){
		vm.user = { user_name: '', password: '' };
		$ionicHistory.goBack();
	}

	vm.login = function(){
		
	}

	vm.mensaje = '';
}
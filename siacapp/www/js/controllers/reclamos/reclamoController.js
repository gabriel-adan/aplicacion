angular.module('appsiac.controllers')

.controller('ReclamoCtrl', ['$injector', '$timeout', '$scope', '$ionicLoading', 'ConnectivityMonitor', 'GoogleMaps', 'ReclamosService','$ionicPopup', '$cordovaImagePicker', reclamosController]);

function reclamosController($injector, $timeout, $scope, $ionicLoading, ConnectivityMonitor, GoogleMaps, ReclamosService, $ionicPopup, $cordovaImagePicker){
	var vm = this;
	vm.categoria = { id_categoria: 0 };
    vm.tipo = null;
    vm.categorias = [];
    vm.tipos = [];

    vm.tituloCategorias ='Seleccione una Categoría';
    vm.tituloTipos = 'Seleccione un Tipo de Reclamo';

    vm.reclamo = new Reclamo();
    
    var text = document.getElementById('direccion');
	var map = document.getElementById('map');

    $scope.$watch('vm.categoria', function(cat, old) {
        vm.tituloTipos = 'Seleccione un Tipo de Reclamo';
        vm.categoria = cat;
        vm.selectCategoria(cat);
    });

    $scope.$watch('vm.tipo', function(tipo, old) {
        vm.tipo = tipo;
        vm.selectTipoReclamo(tipo);
    });

    if(window.plugins){
        window.plugins.sim.getSimInfo(function(result){
            vm.reclamo.telefono = result.phoneNumber;
        }, function(err){

        });
    }

    GoogleMaps.init($scope, map, text, onDragend);

    if(ConnectivityMonitor.isOnline()){
        ReclamosService.listCategories().then(function(data){
            vm.categorias = data;
        });
    }

    vm.selectCategoria = function(cat){
      	if(cat){
            if(cat.id_categoria){
                vm.reclamo.id_categoria = cat.id_categoria;
                ReclamosService.listTiposCategorias(cat.id_categoria).then(function(data){
                    vm.tipos = data;
                });
            }
        }
    };

    vm.selectTipoReclamo = function(tipo){
        if(tipo){
            if(tipo.id_treclamo){
                vm.reclamo.id_treclamo = tipo.id_treclamo;
            }
        }
    };

    vm.buscarDireccion = function(){
        GoogleMaps.buscaPosicion(document.getElementById('direccion').value)
            .then(function(res){
                vm.reclamo.direccion = res.direccion;
                vm.reclamo.coorde1 = res.position.lat();
                vm.reclamo.coorde2 = res.position.lng();
            }, function(err){
                $ionicPopup.show({ 
                    title: "Dirección no encontrada...\n si la direccion es correcta, considere ingresar 'San Miguel Tucumán' al final",
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'button-positive'
                     }]
                });

            });
    };

    vm.tomarFoto = function(){
        alert("tomar una foto");
    }

    vm.mensaje = '';

    vm.eliminar = function(index){
        vm.srcs.splice(index, 1);
    }

    vm.srcs = [];
    vm.getPhotos = function(){
        var options = {
            maximumImagesCount: 3,
            quality: 100
        };

        $cordovaImagePicker.getPictures(options)
            .then(function(results){
                vm.srcs = results;
            }, function(error){
                vm.mensaje = error;
        });
    }

    vm.enviar = function(){
        if(vm.categoria != null){
            if(vm.categoria.id_categoria == 0){
                $ionicPopup.show({
                    template: ' <div class="card color-vr">'+
                        '<div class="item item-divider color-vr">'+
                        '<i></i>ATENCIÓN</div><div class="alert-mensaje">'+
                        '<p>Por favor seleccione una categoria desde el menú "Categorias: ", ubicado al principio del formulario</p></div></div></div>',
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'btn-alert'
                    }]
                });
                return;
            }
        }

        if(vm.tipo == null){
            
            $ionicPopup.show({
                    template: ' <div class="card color-vr">'+
                        '<div class="item item-divider color-vr">'+
                        '<i></i>ATENCIÓN</div><div class="alert-mensaje">'+
                        '<p>Por favor seleccione el tipo de reclamo que desea realizar, puede hacerlo desde el menú "Tipos de Reclamos: "</p></div></div></div>',
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'btn-alert'
                    }]
                });
            return;
        }

        $ionicLoading.show({
            title: 'Enviando...',
            template: '<ion-spinner class="android"></ion-spinner>'
        });

        ReclamosService.registrarReclamo(vm.reclamo).then(function(id_reclamo){
            $ionicLoading.hide();
            if(id_reclamo > 0){
                vm.reset();
                $ionicPopup.show({ 
                    title: "Su reclamo se registró correctamente \n Su Número de reclamo es: " + id_reclamo,
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'button-positive'
                    }]
                });
            }else{
                $ionicPopup.show({ 
                    title: "No se pudo registrar su reclamo.",
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'btn-alert'
                    }]
                });
            }

        }, function(err){
            $ionicLoading.hide();
            $ionicPopup.show({ 
                title: "Error...no se pudieron enviar los datos.",
                buttons: [{
                    text: 'Aceptar',
                    type: 'btn-alert'
                }]
            });
        });
    };

    vm.reset = function(){
        ReclamosService.listCategories().then(function(data){
            vm.categorias = [];
            vm.categorias = data;
        });
        
        vm.categoria = { id_categoria: 0 };
        vm.tipo = null;
        vm.tipos = [];
        vm.reclamo = new Reclamo();
        vm.tituloCategorias ='Seleccione una Categoría';
        vm.tituloTipos = 'Seleccione un Tipo de Reclamo';
    };

    function onDragend(position){
        vm.buscarDireccion();
    };

    function online(event, networkState){
        if(vm.categorias.length == 0){
            ReclamosService.listCategories().then(function(data){
                vm.categorias = data;
            });
        }
    }

    function offline(event, networkState){
        $ionicPopup.show({ 
            title: "No tiene conexion a internet.",
            buttons: [{ 
                text: 'Aceptar',
                type: 'btn-alert'
            }]
        });
    }
}
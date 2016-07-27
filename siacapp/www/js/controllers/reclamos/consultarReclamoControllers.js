angular.module('appsiac.controllers')

.controller('ConsultarReclamoCtrl', ['$injector', '$scope', '$filter', 'ReclamosService', 'GoogleMaps', '$ionicPopup','$cordovaImagePicker', consultaReclamosController]);

function consultaReclamosController($injector, $scope, $filter, ReclamosService, GoogleMaps, $ionicPopup,$cordovaImagePicker){

    var fechaFormato;
    var vm = this;
    vm.hide=true;
    vm.consulta = new ConsultarReclamo();
    vm.id_reclamo=null;
    vm.srcs = [];
    vm.mensaje = '';
  
    vm.items = null;
    $scope.items=[];
    var clases;

    var icon = document.getElementById('icono_origen');
    var text = document.getElementById('direccion');
    var map = document.getElementById('map');

    vm.master = {};

    vm.buscarReclamo = function(){
        $scope.items=[];  // esta linea funciona...borra la lista de derivaciones, antes de cargar las nuevas
        if(vm.consulta.id_reclamo == null){
              $ionicPopup.show({
                    template: ' <div class="card color-vr">'+
                        '<div class="item item-divider color-vr">'+
                        '<i></i>ATENCIÓN</div><div class="alert-mensaje">'+
                        '<p>Ingrese un n° de reclamo</p></div></div></div>',
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'btn-alert'
                    }]
                });
        }else{
  
          ReclamosService.buscarReclamo(vm.consulta.id_reclamo).then(function(res){
            if(res.status != 200){
               $ionicPopup.show({
                    template: ' <div class="card color-vr">'+
                        '<div class="item item-divider color-vr">'+
                        '<i></i>ATENCIÓN</div><div class="alert-mensaje">'+
                        '<p> No tiene conexión a internet</p></div></div></div>',
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'btn-alert'
                    }]
                });
                return;


            }
            if(!res.data){
                vm.hide = true;
           
                   $ionicPopup.show({
                    template: ' <div class="card color-vr">'+
                        '<div class="item item-divider color-vr">'+
                        '<i></i>ATENCIÓN</div><div class="alert-mensaje">'+
                        '<p>El reclamo N°:</p>'+ vm.consulta.id_reclamo +
                        '<p> no existe</p></div></div></div>',
                    buttons: [{ 
                        text: 'Aceptar',
                        type: 'btn-alert'
                    }]
                });
                return;
            }

            vm.hide = false;//hacemos visible el formulario

            vm.consulta= res.data;
            
           
            vm.consulta.fecha_hora_inicio= Date.parse(res.data.fecha_hora_inicio);

            vm.cargarIconos(vm.consulta.nombre_oreclamo);

          //relacionamos los datos con la vista
           // var map = document.getElementById('map'); 
           vm.mostrarMovimientos();
           GoogleMaps.setPosicion($scope, map,vm.consulta.coorde1, vm.consulta.coorde2);

            
        });

        }}

        vm.cargarIconos=function(nombre_oreclamo){

          /* if(nombre_oreclamo == "Email Oficial"){
                clases=icon.classList.value;
                var clas=clases.substr(5);
                console.log(clas);
                if(clas){
                     icon.classList.remove(clas);
                 }

                icon.classList.add('ion-email-oficial');
            }*/
            if(nombre_oreclamo){
                clases=icon.classList.value;
                var clas=clases.substr(5);
                if(clas){
                     icon.classList.remove(clas);
                 }

                var nombre_oreclamo_clase = nombre_oreclamo.toLowerCase(); 
                nombre_oreclamo_clase = nombre_oreclamo_clase.replace(/ /g,"-");
                nombre_oreclamo_clase = nombre_oreclamo_clase.replace(/á/g,"a");
                nombre_oreclamo_clase = nombre_oreclamo_clase.replace(/é/g,"e");
                nombre_oreclamo_clase = nombre_oreclamo_clase.replace(/í/g,"i");
                nombre_oreclamo_clase = nombre_oreclamo_clase.replace(/ó/g,"o");
                nombre_oreclamo_clase = nombre_oreclamo_clase.replace(/ú/g,"u");
                var clase_agregada = "ion-" + nombre_oreclamo_clase;
                icon.classList.add(clase_agregada);
            }
            
        }
       
        vm.mostrarFotos = function(){
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


        vm.mostrarMovimientos =function(){
            var contador=0;
                  

            ReclamosService.traerMovimientos(vm.consulta.id_reclamo).then(function(res){
                if(!res.data || res.data.id_derivacion < 0 ){
                    return;
                }
                
                id_derivacion_ant = res.data.id_derivacion;  
                angular.forEach(res.data, function(value, key){
                contador = contador + 1;
               
                         
                if(value.id_derivacion != id_derivacion_ant || contador == 1 ){
                    id_derivacion_ant = value.id_derivacion;
                    vm.consulta.nombre_estado=value.nombre_estado;
                    vm.consulta.nombre_oficina=value.nombre_oficina;
               
                    vm.consulta.nombre_reparti=value.nombre_reparti;
                    vm.consulta.fecha_egreso=value.fecha_egreso;
                    vm.consulta.fecha_ingreso=value.fecha_ingreso;

                if(vm.consulta.fecha_egreso != "0000-00-00 00:00:00" ) {
                    vm.consulta.fecha=Date.parse(vm.consulta.fecha_egreso);
                }else{
                    if(vm.consulta.fecha_ingreso != "0000-00-00 00:00:00" ){
                        vm.consulta.fecha=Date.parse(vm.consulta.fecha_ingreso); 
                    }else{
                        vm.consulta.fecha = "";  
                    }
                }
                 
                
                 if(vm.consulta.fecha_egreso==""){
                    vm.consulta.fecha="";
                 }
                 
                 if(value.id_estado > 3){

                    vm.consulta.detalle_movi = "Detalle:" + value.detalle_movi+" -";
                    
                 }else{
                    vm.consulta.detalle_movi="";
                 }

                 vm.consulta.fecha = $filter('date')(vm.consulta.fecha, "dd/MM/yyyy 'a las' h:mm:ssa"); 
                 $scope.items.unshift(vm.consulta.nombre_estado +" :"+vm.consulta.fecha+"-"+vm.consulta.detalle_movi+ "  en " + vm.consulta.nombre_oficina +" - "+vm.consulta.nombre_reparti);
               
                 //unshift funciona como el push pero este agrega los elementos arriba de la lista a medida que los lee-- como una pila              
                }
            });
        })
    };
}
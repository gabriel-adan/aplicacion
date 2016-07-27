angular.module('components', [])

.component('combobox', {
	templateUrl: 'js/components/combobox/templates/combo-template.html',
	controller: comboCtrl,
	bindings: {
		title: '=',
		items: '=',
		itemtemplate: '@',
		selecteditem: '=',
		fieldshow: '@'

	}
}).component('comboboxItem', {
	bindings: {
		item: '='
	}
});

function comboCtrl($scope, $ionicPopover){
	$ionicPopover.fromTemplateUrl('combo-template.html', {
        scope: $scope,
	    }).then(function(popover) {
	        $scope.popover = popover;
	});

	this.onSelectedItem = function(item, field, id){
		
		var element = document.getElementById(id+'');

		var icon = angular.element(element.querySelector('.icon-item'))[0];

		var x = document.getElementById(id).parentNode;

		var list = x.childNodes

		deselected(list);

		selected(icon);
		
		this.selecteditem = item;
		$scope.popover.hide();
		this.title = item[field];
	};
}

function deselected(elements){
	angular.forEach(elements, function(e, key){
		if(e.querySelector != undefined){
			var icon_selected = angular.element(e.querySelector('.icon-item'))[0];
			icon_selected.classList.remove('ion-android-checkbox-outline');
			icon_selected.classList.add('ion-android-checkbox-outline-blank');
		}
	});
}

function selected(icon){
	if(icon){
		icon.classList.remove('ion-android-checkbox-outline-blank');
		icon.classList.add('ion-android-checkbox-outline');
	}
}
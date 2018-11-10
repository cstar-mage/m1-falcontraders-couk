//re-add Magento 1.9 minicart class after removing it via the ajaxcart layout xml
var Minicart = Class.create();
Minicart.prototype = {initialize: function(){},init: function() {}}

function dispatchBlockUpdates(response){
	if (response.update_section.html_cart_link) {
		var str = response.update_section.html_cart_link;
		var pattern = /[0-9]+/g;
		var count = str.match(pattern);
		if (jQueryAC('#header .header-minicart .count', ajaxcart.updateWindow.document).length>0 && count!=null) {
			jQueryAC('#header .header-minicart .count', ajaxcart.updateWindow.document).parent().removeClass('no-count');
			jQueryAC('#header .header-minicart .count', ajaxcart.updateWindow.document).text(count);
		} else {
			jQueryAC('#header .header-minicart .count', ajaxcart.updateWindow.document).parent().addClass('no-count');
		}
	}
}
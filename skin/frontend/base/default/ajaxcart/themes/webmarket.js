function dispatchLiveUpdates(type, element){
	if (type=='cart_sidebar') {
		if(jQueryAC('#'+ajaxcart.cartSidebar + '0').length > 0 && jQueryAC('#ajaxcart-actions').length > 0){
			jQueryAC("#" + ajaxcart.cartSidebar + "0" + " #ajaxcart-actions").appendTo(jQueryAC(".proceed").first());
		}
	}
}
function dispatchBlockUpdates(response){
	if (response.update_section.html_cart) {
		if(jQueryAC('#'+ajaxcart.cartSidebar + '0').length > 0 && jQueryAC('#ajaxcart-actions').length > 0){
			jQueryAC("#" + ajaxcart.cartSidebar + "0" + " #ajaxcart-actions").appendTo(jQueryAC(".proceed").first());
		}
	}
}
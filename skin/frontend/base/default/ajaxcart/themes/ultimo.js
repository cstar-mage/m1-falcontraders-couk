Event.observe(window, 'load', function() { 
	if (jQueryAC('.ac-product-list').length>0) {
		jQueryAC('.ajaxcart-qty').each(function() {
			jQueryAC(this).css({'opacity':1});
			jQueryAC(this).removeClass('display-onhover');
		});
	}
});

function dispatchLiveUpdates(type, element){
	if (type=='cart_sidebar') {
		if(jQueryAC('#'+ajaxcart.cartSidebar + '0').length > 0 && jQueryAC('#ajaxcart-actions').length > 0){
			jQueryAC("#" + ajaxcart.cartSidebar + "0" + " #ajaxcart-actions").appendTo(jQueryAC(".block-content-inner").first());
		}
	} else if (type=='list_item') {
		jQueryAC(element).find('.ajaxcart-qty').addClass('display-onhover');
		if (jQueryAC(element).find('.ui-draggable .alt-img').length>0) {
			jQueryAC(element).find('.ui-draggable').css({'position':'absolute','top':'0','left':'0'});
		}
		Event.observe(window, 'load', function() { 
			jQueryAC(element).find('.ajaxcart-qty').addClass('display-onhover');
			if (jQueryAC(element).find('.ui-draggable .alt-img').length>0) {
				jQueryAC(element).find('.ui-draggable').css({'position':'absolute','top':'0','left':'0'});
			}
		});
	}
}
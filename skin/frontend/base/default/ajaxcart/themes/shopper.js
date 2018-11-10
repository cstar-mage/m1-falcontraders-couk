function dispatchLiveUpdates(type, element){
	if (type=='list_item') {
		if (jQueryAC(element).find('.hover .ajaxcart-qty').length==0) {
			jQueryAC(element).find('.regular .ajaxcart-qty').insertAfter(".hover .button-container");
		}
		jQueryAC('.regular .ajaxcart-qty').remove();
		Event.observe(window, 'load', function() { 
			if (jQueryAC(element).find('.hover .ajaxcart-qty').length==0) {
				jQueryAC(element).find('.regular .ajaxcart-qty').insertAfter(".hover .button-container");
			}
			jQueryAC('.regular .ajaxcart-qty').remove();
		});
	}
}

function dispatchJump(imageContainerClone){
	jQueryAC("#ac-popup-top-bkg").css({'display':'none'})
}


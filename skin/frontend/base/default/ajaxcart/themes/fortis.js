function dispatchLiveUpdates(type, element){
	if (type=='list_item') {
		if (jQueryAC(element).find('.ui-draggable .alt-img').length>0) {
			jQueryAC(element).find('.ui-draggable').css({'position':'absolute','top':'0','left':'0'});
		}
		Event.observe(window, 'load', function() { 
			if (jQueryAC(element).find('.ui-draggable .alt-img').length>0) {
				jQueryAC(element).find('.ui-draggable').css({'position':'absolute','top':'0','left':'0'});
			}
		});
	}
}
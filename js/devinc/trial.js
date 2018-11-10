Event.observe(window, 'load', function() { 
	$$('#system_config_tabs a').each(
	    function (index) {           
		    if (index.href.indexOf('/system_config/edit/section/devinc_license/') != -1 && index.up().up().childElements().length==3) {     
	        	Element.remove(index.up());
	        }
	    }
	)
});
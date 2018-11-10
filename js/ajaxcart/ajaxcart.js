var AjaxcartTools = Class.create();
AjaxcartTools.prototype = {
	initialize: function(){
		this.browserTypeIE = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) ? true : false;
		this.browserVersion = jQueryAC.browser.version;
		this.runLoader = false;
		this.runHidePopup = true;
	},	  
    
	showPopup: function(id,action){
		//reposition popup;
		var block = jQueryAC('#'+id+'-popup-content');
		var blockContainer = jQueryAC('#'+id+'-popup-container');
		var viewport = document.viewport.getDimensions(); // Gets the viewport as an object literal
		var width = viewport.width; // Usable window width
		var height = viewport.height; // Usable window height
		
		var boxHeight = block.height();
		var boxWidth = block.width();
		
		var top = boxHeight/2;
	
	    if (boxHeight>=height){
	    	blockContainer.css({'position' : 'absolute'});
	    	block.css({'top' : '0%' });
	    	block.css({'margin' : '50px auto 50px' });
	    	jQueryAC('html,body').animate({ scrollTop: 0 }, 'slow');
			
			var documentHeight = jQueryAC(document).height();
	    	blockContainer.css({'height' : documentHeight+"px"});
	    } else {
	    	blockContainer.css({'position' : 'fixed'});
	    	block.css({'top' : '50%', 'margin' : '-'+top+'px auto 0'});
			
			var documentHeight = jQueryAC(document).height();
	    	blockContainer.css({'height' : 100+"%"});
	    }	
		
		//start petal loader		
		if (id=='ajaxcart-loading') {		
			this.runLoader = true;			
			ajaxcartTools.initPetal('#petal-1', 0.10, 90, false);    
			ajaxcartTools.initPetal('#petal-2', 0.05, 90, true);   
			ajaxcartTools.initPetal('#petal-3', 0.10, 0, true); 
		}	
					
		//display success buttons
		if (id=='success' && action){
			this.countdownTimer(ajaxcart.autohideTime);
			jQueryAC('#success-'+action+'-button').css({'display':'inline-block'});
			if (action=='cart' && ajaxcart.showCheckoutButton == 1) {
				jQueryAC('#success-checkout-button').css({'display':'inline-block'});
			}
		}
		
		//show popup
	    blockContainer.css({'left' : '0'});
				
		//run scale up effect
		if (id!='ajaxcart-loading') {		
			if (!ajaxcart.isMobile && !ajaxcart.isTablet && (!ajaxcartTools.browserTypeIE || (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == 10))) {	
		 		jQueryAC('#'+id+'-popup-content').addClass('grow');
		 		setTimeout(function(){ jQueryAC('#'+id+'-popup-content').addClass('shrink-to-normal'); }, 200);
		 	} else if (ajaxcart.isMobile || ajaxcart.isTablet) {
			 	jQueryAC('#'+id+'-popup-content').addClass('grow-mobile');
		 	} else {
			 	jQueryAC('#'+id+'-popup-content').addClass('shrink-to-normal');
		 	}
		 	
		    			 	
		 	//add popup background if enabled
			if (ajaxcart.showNotificationBkg == 1 && ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 8) {					
		    	jQueryAC('#ac-popup-wrapper-bkg').show();
			} else if (ajaxcart.showNotificationBkg == 1) {				
		    	jQueryAC('#ac-popup-wrapper-bkg').show();
		    	jQueryAC('#ac-popup-wrapper-bkg').animate({'backgroundColor': 'rgba(' + ajaxcart.notificationWrapperBkg + ', 0.6)'},ajaxcart.successPopupDelay);	
			}
		}
	},

	hidePopup: function(id, instant){	
		if (this.runHidePopup && (!instant || (instant && !ajaxcart.ajaxCartRunning && !ajaxcartLogin.ajaxCartLoginRunning))) {			
			if (ajaxcart.showNotificationBkg == 1 && id!='ajaxcart-loading' && (id!='options' || (id=='options' && instant) || (id=='options' && ajaxcart.showNotification != 1)) && (id!='ajaxcart-login' || (id=='ajaxcart-login' && instant) || (id=='ajaxcart-login' && ajaxcart.showNotification != 1))) {	
		   		jQueryAC('#ac-popup-wrapper-bkg').hide();				
				jQueryAC('#ac-popup-wrapper-bkg').css({'backgroundColor': 'transparent'});
			} 

			var blockContainer = jQueryAC('#'+id+'-popup-container');
			
			if (id != 'ajaxcart-loading') {
				if (instant) {				
					jQueryAC('#'+id+'-popup-content').removeClass('grow');	
					jQueryAC('#'+id+'-popup-content').removeClass('grow-mobile');
					jQueryAC('#'+id+'-popup-content').removeClass('shrink-to-normal');
				 	blockContainer.css({ "left" : '-999999px' }); 
				 	
					//clear options popup content
					if (id == 'options') {
						jQueryAC('#ajaxcart-options').html('');
					}
				} else {
					//hide popup
				 	jQueryAC('#'+id+'-popup-content').addClass('shrink');
				 	setTimeout(function() { 		 		
						//hide popup
				 		blockContainer.css({ "left" : '-999999px' }); 
				 		jQueryAC('#'+id+'-popup-content').removeClass('shrink'); 
						jQueryAC('#'+id+'-popup-content').removeClass('shrink-to-normal');
						jQueryAC('#'+id+'-popup-content').removeClass('grow');	
						jQueryAC('#'+id+'-popup-content').removeClass('grow-mobile');	
						
						//clear options popup content
						if (id == 'options') {
							jQueryAC('#ajaxcart-options').html('');
						}
				 	}, ajaxcart.successPopupDelay);
				 }
			} else if (jQueryAC('#'+id+'-popup-container').css("left")=='0px') {
				ajaxcart.successPopupDelay = 300;

				//stop petal loader			
			 	jQueryAC('#'+id+'-popup-content').addClass('shrink');
			 	setTimeout(function() { 
			 		//reset to the initial state before stopping the loader		 		
					ajaxcartTools.resetPetals();
			 		
					//hide popup
			 		blockContainer.css({ "left" : '-999999px' }); 
			 		jQueryAC('#'+id+'-popup-content').removeClass('shrink'); 
			 	}, 300);
			}		
		
			//hide success buttons
			if (id == 'success') {
				var adjustDelay = 10;
				if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 9) {
					adjustDelay = 50;
				}
				setTimeout(function() { 
					jQueryAC('#success-cart-button').css({'display':'none'});
					jQueryAC('#success-checkout-button').css({'display':'none'});
					jQueryAC('#success-compare-button').css({'display':'none'});				
					jQueryAC('#success-wishlist-button').css({'display':'none'});
					ajaxcartTools.deactivateTimer();
					
					//clear popup messages
					jQueryAC('#ajaxcart-layout-messages').html(''); 
					jQueryAC('#ajaxcart-custom-block').html(''); 
					jQueryAC('#ajaxcart-product-images').html(''); 
				}, (ajaxcart.successPopupDelay-adjustDelay));
			}	
		} else {
			ajaxcartTools.runHidePopup = true;
		}
	},

	setLoadWaiting: function(step, enabled) {
		if (step == 'ajaxcart-loading'){
			if (!ajaxcart.addToCartButton){
				if (enabled) {
					this.showPopup('ajaxcart-loading', false);				
				} else {
					this.hidePopup('ajaxcart-loading', false);

					//enable all buttons, inputs, links etc.
					jQueryAC('#ac-popup-top-bkg').hide();
				}			
			} else {
				if (enabled) {
					var cartButton = jQueryAC(ajaxcart.addToCartButton);
					if (cartButton) {	   
						cartButton.replaceWith(ajaxcart.ajaxCartLoadingHtml); 
					}	
				} else {
					if (jQueryAC('#ajax-cart-please-wait').length > 0 && (ajaxcart.hasError || jQueryAC('#product_addtocart_form').length > 0)) {	   
						jQueryAC('#ajax-cart-please-wait').replaceWith(ajaxcart.addToCartButton.outerHTML);
					}					
					ajaxcart.hasError = false;
					ajaxcart.addToCartButton = false;
					//enable all buttons, inputs, links etc.
					jQueryAC('#ac-popup-top-bkg').hide();
				}		
			}
		} else if (jQueryAC('#'+step+'-buttons-container').length > 0) {
			if (enabled) {
				var container = jQueryAC('#'+step+'-buttons-container');
				container.addClass('disabled');
				container.css({opacity:.5});
				Element.hide('login-button');
				Element.show(step+'-please-wait');
			} else {
				var container = jQueryAC('#'+step+'-buttons-container');
				container.removeClass('disabled');
				container.css({opacity:1});
				Element.hide(step+'-please-wait');
				Element.show('login-button');

				//enable all buttons, inputs, links etc.
				jQueryAC('#ac-popup-top-bkg').hide();
			}		
		}
	},

	resetLoadWaiting: function(step){
		this.setLoadWaiting(step,false);
		ajaxcart.ajaxCartRunning = false;
	},		
	
	//petal loader functions
	initPetal: function(id, speed, startDegree, rotateClockwise) {
		if (this.runLoader && jQueryAC(id).length>0) {
		    startDegree += speed;
		
		    var r = 30;	    
		    var xcenter = parseInt(jQueryAC('#ajaxcart-loading-popup-content').css('width'))/2; // Usable window width
			var ycenter = parseInt(jQueryAC('#ajaxcart-loading-popup-content').css('height'))/2; // Usable window height
			
			if (rotateClockwise) {
			    var newLeft = Math.floor(xcenter + -(r* Math.cos(startDegree)));
				var newTop = Math.floor(ycenter + -(r * Math.sin(startDegree)));
			} else {
			    var newLeft = Math.floor(xcenter + -(r* Math.sin(startDegree)));
				var newTop = Math.floor(ycenter + -(r * Math.cos(startDegree)));			
			}
					
			var Angle = Math.atan2((ycenter - newTop), (xcenter - newLeft)) * (180 / Math.PI)-90;
	
		    jQueryAC(id).css({'transform':'rotate('+Angle+'deg)'});
		    jQueryAC(id).animate({
		        top: newTop,
		        left: newLeft
		    }, 10, function() {
		        ajaxcartTools.initPetal(id, speed, startDegree, rotateClockwise)
		    });	   
		}
	},
	
	resetPetals: function() {
		ajaxcartTools.runLoader = true;
		ajaxcartTools.initPetal('#petal-1', 0.10, 90, false);    
		ajaxcartTools.initPetal('#petal-2', 0.05, 90, true);   
		ajaxcartTools.initPetal('#petal-3', 0.10, 0, true); 
		ajaxcartTools.runLoader = false;
	},
	
	//automatically close success popup functions	
	countdownTimer: function(closeTime){
	    jQueryAC("#countdownToClose").html(" (" + ajaxcart.autohideTime + ")");
	    
	    var closeValue = parseInt(closeTime) - 1;
	    this.countdown = setInterval(function(){
	    	jQueryAC("#countdownToClose").html(" (" + closeValue + ")");
	    	if (closeValue == 0) {
	    		clearInterval(ajaxcartTools.countdown); 
	    		ajaxcartTools.hidePopup('success', true);
	    	} else {
	    		closeValue--;
	    	}
	    }, 1000);
	},
	
	deactivateTimer: function(){
	    clearInterval(ajaxcartTools.countdown);
	},

	jump: function(productId, block, button) {
		// && (!ajaxcartTools.browserTypeIE || (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion != 9))
		if (!ajaxcart.itemDropped && ajaxcart.jump == 1 && block.length > 0) {
			if (!button) {
				var productImageContainer = jQueryAC('div[product="'+productId+'"]').first();
			} else {
				var productImageContainer = jQueryAC(button).closest(".ac-product-list").find('div[product="'+productId+'"]').first();
			}
			if (productImageContainer.length>0) {
				var productContainerWidth = productImageContainer.width();
				var productContainerHeight = productImageContainer.height();
				var clone = productImageContainer.clone();
				jQueryAC('body').append(clone); 			


				clone.find('.draggable-bkg').remove();
				var imgContainerStyle = productImageContainer.attr('style');
				clone.attr('style', imgContainerStyle);

				var productImageOffset = productImageContainer.offset();
				var yStart = Math.round(productImageOffset.top-clone.offset().top);
				var xStart = Math.round(productImageOffset.left-clone.offset().left);

				clone.css({'position':'absolute','visibility':'hidden'});

				//hide original product image
				productImageContainer.addClass('round');
				setTimeout(function() { 
					productImageContainer.css({'visibility' : 'hidden', 'transform' : 'scale(0)'});
				}, 300);

				setTimeout(function() { clone.addClass('jump-shrink'); },10);

				if ((window.opera && opera.version()<13) || (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 9)) {
					setTimeout(function() { clone.find('img').effect("scale", {percent:0, origin:['middle','center']}, 400, function callback() { clone.hide(); }) }, 700);
				}

				setTimeout(function() {		
					clone.css({'position':'relative','visibility':'visible'});

					//get the visible sidebar block				   
					var sidebarBlock = false;
					block.children().each(function() {
						if (jQueryAC(this).is(':visible')) {
							sidebarBlock = jQueryAC(this);
							return false;
						}
					});	
					if (!sidebarBlock) {
						if (block.prev().length > 0) {
							var checkElement = block.prev();
						} else if (block.parent().length > 0) {
							var checkElement = block.parent();
						}

						while (!sidebarBlock) {
							if (checkElement.is(':visible')) {
								sidebarBlock = checkElement;
							}
							if (checkElement.prev().length > 0) {
								var checkElement = checkElement.prev();
							} else if (checkElement.parent().length > 0) {
								var checkElement = checkElement.parent();
							} else {
								break;
							}
						}
					}

					var blockSidebarOffset = sidebarBlock.offset();

				    var xEnd = blockSidebarOffset.left+sidebarBlock.width()/2-productContainerWidth/2;
				    var xMiddle = (blockSidebarOffset.left-xStart)/2+xStart;

				    var yEnd = blockSidebarOffset.top + sidebarBlock.height()/2 - productImageOffset.top + yStart - productContainerHeight/2;

				  	if ((blockSidebarOffset.top-jQueryAC(document).scrollTop())>250) {
				  		if (productImageOffset.top>blockSidebarOffset.top) {
				    		var yMiddle = yEnd-250;
				    	} else {
				    		var yMiddle = yStart - productContainerHeight/2-250;
				    	}
				    } else {
				    	var yMiddle = yEnd-(blockSidebarOffset.top-jQueryAC(document).scrollTop());
				    }

				    ajaxcart.dragContainer = clone;			    
				    clone.animate(
						{crSpline: jQueryAC.crSpline.buildSequence([[xStart, yStart], [xMiddle, yMiddle], [xEnd, yEnd]])}, 
						800,
						function() {
							clone.remove();
							//show original product image
							if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion >= 11) {
								productImageContainer.fadeIn();
							} else {
								productImageContainer.show();							
							}
							productImageContainer.removeClass('round');
							productImageContainer.removeAttr('style');
							productImageContainer.attr('style', imgContainerStyle);
							productImageContainer.find('img').removeAttr('style');
						}
					);
				}, 300);

				ajaxcart.updateWindow.dispatchJump(clone);
			}
		}
	},
	
	updateSection: function(content, id) {
        var js_scripts = content.extractScripts();
        content = content.stripScripts();        
        
        var updateWindow = ajaxcart.updateWindow;
        if (id == 'ajaxcart-login-popup-content' || id == 'ajaxcart-options' || id == ajaxcart.comparePopup) {
        	updateWindow = window;
        }
        
        var updateElement = updateWindow.document.getElementById(id);		
		jQueryAC(updateElement).html(content);

        if (js_scripts != null && js_scripts != ''){
			for (var i=0; i< js_scripts.length; i++){
				if (typeof(js_scripts[i]) != 'undefined'){
					var js_script = js_scripts[i];
					this.jsEval(js_script, updateWindow);
					
					//reinitialize the ajaxcart js for the compare popup as well (not just the parent window); runs when ajax login is called from the compare popup
					if (id == 'ajaxcart-qty-js' && window.opener!=null) {
						this.jsEval(js_script, window);
					}
				}
			}		
		}
	},
	
	//evaluates the scripts from the content of an ajax request
	jsEval: function(src, updateWindow){
    	if (updateWindow.execScript) {
    	    updateWindow.execScript(src);
    	    return;
    	}
    	var run = function() {
    	    updateWindow.eval.call(updateWindow,src);
    	};
    	run();
	},
	
    //extract jquery events
	extractBindings: function(blockId){
	    var eventsArray = new Array();
		if (typeof jQuery != 'undefined') {  
			eventsArray['total'] = 0;
			jQueryAC('#'+blockId).find('*').each(function() {
				var kid = jQueryAC(this),
					elementEvents;
				if (kid.attr('class')) {
					if (elementEvents = jQuery._data(document.getElementsByClassName(kid.attr('class'))[0], "events")) {
						eventsArray[eventsArray['total']] = new Array();
			    		eventsArray[eventsArray['total']]['events'] = elementEvents;
			    		eventsArray[eventsArray['total']]['class'] = kid.attr('class');
			    		eventsArray['total'] = eventsArray['total'] + 1;
			    	}
			    }
			    if (kid.attr('id')) {
			    	if (elementEvents = jQuery._data(document.getElementById(kid.attr('id')), "events")) {
						eventsArray[eventsArray['total']] = new Array();
			    		eventsArray[eventsArray['total']]['events'] = elementEvents;
			    		eventsArray[eventsArray['total']]['id'] = kid.attr('id');
			    		eventsArray['total'] = eventsArray['total'] + 1;
			    	}
			    }					    
			});
		}

		return eventsArray;
	},
	
    //re-apply jquery events
	reapplyBindings: function(bindings){
    	//extract jquery events
		if (typeof jQuery != 'undefined' && bindings.length>0) {  
			for (var k = 0; k < bindings['total']; k++) {
				var events = bindings[k]['events'];
				var identifier;
				if (bindings[k]['class']) {
					identifier = '.'+bindings[k]['class'];
				} else if (bindings[k]['id']) {
					identifier = '#'+bindings[k]['id'];
				}
				jQuery.each(events, function(l, event) {
				    var action = l;
				    jQuery.each(event, function(j, h) {
					    jQuery(identifier).on(action,h.handler);
				    });
				});
			};
		}
	},

	preloadImages: function(content) {	
		for (var i=0;i<content.length;i++) {
	    	if (content[i]) {					
	    	    var source = (content[i] || '').toString();
	    	    var urlArray = [];
	    	    var url;
	    	    var matchArray;
	    	
	    	    // Regular expression to find FTP, HTTP(S) and email URLs.
	    	    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
	    	
	    	    // Iterate through any URLs in the content.
	    	    while( (matchArray = regexToken.exec( source )) !== null )
	    	    {
	    	        var token = matchArray[0];
	    	        if (token.indexOf('/thumbnail/') != -1) {
	    	        	urlArray.push( token );
	    	        }
	    	    }
	    		
	    		//preloading the images in the dom
	    		var images = new Array();
	    		for (var j = 0, il = urlArray.length; j < il; j++) {
	    		    images[j] = new Image();
	    		    images[j].src = urlArray[j];
	    		}
	    	}
	    }
	},
	
	getProductIdFromUrl: function(url,param){
		var urlArray = url.split("/");
		var productIdKey = 0;
		for (var i=0;i<urlArray.length;i++){
			if (urlArray[i] == param){
				productIdKey = i+1;
				break;
			}
		}
		return urlArray[productIdKey];
	},

	//sets the viewport meta tag for mobile devices
	setViewportMeta: function() {
		var viewportMeta = jQueryAC('meta[name="viewport"]').attr('content');
		if (viewportMeta!=undefined) {
			var viewportMetaArray = viewportMeta.split(',');
			for (var i = viewportMetaArray.length - 1; i >= 0; i--) {
				if (viewportMetaArray[i].indexOf('width=') != -1) {
					viewportMetaArray[i] = 'width='+window.innerWidth+'px';
				}
				if (viewportMetaArray[i].indexOf('height=') != -1) {
					viewportMetaArray[i] = 'height='+window.innerHeight+'px';
				}
			};
			viewportMetaString = viewportMetaArray.join(',');
			jQueryAC('meta[name="viewport"]').attr('content', viewportMetaString);
		} else {
			jQueryAC('head').append('<meta name="viewport" content="width='+window.innerWidth+'px,height='+window.innerHeight+'px"/> ');
		}
	},	

	//this function is used to load the animated cart/compare/wishlist icons from the drag and drop floaters
	runLivicons: function() {
		var dN="drag",dS=50,dC="#ffffff",dHC="#ffffff",dCCOH=false,dET="hover",dA=true,dL=false,dOP=false,mD=200,hD=200,aC="ac-activeicon",aPC="ac-active",dAC="#ffffff",lDI=JSON.stringify({"drag":{"d":800,"it":1,"sh":[{"i":{"a":{"p":"M13.238,9.045l-0.07,0.997c-1.654-0.116-3.105,0.164-4.533,0.799L8.228,9.928C9.848,9.208,11.454,8.92,13.238,9.045zM3.068,14.916l0.898,0.437c0.697-1.427,1.636-2.564,2.959-3.526L6.34,11.019C4.922,12.049,3.864,13.288,3.068,14.916zM2.323,22.053l0.97-0.242c-0.38-1.527-0.401-3.01,0-4.604l-0.971-0.243C1.894,18.695,1.892,20.319,2.323,22.053zM6.34,27.999l0.586-0.809c-1.266-0.922-2.231-2.034-2.959-3.527l-0.898,0.438C3.825,25.65,4.855,26.919,6.34,27.999zM13.238,29.973l-0.07-0.996c-1.608,0.109-3.062-0.143-4.535-0.801l-0.406,0.913C9.891,29.83,11.497,30.092,13.238,29.973zM19.791,27.05l-0.693-0.718c-1.154,1.111-2.427,1.855-3.988,2.302l0.275,0.96C17.092,29.104,18.506,28.289,19.791,27.05zM22.933,20.599l-0.993-0.104c-0.165,1.56-0.653,2.966-1.575,4.326l0.828,0.559C22.219,23.858,22.747,22.327,22.933,20.599zM21.192,13.637l-0.827,0.559c0.865,1.288,1.403,2.675,1.574,4.327l0.993-0.105C22.742,16.592,22.154,15.068,21.192,13.637zM15.384,9.423l-0.273,0.96c1.496,0.431,2.807,1.155,3.986,2.303l0.694-0.72C18.491,10.712,17.084,9.914,15.384,9.423z","s":"none","fl":"#333"}},"f":{}},{"i":{"a":{"p":"M30,12.5C30,18.299,25.299,23,19.5,23S9,18.299,9,12.5S13.701,2,19.5,2S30,6.701,30,12.5z","s":"none","t":"t0,0","o":1,"fl":"#333"}},"f":{"50":{"t":"t22,-14","e":"<"},"51":{"o":0},"60":{"t":"t0,0"},"90":{},"100":{"o":1}}}]},"balance":{"d":1200,"it":1,"sh":[{"i":{"a":{"p":"M6.024,15.772c-1.138,0.775-2.946,3.878-2.5,4.83c0.658,1.409,5.168,2.218,6.793,0.124c0.851-1.091-1.178-4.266-2.376-4.954c-0.006-0.434,1.125-1.5,1.125-1.5s-1.406,0.094-1.594,0.437c0-0.656,0.136-1.104,0.136-1.104s-1.011,0.511-0.979,1.104c-0.375-0.562-1.688-0.812-1.688-0.812S6.049,15.173,6.024,15.772z","s":"none","o":1,"t":"t0,-24","fl":"#333"}},"f":{"20":{"t":"t0,3"},"30":{},"50":{"t":"t0,-2"},"55":{},"65":{"t":""},"80":{},"85":{"o":0},"90":{"t":"t0,-24"},"95":{"o":1},"100":{}}},{"i":{"a":{"p":"M27,14.888C27,14.397,26.463,14,25.801,14h-1.602C23.537,14,23,14.397,23,14.888C23,15.379,23.276,16,23.552,16s0.5,0.243,0.5,0.488S23.827,17,23.552,17S23,17.478,23,18.067v2.86c0,0.59,0.537,1.066,1.199,1.066h1.602c0.662,0,1.199-0.477,1.199-1.066v-2.86C27,17.478,26.775,17,26.5,17S26,16.733,26,16.488S26.225,16,26.5,16S27,15.379,27,14.888z","s":"none","o":1,"t":"t0,-24","fl":"#333"}},"f":{"30":{},"50":{"t":"t0,2"},"55":{},"65":{"t":""},"80":{},"85":{"o":0},"90":{"t":"t0,-24"},"95":{"o":1},"100":{}}},{"i":{"a":{"p":"M8,5H7l4,15.003H3L7,5H6L2,20.003v1.002C2,22.11,4.237,24,7,24s5-1.89,5-2.995c0-0.865,0-1.002,0-1.002L8,5z","t":"","s":"none","fl":"#333"}},"f":{"10":{},"20":{"t":"t0,3"},"30":{},"50":{"t":"t0,-2"},"55":{},"65":{"t":""},"100":{}}},{"i":{"a":{"p":"M26,5h-1l4,15.002h-8L25,5h-1l-4,15.002v1.002C20,22.109,22.237,24,25,24s5-1.891,5-2.996c0-0.865,0-1.002,0-1.002L26,5z","t":"","s":"none","fl":"#333"}},"f":{"10":{},"20":{"t":"t0,-3"},"30":{},"50":{"t":"t0,2"},"55":{},"65":{"t":""},"100":{}}},{"i":{"a":{"p":"M25.801,6H6.2C5.537,6,5,5.552,5,5s0.537-1,1.2-1h19.601C26.463,4,27,4.447,27,5S26.463,6,25.801,6z","t":"","s":"none","fl":"#333"}},"f":{"10":{},"20":{"t":"r-15,16,5"},"30":{},"50":{"t":"r10,16,5"},"55":{},"65":{"t":""},"100":{}},"fIE":{"10":{},"20":{"t":"r-15,14.5,3.5"},"30":{},"50":{"t":"r10,14.5,3.5"},"55":{},"65":{"t":""},"100":{}}},{"i":{"a":{"p":"M18,26.102V3.2C18,2.537,17.463,2,16.801,2h-1.602C14.537,2,14,2.537,14,3.2v22.901c-4.007,0.408-7,1.943-7,2.896c0,0.863,0,0.987,0,1h18v-1C25,28.045,22.007,26.51,18,26.102z","s":"none","fl":"#333"}},"f":{}}]},"heart":{"d":300,"it":3,"sh":[{"i":{"a":{"p":"M25.953,7.275c-2.58-2.534-6.645-2.382-9.38,0.3l-0.599,0.598l-0.599-0.599c-2.736-2.682-6.798-2.833-9.38-0.299c-2.583,2.531-2.735,6.699,0,9.38l9.979,9.879l10.079-9.879C28.788,13.974,28.538,9.806,25.953,7.275z","t":"","s":"none","fl":"#333"}},"f":{"20":{"t":"s1.2"},"90":{"t":""},"100":{}}}]},"shopping-cart":{"d":1000,"it":1,"sh":[{"i":{"a":{"p":"M9.428,19C9.192,19,9,18.792,9,18.536V14.9h3.1V19H9.428zM17,18.536V14.9h-4.1V19h3.671C16.808,19,17,18.792,17,18.536zM9.428,11C9.192,11,9,11.191,9,11.429V14.1h3.1V11H9.428zM16.571,11H12.9v3.1H17v-2.671C17,11.191,16.809,11,16.571,11z","t":"t-5,-20","s":"none","fl":"#333"}},"f":{"20":{"t":""},"50":{},"80":{"t":"t26,0"},"90":{"t":"t26,-20"},"100":{"t":"t-5,-20"}}},{"i":{"a":{"p":"M18.428,19C18.191,19,18,18.792,18,18.536V14.9h3.1V19H18.428zM26,18.536V14.9h-4.1V19h3.671C25.808,19,26,18.792,26,18.536zM18.428,11C18.191,11,18,11.191,18,11.429V14.1h3.1V11H18.428zM25.571,11H21.9v3.1H26v-2.671C26,11.191,25.809,11,25.571,11z","t":"t5,-20","s":"none","fl":"#333"}},"f":{"10":{},"30":{"t":""},"50":{},"80":{"t":"t26,0"},"90":{"t":"t26,-20"},"100":{"t":"t5,-20"}}},{"i":{"a":{"p":"M11.156,11c-0.235,0-0.427-0.208-0.427-0.463V6.369h3.922V11H11.156zM19.287,10.537V6.369h-3.922V11h3.493C19.095,11,19.287,10.792,19.287,10.537zM13.406,1.145c-0.325-0.147-0.985-0.216-1.427,0c-0.471,0.231-0.85,0.811-0.713,1.426c0.216,0.974,1.602,1.301,1.602,1.301h-2.425c-0.236,0-0.427,0.191-0.427,0.427v1.712h4.635V3.873h0.357C15.008,3.873,14.54,1.657,13.406,1.145zM12.835,3.253c-0.287-0.059-0.787-0.186-0.909-0.738c-0.077-0.35,0.137-0.679,0.405-0.81c0.251-0.123,0.626-0.083,0.811,0c0.643,0.29,0.908,1.548,0.908,1.548S13.358,3.359,12.835,3.253zM19.572,3.873h-2.426c0,0,1.387-0.327,1.604-1.301c0.136-0.616-0.243-1.195-0.714-1.426c-0.442-0.216-1.102-0.147-1.427,0c-1.134,0.512-1.602,2.728-1.602,2.728h0.357v2.139H20V4.3C20,4.063,19.81,3.873,19.572,3.873zM15.966,3.253c0,0,0.266-1.258,0.908-1.548c0.186-0.083,0.56-0.123,0.811,0c0.267,0.131,0.481,0.459,0.403,0.81c-0.122,0.553-0.621,0.68-0.908,0.738C16.657,3.359,15.966,3.253,15.966,3.253z","t":"t2,-20","s":"none","fl":"#333"}},"f":{"20":{},"40":{"t":""},"50":{},"80":{"t":"t26,0"},"90":{"t":"t26,-20"},"100":{"t":"t2,-20"}}},{"i":{"a":{"p":"M14,27c0,1.105-0.896,2-2,2s-2-0.895-2-2s0.896-2,2-2S14,25.895,14,27zM24,25c-1.105,0-2,0.895-2,2s0.895,2,2,2s2-0.895,2-2S25.105,25,24,25zM26.713,22.586l-0.184,0.828C26.457,23.737,26.13,24,25.799,24H9.3c-0.663,0-1.302-0.527-1.427-1.179L4.75,6.59C4.69,6.264,4.373,6,4.042,6H1.334c-0.552,0-1-0.448-1-1s0.448-1,1-1h4C5.997,4,6.622,4.53,6.73,5.184L7.193,8H29.4c0.331,0,0.541,0.262,0.47,0.586l-2.406,10.828C27.393,19.737,27.065,20,26.734,20H9.3l0.254,1.409C9.612,21.735,9.929,22,10.26,22h15.984C26.575,22,26.785,22.263,26.713,22.586zM26.939,13H8.078l0.369,2h18.047L26.939,13zM7.524,10l0.369,2h19.268l0.444-2H7.524zM25.828,18l0.444-2H8.631L9,18H25.828z","o":1,"t":"","s":"none","fl":"#333"}},"f":{"50":{},"80":{"t":"t26,0"},"81":{"o":0},"82":{"t":"t-26,0"},"83":{"o":1},"100":{"t":""}}}]}}),lDI=lDI.replace(/\"d\":/g,'"duration":').replace(/\"i\":/g,'"init":').replace(/\"f\":/g,'"frames":').replace(/\"fIE\":/g,'"framesIE":').replace(/\"o\":/g,'"opacity":').replace(/\"t\":/g,'"transform":').replace(/\"it\":/g,'"iteration":').replace(/\"sh\":/g,'"shapes":').replace(/\"a\":/g,'"attr":').replace(/\"p\":/g,'"path":').replace(/\"fl\":/g,'"fill":').replace(/\"e\":/g,'"easing":').replace(/\"s\":/g,'"stroke-width":0,"stroke":'),liviconsdata=JSON.parse(lDI),sB=Raphael.svg,vB=Raphael.vml;
Raphael.fn.createLivicon=function(f,b,g,k,h,c,u,s,v,x,w,y,m){var e=[];g=clone(w);var d=g.shapes.length;s=s?s:g.iteration;var l=[],q=[],t=[],A="s"+y+","+y+",0,0";w=y=!1;if(b.match(/spinner/)){y=!0;var D=jQueryAC("#"+f),B=function(){if(D.is(":visible")){if(!z){for(var a=0;a< d;a++)e[a].animate(l[a].repeat(Infinity));z=!0}}else if(z){for(a=0;a< d;a++)e[a].stop();z=!1}}}b.match(/morph/)&&(w=!0);for(b=0;b< d;b++){var r=g.shapes[b].init,n;for(n in r)r[n].transform=A+r[n].transform}if(sB)for(b=0;b< d;b++)for(n in r=
g.shapes[b].frames,r)"transform"in r[n]&&(r[n].transform=A+r[n].transform);else for(b=0;b< d;b++)for(n in r=g.shapes[b].framesIE?g.shapes[b].framesIE:g.shapes[b].frames,r)"transform"in r[n]&&(r[n].transform=A+r[n].transform);for(b=0;b< d;b++)n=g.shapes[b].init.attr,"original"!=k&&(n.fill=k),t.push(n.fill),e[b]=this.path(n.path).attr(n);sB?jQueryAC("#"+f+" > svg").attr("id","canvas-for-"+f):jQueryAC("#"+f).children(":first-child").attr("id","canvas-for-"+f);f=jQueryAC("#"+f);m=m?m:f;if(!0==c){if(w){for(b=
0;b< d;b++)l.push(Raphael.animation(g.shapes[b].frames,mD)),q.push(g.shapes[b].init.attr);if(h){var C=clone(q);for(b=0;b< d;b++)C[b].fill=h}}else if(c=v?v:g.duration,!sB&&vB)for(b=0;b< d;b++)g.shapes[b].framesIE?l.push(Raphael.animation(g.shapes[b].framesIE,c)):l.push(Raphael.animation(g.shapes[b].frames,c)),q.push(g.shapes[b].init.attr);else for(b=0;b< d;b++)l.push(Raphael.animation(g.shapes[b].frames,c)),q.push(g.shapes[b].init.attr);if("click"==x)if(u&&!w)if(y){for(b=0;b<
d;b++)e[b].stop().animate(l[b].repeat(Infinity));var z=!0;setInterval(B,500)}else if(h){m.hover(function(){for(var a=0;a< d;a++)e[a].animate({fill:h},hD)},function(){for(var a=0;a< d;a++)e[a].animate({fill:t[a]},hD)});var p=!0;m.click(function(){for(var a=0;a< d;a++)e[a].stop().animate(p?l[a].repeat(u):q[a],0);p=!p})}else p=!0,m.click(function(){for(var a=0;a< d;a++)e[a].stop().animate(p?l[a].repeat(u):q[a],0);p=!p});else w?h?(m.hover(function(){for(var a=0;a< d;a++)e[a].animate({fill:h},
hD)},function(){for(var a=0;a< d;a++)e[a].animate({fill:t[a]},hD)}),p=!0,m.click(function(){for(var a=0;a< d;a++)e[a].stop().animate(p?l[a]:C[a],mD),p=!p})):(p=!0,m.click(function(){for(var a=0;a< d;a++)e[a].stop().animate(p?l[a]:q[a],mD),p=!p})):h?(m.hover(function(){for(var a=0;a< d;a++)e[a].animate({fill:h},hD)},function(){for(var a=0;a< d;a++)e[a].animate({fill:t[a]},hD)}),m.click(function(){for(var a=0;a< d;a++)e[a].stop().animate(l[a].repeat(s))})):
m.click(function(){for(var a=0;a< d;a++)e[a].stop().animate(l[a].repeat(s))});else if(u&&!w)if(y){for(x=0;x< d;x++)e[x].stop().animate(l[x].repeat(Infinity));z=!0;setInterval(B,500)}else h?m.hover(function(){for(var a=0;a< d;a++)e[a].stop().animate({fill:h},hD).animate(l[a].repeat(u))},function(){for(var a=0;a< d;a++)e[a].stop().animate(q[a],0)}):m.hover(function(){for(var a=0;a< d;a++)e[a].stop().animate(l[a].repeat(u))},function(){for(var a=0;a< d;a++)e[a].stop().animate(q[a],0)});else w?m.hover(function(){if(h)for(var a=
0;a< d;a++)e[a].stop().animate({fill:h},hD).animate(l[a]);else for(a=0;a< d;a++)e[a].stop().animate(l[a])},function(){for(var a=0;a< d;a++)e[a].stop().animate(q[a],mD)}):m.hover(function(){if(h)for(var a=0;a< d;a++)e[a].stop().animate(q[a],0).animate({fill:h},hD).animate(l[a].repeat(s));else for(a=0;a< d;a++)e[a].stop().animate(q[a],0).animate(l[a].repeat(s))},function(){for(var a=0;a< d;a++)e[a].animate({fill:t[a]},hD)})}else h&&m.hover(function(){for(var a=
0;a< d;a++)e[a].stop().animate({fill:h},hD)},function(){for(var a=0;a< d;a++)e[a].stop().animate({fill:t[a]},hD)});return!0};
(function(f){function b(){return b.counter++}b.counter=1;f.fn.extend({addLivicon:function(g){return this.each(function(){var k=f(this);if(!k.attr("id")){var h=b();k.attr("id","livicon-"+h)}var c=k.data();c.liviconRendered&&k.removeLivicon();c=fullNames(c);g&&(g=fullNames(g));var c=f.extend(c,g),h=k.attr("id"),u=k.parent(),s=c.name?c.name:dN,v=c.size?c.size:dS,x=c.eventtype?c.eventtype:dET,w=v/32;k[0].style.height?k.css("width",v):k.css({width:v,height:v});var y=s in liviconsdata?
liviconsdata[s]:liviconsdata[dN],m=k.hasClass(aC)||u.hasClass(aPC)?dAC:"original"==c.color?"original":c.color?c.color:dC,e=dA?!1==c.animate?c.animate:dA:!0==c.animate?c.animate:dA,d=dL?!1==c.loop?!1:Infinity:!0==c.loop?Infinity:!1,l=c.iteration?0< Math.round(c.iteration)?Math.round(c.iteration):!1:!1,q=c.duration?0< Math.round(c.duration)?Math.round(c.duration):!1:!1,t=dCCOH?dHC:!1;!1===c.hovercolor||
0===c.hovercolor?t=!1:!0===c.hovercolor||1===c.hovercolor?t=dHC:c.hovercolor&&(t=c.hovercolor);c=dOP?!1==c.onparent?!1:u:!0==c.onparent?u:!1;Raphael(h,v,v).createLivicon(h,s,v,m,t,e,d,l,q,x,y,w,c);k.data("liviconRendered",!0);return this})},removeLivicon:function(b){return this.each(function(){var k=f(this);k.data("liviconRendered",!1);if("total"===b)k.remove();else{var h=k.attr("id");f("#canvas-for-"+h).remove();return k}})},updateLivicon:function(b){return this.each(function(){var k=
f(this);k.removeLivicon().addLivicon(b);return k})}});f(".livicon").addLivicon()})(jQueryAC);function fullNames(f){f=JSON.stringify(f);f=f.replace(/\"n\":/g,'"name":').replace(/\"s\":/g,'"size":').replace(/\"c\":/g,'"color":').replace(/\"hc\":/g,'"hovercolor":').replace(/\"a\":/g,'"animate":').replace(/\"i\":/g,'"iteration":').replace(/\"d\":/g,'"duration":').replace(/\"l\":/g,'"loop":').replace(/\"et\":/g,'"eventtype":').replace(/\"op\":/g,'"onparent":');return f=JSON.parse(f)}
function clone(f){if(null==f||"object"!=typeof f)return f;var b=new f.constructor,g;for(g in f)b[g]=clone(f[g]);return b};
	}
}

var ajaxcartTools = new AjaxcartTools();

var AjaxcartLogin = Class.create();
AjaxcartLogin.prototype = {
	//main functions
	initialize: function(urls){
        this.loginUrl = urls.login;     
        this.postLoginUrl = urls.post_login;
        this.logoutUrl = urls.logout;
        this.logoutText = urls.logout_text;
        this.failureUrl = window.location.href; 
        this.loginPostResponse = false;
    },	  
	
	save: function(transport){
		if (transport){
			try{
				response = eval('(' + transport + ')');
			}
			catch (e) {
				response = {};
			}
		}
		
		if (response.error){		
			ajaxcartTools.resetLoadWaiting('ajaxcart-loading');
			ajaxcartTools.resetLoadWaiting('login-mini');
			ajaxcartLogin.ajaxCartLoginRunning = false;
			
			if ((typeof response.message) == 'string') {
				alert(response.message);
			} else {
				alert(response.message.join("\n"));
			}
			
			return false;
		}	

		//redirect in case ajax expired
		if (response.redirect) {
			location.href = response.redirect;
            return;
        }
        
        //update ajaxcart blocks
		if (response.update_section) {
			if (response.update_section.html_login) {
				ajaxcartTools.updateSection(response.update_section.html_login, 'ajaxcart-login-popup-content');
				//focus on the email input and make the login form submit when the "enter" key is pressed
				jQueryAC("#mini-login").focus();
				// jQueryAC("#mini-login").keypress(function( event ) {
			 //    	if ( event.which == 13 ) {
			 //   			jQueryAC('#login-button').click();
			 //    	}
				// });
				jQueryAC("#mini-password").keypress(function( event ) {
			    	if ( event.which == 13 ) {
			   			jQueryAC('#login-button').click();
			    	}
				});
			} else if (response.update_section.welcome) {    		      		    
    		    //save response in variable for later use in ajaxcart class to update all the blocks at once, after the product has been added to wishlist
				this.loginPostResponse = response;
				this.isLoggedIn = true;
				if (window.opener != null && window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup).length > 0) {
					window.opener.ajaxcartLogin.isLoggedIn = true;
				}
				ajaxcart.addToWishlist(this.addToWishlistUrl, false);	
								
				//update wishlist urls
				var wishlistElements = ajaxcart.updateWindow.document.getElementsByTagName('a');
				var wishlistUrl, newWishlistUrl;
				for ( var i = 0; i<wishlistElements.length; i++ ) {
					if (typeof wishlistElements[i].getAttribute("href") != 'undefined' && wishlistElements[i].getAttribute("href")!=null) {
						wishlistUrl = wishlistElements[i].getAttribute("href").toString();
						if ( wishlistUrl.search("ajaxcartLogin.loadLoginPopup") != -1 ) {
							newWishlistUrl = wishlistUrl.replace("javascript:ajaxcartLogin.loadLoginPopup('","").replace("', false);","");
							wishlistElements[i].setAttribute("href","javascript:ajaxcart.addToWishlist('"+ newWishlistUrl +"',false);");
						} 	
					} 	
				}				
			}			
		}
		
		ajaxcartTools.resetLoadWaiting('ajaxcart-loading');
		
		//close options popup
		if (response.close_popup && jQueryAC('#'+response.close_popup+'-popup-container').css("left")=='0px') {	
			ajaxcartTools.hidePopup(response.close_popup, false);  
		} 

		if (response.popup) {
			setTimeout(function() {
				ajaxcartTools.showPopup(response.popup, false);
			},300);
		}
	},	
	
	failure: function(){
		location.href = this.failureUrl;
	},
	
	loadLoginPopup: function(url, popup) {
		this.addToWishlistUrl = url.replace("javascript:ajaxcartLogin.loadLoginPopup('","").replace("', false);","");

		var formData = {};
		formData.redirect_url = window.location.href;

		if (popup=='success') {
			formData.close_popup = 'success';
			ajaxcartTools.deactivateTimer();
			jQueryAC("#countdownToClose").html('');
		}

		var productId = ajaxcartTools.getProductIdFromUrl(url,'product');
		if (popup=='success' && jQueryAC('#ac-cart-button'+productId).length>0) {
			ajaxcart.addToCartButton = jQueryAC('#ac-cart-button'+productId);
		}
		
		ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);		
		jQueryAC(this).ajaxSubmit({ 
		    url: ajaxcartLogin.loginUrl,
		    type: 'post',
		    data: formData,
		    dataType: 'text',
		    success: function(response) {
		        ajaxcartLogin.save(response);
		    },		
		    error: function() {
		        ajaxcartLogin.failure();
		    }
		}); 
	},	
	
	postLogin: function() {
    	var dataForm = new VarienForm('login-form-validate', true);
        if (dataForm.validator.validate()){
			var redirectUrl = window.location.href;
			if (jQueryAC('#login-form-validate #redirect_url').length == 0) {
				jQueryAC('#login-form-validate').append('<input type="hidden" value="'+ redirectUrl +'" id="redirect_url" name="redirect_url" />');
			}
			//if compare popup add param to load new compare popup html as well
			if (window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup) && jQueryAC('#login-form-validate #is_compare_popup').length==0) {
				jQueryAC('#login-form-validate').append('<input type="hidden" value="1" id="is_compare_popup" name="is_compare_popup" />');
			}
			//if cart page, add param to load new cart page html as well
			if (ajaxcart.updateWindow.location.href.indexOf('checkout/cart')!=-1 && jQueryAC('#login-form-validate #is_cart_page').length==0) {
				jQueryAC('#login-form-validate').append('<input type="hidden" value="1" id="is_cart_page" name="is_cart_page" />');
			}

			this.ajaxCartLoginRunning = true;
			ajaxcartTools.setLoadWaiting('login-mini', true);

			//disable all buttons, inputs, links etc.
			jQueryAC('#ac-popup-top-bkg').show();

			jQueryAC('#login-form-validate').ajaxSubmit({ 
			    url: ajaxcartLogin.postLoginUrl,
			    type: 'post',
			    dataType: 'text',
			    success: function(response) {
			        ajaxcartLogin.save(response);
			    },		
			    error: function() {
			        ajaxcartLogin.failure();
			    }
			}); 
		}
	},
	
	updateLoginLink: function() {   	
    	var logoutTxt = this.logoutText;
    	var logoutLink = this.logoutUrl;
    	jQueryAC('#ac-links a', ajaxcart.updateWindow.document).each(function() {
		    var href = jQueryAC(this).attr('href');
		    if (href != null && href != '' && href.indexOf('/customer/account/login/') != -1) {
		    	jQueryAC(this).html(logoutTxt);
		    	jQueryAC(this).attr('href', logoutLink);
		    }    			
		});
	}
}

var Ajaxcart = Class.create();
Ajaxcart.prototype = {
	initialize: function(initConfig){
        this.initUrl = initConfig.urls.initialize;      
        this.updateCartUrl = initConfig.urls.updateCart;    
        this.clearCartUrl = initConfig.urls.clearCart; 
        this.addWishlistItemToCartUrl = initConfig.urls.addWishlistItemToCart;  
        this.addAllItemsToCartUrl = initConfig.urls.addAllItemsToCart;
        this.failureUrl = window.location.href; 
		this.ajaxCartRunning = false;
		this.addToCartButton = false;
		
		this.jump = initConfig.configuration.jump; //Enables Notification Pop-Up
		this.showNotification = initConfig.configuration.show_notification; //Enables Notification Pop-Up
		this.autohideTime = initConfig.configuration.autohide_notification_time; //Sets the autohide time for the Success Pop-up
		this.showCheckoutButton = initConfig.configuration.show_checkout_button;
		this.showNotificationBkg = initConfig.configuration.notification_bkg; //Enables the dark Pop-Up background
		this.notificationWrapperBkg = initConfig.configuration.notification_wrapper_bkg; //Enables the dark Pop-Up background
		this.boxShadowColor = initConfig.configuration.box_shadow_color; //image hover background color
		this.isMobile = initConfig.configuration.is_mobile;
		this.isTablet = initConfig.configuration.is_tablet;
		this.isSecure = initConfig.configuration.is_secure;
		
		this.categoryList = 'ac-product-list'; //Sets the Cateory page CLASS to initialize the Ajax Cart 
		this.cartSidebar = 'ac-cart-sidebar'; //Sets the Cart Sidebar CLASS to initialize the Ajax Cart 
		this.compareSidebar = 'ac-compare-sidebar'; //Sets Compare Sidebar CLASS to initialize the Ajax Cart 
		this.comparePopup = 'ac-compare-popup'; //Sets Compare Sidebar CLASS to initialize the Ajax Cart 
		this.wishlistSidebar = 'ac-wishlist-sidebar'; //Sets the Wishlist Sidebar CLASS to initialize the Ajax Cart 
		this.cartPage = 'ac-cart'; //Sets the Cart page CLASS to initialize the Ajax Cart 
		this.wishlistPage = 'ac-wishlist'; //Sets the Wishlist page CLASS to initialize the Ajax Cart 
		this.lastCartSidebar = (jQueryAC('#'+this.cartSidebar+'1').length>0) ? 1 : 0;
		this.lastCompareSidebar = (jQueryAC('#'+this.compareSidebar+'1').length>0) ? 1 : 0;
		this.lastWishlistSidebar = (jQueryAC('#'+this.wishlistSidebar+'1').length>0) ? 1 : 0;
		
		this.categoryQty = initConfig.qtys.category_qty; //Enables Qty input on Category Page
		this.categoryQtyButtons = initConfig.qtys.category_qty_buttons; //Enables Qty input buttons on Category Page
		this.productQtyButtons = initConfig.qtys.product_qty_buttons; //Enables Qty input buttons on Product Page
		this.popupQtyButtons = initConfig.qtys.popup_qty_buttons; //Enables Qty input buttons on Pop Up
		this.cartPageQtyButtons = initConfig.qtys.cartpage_qty_buttons; //Enables Qty input buttons on Cart Page
		this.sidebarQty = initConfig.qtys.sidebar_qty; //Enables qty input on cart sidebar
		this.sidebarQtyButtons = initConfig.qtys.sidebar_qty_buttons; //Enables increase/decrease qty buttons on cart sidebar
		this.wishlistPageQtyButtons = initConfig.qtys.wishlist_qty_buttons; //Enables Qty input buttons on Cart Page
		
		this.updateWindow = (window.opener != null && window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+this.comparePopup)) ? window.opener : window;
		this.dragdropCategory = initConfig.dragdrop.dragdrop_enable_category; //Enables Drog & Drop on Category Page
		this.dropEffect = initConfig.dragdrop.dragdrop_drop_effect; //Sets the Drop effect
		this.enableTooltip = initConfig.dragdrop.tooltip_enable; //Enables the tooltip
		this.productImageIconColor = initConfig.dragdrop.product_image_icon_color; //Enables the tooltip
		this.floaterIconColor = initConfig.dragdrop.floater_icon_color; //Enables the tooltip
		this.initialViewport = false;

		this.floaterRunning = {
			cart: false,
			compare: false,
			wishlist: false
		};
    },	
	
	//UPDATE functions
	//these functions will run once the specific tags are loaded in the DOM and each time their content is updated
	updateAjaxCartBlocks: function(){	
		//save initial viewport values
		if (jQueryAC('meta[name="viewport"]').length > 0) {
			ajaxcart.initialViewport = jQueryAC('meta[name="viewport"]').attr('content');
		}

		//set the maxWidth of client; used in jquery-ui.js for scrolling
    	ajaxcart.maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		//RESET PETAL LOADER	 		
		ajaxcartTools.resetPetals();
						    	
		//UPDATE LINKS & BUTTONS
		this.updateLinksButtons();

		//UPDATE PRODUCT LISTS
		this.updateProductLists();
		
		//UPDATE PRODUCT PAGE
		if (jQueryAC('#product_addtocart_form').length > 0) {
			//Change add to cart button		
			var formElement = jQueryAC('#product_addtocart_form');
			var formAction = String(formElement.attr("action"));
			var productId = ajaxcartTools.getProductIdFromUrl(formAction,'product');
			    
			//add increase/decrease buttons to qty input
			if (jQueryAC('#qty').length > 0) {	
			    ajaxcart.addQtyBoxHtml('ac-product-view', jQueryAC('#qty'), productId);	
			    jQueryAC('#qty').value = productMinMax[productId]['min']; 
			} else {
			    var inputElements = document.getElementById('product_addtocart_form').getElementsByTagName('input');
			    for ( var j = 0; j<inputElements.length; j++ ) {
			    	if (inputElements[j].name != null && inputElements[j].name != '') {
			    		var qtyName = inputElements[j].getAttributeNode("name").nodeValue.toString();						
			    		if ( qtyName.search("super_group") != -1 ) {			
			    			var productId = qtyName.replace("super_group[","").replace("]","");
			    			ajaxcart.addQtyBoxHtml('ac-product-view-grouped', jQueryAC(inputElements[j]), productId);												
			    		}
			    	}
			    }		
			}
		        
		    ajaxcart.updateWindow.dispatchLiveUpdates('product', false);
		}
		
		//UPDATE CART SIDEBAR	
		if (jQueryAC('.'+ajaxcart.cartSidebar, ajaxcart.updateWindow.document).length > 0) {	
			for (var i=0;i<=ajaxcart.lastCartSidebar;i++) {
				//add tooltip
				if (i==ajaxcart.lastCartSidebar && ajaxcart.enableTooltip != 0 && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['cart'] && !jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar + ' span.tooltip-sidebar', ajaxcart.updateWindow.document).length > 0 && !jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).hasClass('ac-header')){		
					jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar + ' div', ajaxcart.updateWindow.document).first().append('<span class="tooltip-sidebar">' + Translator.translate('Buy Me!').stripTags() + '</span>');
				}
				
				//make the cart sidebar a droppable area	
				if(i==ajaxcart.lastCartSidebar && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['cart'] && !jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).hasClass('ac-header')) {
				    ajaxcart.makeCartDroppableArea();		
				}
				
				//add update/empty sidebar cart buttons to cart sidebar, on first load
			    if(jQueryAC('#'+ajaxcart.cartSidebar + i).length>0 && jQueryAC('#'+ajaxcart.cartSidebar+i+' ac-qty', ajaxcart.updateWindow.document).length>0 && !jQueryAC('#'+ajaxcart.cartSidebar + i).hasClass('ac-header')){
			    	var actionsContainer = '<div class="actions" id="ajaxcart-actions" style="border-bottom:none;">';
			    	actionsContainer += '<button onclick="ajaxcart.emptyCartConfirmation();" class="button left" title="' + Translator.translate('Empty Cart').stripTags() + '" type="button"><span><span>' + Translator.translate('Empty Cart').stripTags() + '</span></span></button>';
			    	if (ajaxcart.sidebarQty == 1){
			    		actionsContainer += '<button onclick="ajaxcart.updateQty(\'\',false,\'' + ajaxcart.cartSidebar + i + '\')" class="button" title="' + Translator.translate('Update Cart').stripTags() + '" type="button"><span><span>' + Translator.translate('Update Cart').stripTags() + '</span></span></button>';
			    	}		
			    	actionsContainer += '</div>';
			    	
			    	jQueryAC('#'+ajaxcart.cartSidebar + i +' div').first().append(actionsContainer);
			    }	

				//add qty inputs + increase/decrease buttons
				if (jQueryAC('#'+ajaxcart.comparePopup).length==0) {
					if (jQueryAC('#'+ajaxcart.cartSidebar+i, ajaxcart.updateWindow.document).html().indexOf('"<ac-qty>') != -1) {
						//if input exists
						jQueryAC('#'+ajaxcart.cartSidebar+i+' input', ajaxcart.updateWindow.document).each(function() {
							var input = jQueryAC(this);
							if (input.val().indexOf('<ac-qty>') != -1) {	
								var value = input.val().replace('<ac-qty>','').replace('</ac-qty>','');
								var itemId = value.split('-')[0];
								var qty = value.split('-')[1];
								input.val(qty);
							    input.attr('id','sidebar-qty-' + itemId);
							    input.attr('name','cart['+itemId+'][qty]');

						    	ajaxcart.addQtyBoxHtml('ac-cart-sidebar', jQueryAC(this), 'item'+itemId);	
							}
						});
					} else if (jQueryAC('#'+ajaxcart.cartSidebar+i, ajaxcart.updateWindow.document).html().indexOf('<ac-qty>') != -1) {
						//if input doesn't exists
						if (ajaxcart.sidebarQty==1) {
							jQueryAC('#'+ajaxcart.cartSidebar+i+' ac-qty', ajaxcart.updateWindow.document).each(function() {
								var qtyTag = jQueryAC(this);
								var value = qtyTag.text();
								var itemId = value.split('-')[0];
								var qty = value.split('-')[1];
								if (jQueryAC('#'+ajaxcart.cartSidebar+i+' #sidebar-qty-'+itemId).length==0) {
									qtyTag.html('<input id="sidebar-qty-'+itemId+'" class="input-text qty" name="cart['+itemId+'][qty]" value="'+qty+'" />');
									qtyTag.contents().unwrap();

								    ajaxcart.addQtyBoxHtml('ac-cart-sidebar', jQueryAC('#'+ajaxcart.cartSidebar+i+' #sidebar-qty-'+itemId, ajaxcart.updateWindow.document), 'item'+itemId);	
								}
							});
						}				
					}
				}
			    
			    truncateOptions();		
			        
			    ajaxcart.updateWindow.dispatchLiveUpdates('cart_sidebar', false);
			}
		}
		
		//UPDATE CART PAGE
		jQueryAC('#'+ajaxcart.cartPage+' input', ajaxcart.updateWindow.document).each(function() {
			//add increase/decrease buttons to qty inputs
			var input = jQueryAC(this);
			if (input.attr('name') != null && input.attr('name') != '' && input.attr('name').indexOf('cart') != -1 && input.attr('name').indexOf('[qty]') != -1) {	
			    var itemId = input.attr('name').replace("cart[","").replace("][qty]","");
			    input.attr('id','cart-qty-' + itemId);
			    ajaxcart.addQtyBoxHtml('ac-cart-page', jQueryAC(this), 'item'+itemId);	
			}
		        
		    ajaxcart.updateWindow.dispatchLiveUpdates('cart', false);
		});
		
		//UPDATE WISHLIST SIDEBAR
		if (jQueryAC('.'+ajaxcart.wishlistSidebar, ajaxcart.updateWindow.document).length > 0) {	
			for (var i=0;i<=ajaxcart.lastWishlistSidebar;i++) {
				//add tooltip
				if (i==ajaxcart.lastWishlistSidebar && ajaxcart.enableTooltip != 0 && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['wishlist'] && !jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar +' span.tooltip-sidebar', ajaxcart.updateWindow.document).length > 0 && !jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar).hasClass('ac-header')){		
					jQueryAC('#'+ajaxcart.wishlistSidebar+ ajaxcart.lastWishlistSidebar +' div', ajaxcart.updateWindow.document).first().append('<span class="tooltip-sidebar">' + Translator.translate('Wish Me!').stripTags() + '</span>');
				}
				
				//make the wishlist sidebar a droppable area
				if(i==ajaxcart.lastWishlistSidebar && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['wishlist'] && !jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar).hasClass('ac-header')) {
				    ajaxcart.makeWishlistDroppableArea();		
				}	
			        
			    ajaxcart.updateWindow.dispatchLiveUpdates('wishlist_sidebar', false);	
			}
		}
		
		//UPDATE WISHLIST PAGE
		jQueryAC('#'+ajaxcart.wishlistPage+' input', ajaxcart.updateWindow.document).each(function() {
			//add increase/decrease buttons to qty inputs
			var input = jQueryAC(this);
			if (input.attr('name') != null && input.attr('name') != '' && input.attr('name').indexOf('qty[') != -1) {	
			    var itemId = input.attr('name').replace("qty[","").replace("]","");
			    input.attr('id','wishlist-qty-' + itemId);
			    ajaxcart.addQtyBoxHtml('ac-wishlist-page', jQueryAC(this), 'witem'+itemId);	
			}
			
		    truncateOptions();
		        
		    ajaxcart.updateWindow.dispatchLiveUpdates('wishlist', false);
		})
		
		//UPDATE COMPARE SIDEBAR
		if (jQueryAC('.'+ajaxcart.compareSidebar, ajaxcart.updateWindow.document).length > 0) {	
			for (var i=0;i<=ajaxcart.lastCompareSidebar;i++) {
				//add tooltip
				if (i==ajaxcart.lastCompareSidebar && ajaxcart.enableTooltip != 0 && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['compare'] && !jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar + ' span.tooltip-sidebar', ajaxcart.updateWindow.document).length > 0 && !jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).hasClass('ac-header')){		
					jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar + ' div', ajaxcart.updateWindow.document).first().append('<span class="tooltip-sidebar">' + Translator.translate('Compare Me!').stripTags() + '</span>');
				}
				
				//make the compare sidebar a droppable area
				if((ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['compare'] && !jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).hasClass('ac-header')) {
				    ajaxcart.makeCompareDroppableArea();		
				}
			        
			    ajaxcart.updateWindow.dispatchLiveUpdates('compare_sidebar', false);
			}
		}

		jQueryAC(document).ready(function(){ajaxcartTools.runLivicons();});
	},		

	updateLinksButtons: function() {
		var delay = (window.opener != null && window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup)>0) ? 20 : 0;
		//Change add to cart buttons	
		setTimeout(function() { ajaxcart.updateButtons(ajaxcart.updateWindow.document); }, delay);	
				    
		//Change cart/wishlist/compare links + add product id attribute to images, used for drag and drop
		setTimeout(function() { ajaxcart.updateLinks(ajaxcart.updateWindow.document); }, delay);	

		//update the parent window as well if actions are performed from the compare popup
		if (window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup).length>0) {
			ajaxcart.updateLinks(window.document);	
			ajaxcart.updateButtons(window.document);	
		}
	},
	
	//change the normal link with the ajaxcart equivalent link
	updateLinks: function(updateWindow) {
		jQueryAC('a', updateWindow).each(function() {
			var a = this;
			var link, newLink;
			
			if (a.href != null && a.href != '') {	
			    link = a.href.toString();
			    	
			    //Change cart links
			    if ( link.indexOf("checkout/cart/delete") != -1 || link.indexOf("checkout/cart/ajaxDelete") != -1 ) {
					var itemId = ajaxcartTools.getProductIdFromUrl(link,'id');
					// a.setAttribute("href","javascript:ajaxcart.removeCartItem("+itemId+");");
			        a.setAttribute("onClick","ajaxcart.removeCartItem('"+itemId+"');");
			        a.setAttribute("href","javascript:void(0);");
					// if (a.onclick == null) {
					// 	a.setAttribute("onclick","return confirm('Are you sure you would like to remove this item from the shopping cart?');");	
					// 	//IE7 fix
					// 	if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
					// 		a.outerHTML = a.outerHTML;
					// 	}
					// }
				} 	
				if ( link.indexOf("checkout/cart/configure/") != -1 ) {
			        newLink = link.replace("checkout/cart/configure/","ajaxcart/cart/configure/");
			        if (ajaxcart.isSecure) {
			        	newLink = newLink.replace("http","https");
			        }
			        a.setAttribute("onClick","ajaxcart.configureCartItem('"+newLink+"');");
			        a.setAttribute("href","javascript:void(0);");
			    } 		
			
			    //Change compare links
			    if ( link.indexOf("catalog/product_compare/add/") != -1 ) {
				    var productId = ajaxcartTools.getProductIdFromUrl(link,'product');
			        newLink = link.replace("catalog/product_compare/add/","ajaxcart/product_compare/add/");
			        a.setAttribute("href","javascript:ajaxcart.addToCompare('"+ newLink +"', false);");
			        
			        //add compare link to drag and drop array
			        dragDropProducts[productId] = ( typeof dragDropProducts[productId] != 'undefined' && dragDropProducts[productId] instanceof Array ) ? dragDropProducts[productId] : []
			        dragDropProducts[productId]['compare'] = newLink;
			    } 				
			    if ( link.indexOf("catalog/product_compare/clear/") != -1 ) {
			        newLink = link.replace("catalog/product_compare/clear/","ajaxcart/product_compare/clear/");
			        a.setAttribute("href","javascript:ajaxcart.removeCompareItems('"+ newLink +"');");
			    } 	
			    if ( link.indexOf("catalog/product_compare/remove/") != -1 ) {
			        newLink = link.replace("catalog/product_compare/remove/","ajaxcart/product_compare/remove/");
			        a.setAttribute("href","javascript:ajaxcart.removeCompareItem('"+newLink+"');");
			    } 	
			    
			    //Change compare popup remove links
				if (a.onclick && a.onclick != null && a.onclick != '' && a.getAttributeNode('onclick')) {
					var onClick = a.getAttributeNode("onclick").nodeValue.toString();
					if (onClick.indexOf("catalog/product_compare/remove/") != -1) {
				        newLink = onClick.replace("catalog/product_compare/remove/","ajaxcart/product_compare/remove/").replace("removeItem('","").replace("');","");
						a.setAttribute("onclick","ajaxcart.removeCompareItem('"+newLink+"');");
						
			    		//ie7 fix
						if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
			    			var buttonHtml = a.outerHTML;
							a.outerHTML = buttonHtml;
						}
					}
					if ( onClick.indexOf("catalog/product_compare/add/") != -1 ) {
					    var productId = ajaxcartTools.getProductIdFromUrl(onClick,'product');
				        newLink = onClick.replace("catalog/product_compare/add/","ajaxcart/product_compare/add/").replace("setLocation('","").replace("')","");;
				        a.setAttribute("href","javascript:ajaxcart.addToCompare('"+ newLink +"', false);");
				        a.setAttribute("onclick","");
				        
				        //add compare link to drag and drop array
				        dragDropProducts[productId] = ( typeof dragDropProducts[productId] != 'undefined' && dragDropProducts[productId] instanceof Array ) ? dragDropProducts[productId] : []
				        dragDropProducts[productId]['compare'] = newLink;
				    } 	
			    } 			
			    
			    //Change wishlist links
			    if(ajaxcartLogin.isLoggedIn){
			        if ( link.indexOf("wishlist/index/add/") != -1 ) {
				    	var productId = ajaxcartTools.getProductIdFromUrl(link,'product');
			            newLink = link.replace("wishlist/index/add/","ajaxcart/wishlist/add/");
			            a.setAttribute("href","javascript:ajaxcart.addToWishlist('"+ newLink +"',false);");
			            //remove onclick from compare popup
			            a.setAttribute("onclick","");
			        
				        //add wishlist link to drag and drop array
						dragDropProducts[productId] = ( typeof dragDropProducts[productId] != 'undefined' && dragDropProducts[productId] instanceof Array ) ? dragDropProducts[productId] : []
				        dragDropProducts[productId]['wishlist'] = newLink;			        
			        } else if (a.onclick && a.onclick.toString().indexOf("wishlist/index/add/") != -1 && a.getAttributeNode('onclick')) {
			        	//update add to wishlist link for compare popup
			        	var onClick = a.getAttributeNode("onclick").nodeValue.toString();
				        var productId = ajaxcartTools.getProductIdFromUrl(onClick,'product');
			            newLink = onClick.replace("setPLocation('","").replace("', false)","").replace("', true)","").replace("wishlist/index/add/","ajaxcart/wishlist/add/");
			            a.setAttribute("onclick","ajaxcart.addToWishlist('"+ newLink +"',false);");
			        }	
			        if ( link.indexOf("wishlist/index/cart") != -1 ) {
			            newLink = link.replace("wishlist/index/cart/","ajaxcart/wishlist/cart/");
			            a.setAttribute("href","javascript:ajaxcart.addWishlistItemToCart('"+newLink+"', false);");
			        } 
			        if ( link.indexOf("wishlist/index/configure") != -1 ) {
			            newLink = link.replace("wishlist/index/configure/","ajaxcart/wishlist/configure/");
			            a.setAttribute("href","javascript:ajaxcart.configureWishlistItem('"+newLink+"');");
			        } 
			        if ( link.indexOf("wishlist/index/remove") != -1 ) {
			            newLink = link.replace("wishlist/index/remove/","ajaxcart/wishlist/remove/");
			            a.setAttribute("href","javascript:ajaxcart.removeWishlistItem('"+newLink+"');");
			        } 	
			        if ( link.indexOf("ajaxcartLogin.loadLoginPopup") != -1 ) {
						newLink = link.replace("javascript:ajaxcartLogin.loadLoginPopup('","").replace("', false);","");
						a.setAttribute("href","javascript:ajaxcart.addToWishlist('"+ newLink +"',false);");
					} 
					//update move to wishlist link from shopping cart page
					if ( link.indexOf("wishlist/index/fromcart/") != -1 ) {
				        newLink = link.replace("wishlist/index/fromcart/","ajaxcart/wishlist/fromcart/");
				        a.setAttribute("href","javascript:ajaxcart.moveToWishlist('"+newLink+"');");
				    } 	
			    } else {
			        if ( link.indexOf("wishlist/index/add/") != -1 ) {
				    	var productId = ajaxcartTools.getProductIdFromUrl(link,'product');
			            newLink = link.replace("wishlist/index/add/","ajaxcart/wishlist/add/");
			            a.setAttribute("href","javascript:ajaxcartLogin.loadLoginPopup('"+newLink+"', false);");
			            //remove onclick from compare popup
			            a.setAttribute("onclick","");
			        
				        //add wishlist link to drag and drop array
						dragDropProducts[productId] = ( typeof dragDropProducts[productId] != 'undefined' && dragDropProducts[productId] instanceof Array ) ? dragDropProducts[productId] : []
				        dragDropProducts[productId]['wishlist'] = newLink;
			        } 	
			    } 		
			    
		    	ajaxcart.updateWindow.dispatchLinkUpdates(a, onClick);	    
			}
		});
	},
	
	//change the normal button with the ajaxcart equivalent button
	updateButtons: function(updateWindow) {
		jQueryAC('button', updateWindow).each(function() {
			var button = this;
			if (button.onclick != null && button.onclick != '') {
		    	var onClick = button.getAttributeNode("onclick").nodeValue.toString();
		    	if ( onClick.indexOf("checkout/cart/add") != -1 && onClick.indexOf("/product/") != -1 ) {
		    		if ( onClick.indexOf("setPLocation") != -1 ) {
			    		var url = onClick.replace("setPLocation('","").replace("', false)","").replace("', true)","").replace("checkout/cart/add","ajaxcart/index/init");
			    	} else {
			    		var url = onClick.replace("setLocation('","").replace("')","").replace("checkout/cart/add","ajaxcart/index/init");
			    	}
				    var productId = ajaxcartTools.getProductIdFromUrl(url,'product');
		    		button.setAttribute("onclick","ajaxcart.initAjaxcart('"+ url +"', this, false);");
		    		
		    		//ie7 fix
					if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
		    			var buttonHtml = button.outerHTML;
						button.outerHTML = buttonHtml;
					}
		    			    		
			        //add cart link to drag and drop array
			        dragDropProducts[productId] = ( typeof dragDropProducts[productId] != 'undefined' && dragDropProducts[productId] instanceof Array ) ? dragDropProducts[productId] : []
			        dragDropProducts[productId]['cart'] = url;
		    	} else if ( onClick === 'productAddToCartForm.submit(this)' || onClick === 'productAddToCartForm.submit()' ) {
					button.setAttribute("onclick","ajaxcart.initAjaxcart(false, this, false);");
		    		
		    		//ie7 fix
					if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
		    			var buttonHtml = button.outerHTML;
						button.outerHTML = buttonHtml;
					}
		    	} else if (jQueryAC('#ac-wishlist').length>0 && onClick.indexOf("this.name='do'") != -1) {	
					jQueryAC(button).click(function( event ) {
					    event.preventDefault();
					    ajaxcart.updateWishlistItems();
					});
				} else if (onClick.indexOf("addWItemToCart(") != -1) {
		    		var itemId = onClick.replace("addWItemToCart(","").replace(");","").replace(")","");
			    	button.setAttribute("onclick","ajaxcart.initAddWishlistItemToCart("+itemId+");");
		    		
		    		//ie7 fix
					if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
		    			var buttonHtml = button.outerHTML;
						button.outerHTML = buttonHtml;
					}
		    	} else if (onClick.indexOf("addAllWItemsToCart(") != -1) {
			    	button.setAttribute("onclick","ajaxcart.addAllWishlistItemsToCart();");
		    		
		    		//ie7 fix
					if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
		    			var buttonHtml = button.outerHTML;
						button.outerHTML = buttonHtml;
					}
		    	}
		    	
		    	ajaxcart.updateWindow.dispatchButtonUpdates(button, onClick);
		    } else if (jQueryAC(button).val() != null && jQueryAC(button).val() != '' && jQueryAC(button).val()=='update_qty') {
		    	//change cart page update cart button
			    jQueryAC(button).click(function( event ) {
				    event.preventDefault();
				    ajaxcart.updateCartQty('',false);
				});
		    } else if (jQueryAC(button).val() != null && jQueryAC(button).val() != '' && jQueryAC(button).val()=='empty_cart') {
		       	//change cart page empty cart button
			    jQueryAC(button).click(function( event ) {
				    event.preventDefault();
				    ajaxcart.emptyCartConfirmation();
				});
		    } else if (jQueryAC('#ac-cart').length>0 && jQueryAC(button).hasClass('btn-update')) {
		    	//change cart page update cart button
			    jQueryAC(button).click(function( event ) {
				    event.preventDefault();
				    ajaxcart.updateCartQty('',false);
				});
		    } else if (jQueryAC('#ac-wishlist').length>0 && jQueryAC(button).attr('name')=='do') {
		    	//change cart page update cart button
			    jQueryAC(button).click(function( event ) {
				    event.preventDefault();
					ajaxcart.updateWishlistItems();
				});
		    }
		});
	},  

	//add qty inputs and drag and drop functionality to product lists
	updateProductLists: function() {
		jQueryAC('.' + ajaxcart.categoryList + ' li').each(function() {				
			var li = this;
			var buttons = li.getElementsByTagName('button');
			var isSaleable = false;
			
			for ( var i = 0; i<buttons.length; i++ ) {
			    if (buttons[i].onclick != null && buttons[i].onclick != '') {
			    	var onclickCartAction = buttons[i].getAttributeNode("onclick").nodeValue.toString();    	
			    	if ( onclickCartAction.indexOf("checkout/cart/add") != -1 || onclickCartAction.indexOf("ajaxcart/index/init") != -1) {
			    		isSaleable = true;
			    		
			    		//add qty inputs, increase/decrease buttons
			    		var productId = ajaxcartTools.getProductIdFromUrl(onclickCartAction,'product');
			    		ajaxcart.addQtyBoxHtml('ac-product-list', buttons[i], productId);
			    	}
			    }
			}
			
			//if not isSaleable, add productId attribute to image for drag and drop	
			if (!isSaleable && (ajaxcart.dragdropCategory != 0 || ajaxcart.jump == 1)) {
			    var links = li.getElementsByTagName('a');					
			    for ( var i = 0; i<links.length; i++ ) {
			    	if (links[i].href != null && links[i].href != '') {
			    		link = links[i].href.toString();
			    	    if (link.indexOf("ajaxcart/wishlist/add/") != -1 || link.indexOf("wishlist/index/add/") != -1 || link.indexOf("ajaxcart/product_compare/add/") != -1 || link.indexOf("catalog/product_compare/add/") != -1) {
			    	    	//add productId attribute to image for drag and drop	
			    	    	var productId = ajaxcartTools.getProductIdFromUrl(links[i].href,'product');
			    		    break;
			    	    }
			        }
			    }
			}
			
			//make item draggable
			Event.observe(window, 'load', function() { 
				ajaxcart.makeItemDraggable(li, isSaleable, productId);
			});

			//add floaters
		    if (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 3) {
			    if (jQueryAC('#'+'cart-floater'+productId).length == 0) {
			    	jQueryAC('body').append('<div class="cart-floater ac-floater" id="cart-floater'+productId+'"><div class="draggable-content"><div id="cart-livicon'+productId+'" class="draggable-image livicon" data-name="shopping-cart" data-color="'+ajaxcart.floaterIconColor+'"></div><div class="draggable-text">' + Translator.translate('Buy Me!').stripTags() + '</div></div></div>');
			    }
			    if (jQueryAC('#'+'compare-floater'+productId).length == 0) {
			    	jQueryAC('body').append('<div class="compare-floater ac-floater" id="compare-floater'+productId+'"><div class="draggable-content"><div id="compare-livicon'+productId+'" class="draggable-image livicon" data-name="balance" data-color="'+ajaxcart.floaterIconColor+'"></div><div class="draggable-text">' + Translator.translate('Compare Me!').stripTags() + '</div></div></div>');
			    }
			    if (jQueryAC('#'+'wishlist-floater'+productId).length == 0) {
			    	jQueryAC('body').append('<div class="wishlist-floater ac-floater" id="wishlist-floater'+productId+'"><div class="draggable-content"><div id="wishlist-livicon'+productId+'" class="draggable-image livicon" data-name="heart" data-color="'+ajaxcart.floaterIconColor+'"></div><div class="draggable-text">' + Translator.translate('Wish Me!').stripTags() + '</div></div></div>');
			    }
			}
		        
		    ajaxcart.updateWindow.dispatchLiveUpdates('list_item', li);
		})
	},
	
	//update blocks with ajax loaded content
	updateSections: function(response){
		//update layout messages
		if (response.update_section.html_layout_messages) {
		    setTimeout(function () { jQueryAC('#ajaxcart-layout-messages').html(response.update_section.html_layout_messages); }, ajaxcart.successPopupDelay);
		}	

		//update additional content in success popup
		if (response.update_section.html_additional_content) {
		    setTimeout(function () { jQueryAC('#ajaxcart-custom-block').html(response.update_section.html_additional_content); ajaxcart.updateProductLists(); }, ajaxcart.successPopupDelay);
		}	

		//update product images in success popup
		if (response.update_section.html_product_images) {
		    setTimeout(function () { jQueryAC('#ajaxcart-product-images').html(response.update_section.html_product_images); }, ajaxcart.successPopupDelay);
		}	
		
		if (response.update_section.html_options_layout_messages) {
		    jQueryAC('#ajaxcart-options-layout-messages').html(response.update_section.html_options_layout_messages);
		}
		
		//Update siderbar blocks
		if (!ajaxcartLogin.loginPostResponse) {		
			//reinitialize the ajaxcart js if an item is added/updated while on the shopping cart page
			if (response.update_section.html_ajaxcart_js) {
				ajaxcartTools.updateSection(response.update_section.html_ajaxcart_js,'ajaxcart-qty-js');
			}	
			
			//update options popup
			if (response.update_section.html_options) {
				ajaxcartTools.updateSection(response.update_section.html_options,'ajaxcart-options');
				this.updateOptionsPopupAddToCartButton(response);
			}
		
			//preload cart/wishlist sidebar images
			if (response.update_section.html_cart) {
				ajaxcartTools.preloadImages(response.update_section.html_cart);
			}
			if (response.update_section.html_wishlist) {
				ajaxcartTools.preloadImages(response.update_section.html_wishlist);
			}
			
			setTimeout(function() {
				ajaxcart.updateCart(response);
				ajaxcart.updateCartPage(response);			
				ajaxcart.updateWishlist(response);
				ajaxcart.updateWishlistPage(response);	
				ajaxcart.updateCompare(response);				
				ajaxcart.updateComparePopup(response);	
				ajaxcart.updateLinksButtons();
					
				//this function is used to launch specific events for custom themes
				ajaxcart.updateWindow.dispatchBlockUpdates(response);			
			},300);
		} else {	
			//close login popup
			ajaxcartTools.hidePopup('ajaxcart-login', false);		
			
			//preload cart/wishlist sidebar images			
			if (ajaxcartLogin.loginPostResponse.update_section.html_cart) {
				ajaxcartTools.preloadImages(ajaxcartLogin.loginPostResponse.update_section.html_cart);
			}
			if (ajaxcartLogin.loginPostResponse.update_section.html_wishlist) {
				ajaxcartTools.preloadImages(ajaxcartLogin.loginPostResponse.update_section.html_wishlist);
			}
			
			//delay the update of the blocks in order for the images to have time to be added to the DOM
			setTimeout(
				function(){		
					 
	    		    //update login link
	    			ajaxcartLogin.updateLoginLink();	 
	    				
					//update welcome message
					if (ajaxcartLogin.loginPostResponse.update_section.welcome && ajaxcart.updateWindow.document.getElementById('ac-welcome-message')) {
						ajaxcart.updateWindow.document.getElementById('ac-welcome-message').innerHTML = ajaxcartLogin.loginPostResponse.update_section.welcome;
					}	
					
					//reinitialize the ajaxcart js
					if (ajaxcartLogin.loginPostResponse.update_section.html_ajaxcart_js) {
						ajaxcartTools.updateSection(ajaxcartLogin.loginPostResponse.update_section.html_ajaxcart_js,'ajaxcart-qty-js');
					}		
					
					ajaxcart.updateCart(ajaxcartLogin.loginPostResponse);
					ajaxcart.updateCartPage(ajaxcartLogin.loginPostResponse);	
					ajaxcart.updateWishlist(response);		
					ajaxcart.updateWishlistPage(response);
					ajaxcart.updateCompare(ajaxcartLogin.loginPostResponse);
					ajaxcart.updateComparePopup(ajaxcartLogin.loginPostResponse);	
					ajaxcart.updateLinksButtons();
					
					//this function is used to launch specific events for custom themes
					ajaxcart.updateWindow.dispatchBlockUpdates(ajaxcartLogin.loginPostResponse);	
					
					//reset values
					ajaxcartLogin.loginPostResponse = false;	
					ajaxcartLogin.ajaxCartLoginRunning = false;
				
					//enable all buttons, inputs, links etc.
					jQueryAC('#ac-popup-top-bkg').hide();
				}
				,300
			);
		}
	},			
	
	//update add to cart button from the product options popup
	updateOptionsPopupAddToCartButton: function(response){
		var buttonElements = document.getElementById('ajaxcart-options').getElementsByTagName('button');
		var link = response.form_action, 
			onClick;
           	
		for ( var i = 0; i<buttonElements.length; i++ ) {
			if (buttonElements[i].onclick != null && buttonElements[i].onclick != '') {
				var onClick = buttonElements[i].getAttributeNode("onclick").nodeValue;
				if ( onClick === 'productAddToCartForm.submit(this)' || onClick === 'productAddToCartForm.submit()' ) {
					if (link.indexOf('/wishlist/index/cart/')!=-1) {						
		            	onClick = "ajaxcart.addWishlistItemToCart('" + link.replace("wishlist/index/cart/","ajaxcart/wishlist/cart/") + "skip_popup/1/', this);";
		            } else if (link.indexOf('/wishlist/index/updateItemOptions/')!=-1) {
		            	onClick = "ajaxcart.updateWishlistItem('" + link.replace("wishlist/index/updateItemOptions/","ajaxcart/wishlist/updateItemOptions/") + "skip_popup/1/', this);";
		            	jQueryAC(buttonElements[i]).html("<span><span>" + Translator.translate('Update Wishlist') + "</span></span>");
		            } else if (link.indexOf('checkout/cart/updateItemOptions')!=-1) {
		            	onClick = "ajaxcart.updateCartItem('" + link.replace("checkout/cart/updateItemOptions/","ajaxcart/cart/updateItemOptions/") + "close_popup/1/', this);";
		            	if (ajaxcart.isSecure) {
				        	onClick = onClick.replace("http","https");
				        }
				        jQueryAC(buttonElements[i]).html("<span><span>" + Translator.translate('Update Cart') + "</span></span>");
				    } else {
		            	onClick = "ajaxcart.initAjaxcart('"+ link +"', this, 'options');";
		            }
		            
					buttonElements[i].setAttribute("onclick", onClick);
					//IE7 fix, so the add to cart button will be add to the DOOM
					if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
						buttonElements[i].outerHTML = buttonElements[i].outerHTML;
					}					
				} 
			}
		}
		if (response.product_id) {
			this.itemProductId = response.product_id;
		}
		if (jQueryAC('#options_addtocart_form #qty').length>0){	
			ajaxcart.addQtyBoxHtml('ac-options-popup', jQueryAC('#options_addtocart_form #qty'), response.product_id);
			if (response.qty) {		
				if (isNaN(response.qty)){
					jQueryAC('#popup-qty').val(productMinMax[response.product_id]['min']);
				} else {
					jQueryAC('#popup-qty').val(response.qty);
				}
			}
		} else {
			var inputElements = document.getElementById('ajaxcart-options').getElementsByTagName('input');
			for ( var j = 0; j<inputElements.length; j++ ) {
				if (inputElements[j].name != null && inputElements[j].name != '') {
					var qtyName = inputElements[j].getAttributeNode("name").nodeValue.toString();						
					if ( qtyName.search("super_group") != -1 ) {			
						var productId = qtyName.replace("super_group[","").replace("]","");
						ajaxcart.addQtyBoxHtml('ac-options-popup-grouped', jQueryAC(inputElements[j]), productId);	
						if (response.qty) {		
							if (isNaN(response.qty)){
							    inputElements[j].value = productMinMax[productId]['min'];
							} else {
							    inputElements[j].value = response.qty;
							}	
						}		
					}
				}
			}		
		}	
	},
	
	//QTY functions
	addQtyBoxHtml: function(section, element, productId) {
		var addInput = 0;
		var addInputButtons = 0;
		
		if (section=='ac-product-list') {
			var name = "qty-"+ productId;
			addInput = ajaxcart.categoryQty;
			if (addInput==1) {
				addInputButtons = ajaxcart.categoryQtyButtons;
			} 
		} else if (section=='ac-product-view') {
			var name = "qty";
			addInputButtons = ajaxcart.productQtyButtons;
		} else if (section=='ac-product-view-grouped') {
			var name = 'grouped-qty-' + productId;
			element.attr('id',name);
			addInputButtons = ajaxcart.productQtyButtons;
		} else if (section=='ac-cart-sidebar') {
			var itemId = element.attr('id').replace(/\D/g, '' );
			var name = "sidebar-qty-"+itemId;
			addInputButtons = ajaxcart.sidebarQtyButtons;
		} else if (section=='ac-cart-page') {
			var itemId = element.attr('id').replace(/\D/g, '' );
			var name = "cart-qty-"+itemId;
			addInputButtons = ajaxcart.cartPageQtyButtons;
		} else if (section=='ac-wishlist-page') {
			var itemId = element.attr('id').replace(/\D/g, '' );
			var name = "wishlist-qty-"+itemId;
			addInputButtons = ajaxcart.wishlistPageQtyButtons;
		} else if (section=='ac-options-popup') {
			addInputButtons = ajaxcart.popupQtyButtons;
			var name = "popup-qty";
			element.attr('id',name);
		} else if (section=='ac-options-popup-grouped') {
			var name = 'popup-grouped-qty-' + productId;
			element.attr('id',name);
			addInputButtons = ajaxcart.popupQtyButtons;
		}	

		if (productMinMax[productId]==undefined) {
			productMinMax[productId] = new Array();
			productMinMax[productId]['min'] = 1;
			productMinMax[productId]['max'] = 10000;
			productMinMax[productId]['inc'] = 1;
		}
					
		var qtyBoxHtml = '';
		if (addInput == 1 && addInputButtons == 1){
		    qtyBoxHtml = "<span class='ajaxcart-qty'><input name='"+name+"' id='"+name+"' type='text' value='"+ productMinMax[productId]['min'] +"' class='input-text qty'><span class='qty-control-box'><button type='button' class='increase' href='javascript:void(0)' onclick='ajaxcart.qtyUp(" + productId + ",\""+name+"\", this);'>+</button><button type='button' class='decrease' href='javascript:void(0)' onclick='ajaxcart.qtyDown(" + productId + ",\""+name+"\", this);'>-</button></span></span>";
		} else if (addInput == 1) {
		    qtyBoxHtml = "<span class='ajaxcart-qty'><input name='"+name+"' id='"+name+"' type='text' value='"+ productMinMax[productId]['min'] +"' class='input-text qty'></span>";
		} else if (addInputButtons == 1) {
		    qtyBoxHtml = "<span class='qty-control-box'><button type='button' class='increase' href='javascript:void(0)' onclick='ajaxcart.qtyUp(\"" + productId + "\",\""+name+"\",this);'>+</button><button type='button' class='decrease' href='javascript:void(0)' onclick='ajaxcart.qtyDown(\"" + productId + "\",\""+name+"\",this);'>-</button></span>";
		}		
		
		if (section=='ac-product-list') {
			if (jQueryAC('#ac-list-qty-'+productId).length>0) {
				jQueryAC('#ac-list-qty-'+productId).html(qtyBoxHtml);
			} else if (jQueryAC(element).closest(".ac-product-list").find("#qty-" + productId).length==0) {
			    element.outerHTML += qtyBoxHtml;
			}
		} else if (section=='ac-cart-page' || section=='ac-cart-sidebar' || section=='ac-wishlist-page') {
			element.wrap('<span class="ajaxcart-qty"></span>');
			element.after(qtyBoxHtml);
		} else if (element.parent().prop('outerHTML').indexOf('ajaxcart-qty') == -1) {
			element.prop('outerHTML', '<span class="ajaxcart-qty">'+ element.prop('outerHTML') + qtyBoxHtml + '</span>');
		} 		

		if (jQueryAC('#'+name).length>0) {
			var height = jQueryAC('#'+name).outerHeight();
			if (height<20) {
				height = 20;
			}
			jQueryAC('#'+name).parent().find('.qty-control-box').css({'height':height});
		}

		Event.observe(window, 'load', function() { 
			if (jQueryAC('#'+name).length>0) {
				var height = jQueryAC('#'+name).outerHeight();
				if (height<20) {
					height = 20;
				}
				jQueryAC('#'+name).parent().find('.qty-control-box').css({'height':height});
			}
		});
	},
	
	//increase/decrease cart qty functions	
	qtyUp: function(productId, qtyElementId, button){  
		var qtyElement = jQueryAC("#" + qtyElementId);
		if (qtyElementId.indexOf('popup-grouped-qty-')!=-1) {
			var productMin = 0;
		} else {
			var productMin = productMinMax[productId]['min'];			
		}
		
		if (jQueryAC(button).closest(".ac-product-list").find("#" + qtyElementId).length) {
			qtyElement = jQueryAC(button).closest(".ac-product-list").find("#" + qtyElementId);
		}
	
		var oldValue = parseFloat(qtyElement.val());
		
		if (isNaN(oldValue)){
			alert(Translator.translate('The requested quantity is not available.').stripTags());
			qtyElement.val(productMin);
			return;
		}
		
		if (oldValue<productMin && (oldValue+1) != productMin) {
			alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMin + '.');
			qtyElement.val(productMin);
			return;
		}		
		
		if ((oldValue+productMinMax[productId]['inc'])<=productMinMax[productId]['max']) {
			if(qtyElementId.search("sidebar-qty-") != -1 ){
				this.updateQty(qtyElementId,true,button);
			} else if( qtyElementId.search("cart-qty-") != -1 ){
				this.updateCartQty(qtyElementId,true);
			} else if ( qtyElementId.search("wishlist-qty-") != -1 ) {
				this.updateWishlistQty(qtyElementId,true);
			} else {
				qtyElement.val(oldValue + productMinMax[productId]['inc']);
			}
		} else {
			alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
			qtyElement.val(productMinMax[productId]['max']);
		}
    }, 
	
	qtyDown: function(productId, qtyElementId, button){
		var qtyElement = jQueryAC("#" + qtyElementId);
		if (qtyElementId.indexOf('popup-grouped-qty-')!=-1) {
			var productMin = 0;
		} else {
			var productMin = productMinMax[productId]['min'];			
		}
		
		if (jQueryAC(button).closest(".ac-product-list").find("#" + qtyElementId).length) {
			qtyElement = jQueryAC(button).closest(".ac-product-list").find("#" + qtyElementId);
		}
		
		var oldValue = parseFloat(qtyElement.val());
		if (isNaN(oldValue)){
			alert(Translator.translate('The requested quantity is not available.').stripTags());
			qtyElement.val(productMin);
			return;
		}
		
		if (oldValue>productMinMax[productId]['max']) {
			alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
			qtyElement.val(productMinMax[productId]['max']);
			return;
		}		
		
		if ((oldValue-productMinMax[productId]['inc'])>=productMin) {
			if(qtyElementId.search("sidebar-qty-") != -1){
				this.updateQty(qtyElementId,false,button);
			} else if( qtyElementId.search("cart-qty-") != -1 ){
				this.updateCartQty(qtyElementId,false);
			} else if ( qtyElementId.search("wishlist-qty-") != -1 ) {
				this.updateWishlistQty(qtyElementId,false);
			} else {
				qtyElement.val(oldValue - productMinMax[productId]['inc']);
			}
		} else {
			if(qtyElementId.search("sidebar-qty-") != -1){
				if (oldValue==1) {
					if (confirm(Translator.translate('Are you sure you would like to remove this item from the shopping cart?').stripTags())){
						this.updateQty(qtyElementId,false,button);
					}
				} else {
					alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMin + '.');
				}
			} else if( qtyElementId.search("cart-qty-") != -1 ){				
				if (oldValue==1) {
					if (confirm(Translator.translate('Are you sure you would like to remove this item from the shopping cart?').stripTags())){
						this.updateCartQty(qtyElementId,false);
					}
				} else {
					alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMin + '.');
				}
			} else if( qtyElementId.search("wishlist-qty-") != -1 ){				
				if (oldValue==1) {
					if (confirm(Translator.translate('Are you sure you would like to remove this item from the wishlist?').stripTags())){
						this.updateWishlistQty(qtyElementId,false);
					}
				} else {
					alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMin + '.');
				}
			} else {		
				alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMin + '.');
				qtyElement.val(productMin);
			}	
		}
    },
	
	//DRAG & DROP functions
	//Apply drag and drop functionality to category list item
	makeItemDraggable: function(li, isSaleable, productId) { 
		if ((ajaxcart.dragdropCategory != 0 || ajaxcart.jump == 1) && !jQueryAC(li).hasClass('disable-dragdrop')){
			var imgTotal = 0,
				imgCount = 0;
			jQueryAC(li).find('img').each(function() {
				var img = jQueryAC(this);
				var src = img.attr('src');
				
	            if (src != '' && src != null && src.indexOf('media/catalog/product/')!=-1){
	            	imgTotal++;
	            }
			});

			jQueryAC(li).find('img').each(function() {
				var img = jQueryAC(this);
				var src = img.attr('src');
				
	            if (src != '' && src != null && src.indexOf('media/catalog/product/')!=-1 && jQueryAC('.draggable-bkg', li).length == 0){
	            	imgCount++;
	            	if (imgCount==imgTotal) {						
					    var width = img.width();
					    var height = img.height();

					    var size = '';
					    var srcSections = src.split('/');
						for ( var i = 0; i<srcSections.length; i++ ) {
						    if (srcSections[i]=='image' || srcSections[i]=='small_image' || srcSections[i]=='thumbnail') {
						    	size = srcSections[i+1];
						    }
						}
						if (size.indexOf('x')!=-1) {
							var sizeArray = size.split('x');
							if (width=='') {
								var width = sizeArray[0];
							}
							if (height=='') {
								if (sizeArray[1] && sizeArray[1]!='') {
									var height = sizeArray[1];
								} else {
									var height = width;
								}
							}
						}

					    var spread = Math.round(width/2 + 1);
					    if (height>=width) {
					    	var spread = Math.round(height/2 + 1);
					    } 

				    	img.attr('width',width);
				    	img.attr('height',height);

	            		img.wrap('<div class="ui-draggable"></div>');
			        	var imgContainer = img.parent();
			        	imgContainer.attr("product",productId);	
				    	imgContainer.css({'width':width,'height':height});

				    	if (ajaxcart.dragdropCategory != 0) {
					    	var dataSize = 60;
					    	if (width>140) {
					    		var dataSize = 65;
					    	} else if (width>180) {
					    		var dataSize = 70;			    		
					    	}

					    	//add hover
						    imgContainer.append('<div class="draggable-bkg"><div class="draggable-content"><div class="draggable-image ac-drag-livicon"></div><div class="draggable-text">' + Translator.translate('Drag me').stripTags() + '</div></div></div>');
					        jQueryAC('.ac-drag-livicon').addLivicon({
							    name : 'drag',
							    size : dataSize,
							    color : ajaxcart.productImageIconColor,
							    animate : false
						    });

						    var running = false;
						    //add product image hover box-shadow effects
						    imgContainer.hover(function(){
						    	jQueryAC(this, this).addClass('mouse-over');
						    	if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 8){
							    	jQueryAC(this, this).find('.draggable-bkg').css({'display' : 'block'});				    		
						    	} else {
						    		running = true;
									jQueryAC(this, this).find('.draggable-bkg').css({'box-shadow': '0px 0px 0px '+spread+'px rgba('+ajaxcart.boxShadowColor+',0.8) inset'});
								}
						    }, function() {
						    	jQueryAC(this, this).removeClass('mouse-over');
						    	if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 8){
							    	jQueryAC(this, this).find('.draggable-bkg').css({'display' : 'none'});				    		
						    	} else {
							    	running = false;
							    	var draggableBkg = jQueryAC(this, this).find('.draggable-bkg');
							    	if ((draggableBkg.css('box-shadow')).indexOf(spread+'px')!=-1) {
							    		draggableBkg.css({'box-shadow': '0px 0px 0px '+spread+'px rgba('+ajaxcart.boxShadowColor+',0.8) inset'});
							    		setTimeout(function() {
							    			if (!running) {
							    				draggableBkg.addClass('no-transition');
							    				draggableBkg.css({'box-shadow': '0px 0px 0px -1px rgba('+ajaxcart.boxShadowColor+',0.8) inset'});	
							    				draggableBkg.css('box-shadow');				
							    				draggableBkg.removeClass('no-transition');
							    			}
							    		}, 300);					
							    	} else {					
							    		draggableBkg.css({'box-shadow': '0px 0px 0px -1px rgba('+ajaxcart.boxShadowColor+',0.8) inset'});					
							    	}
							    }
						    })	
						    
						    imgContainer.draggable({ 
						    	appendTo: "body", 
						    	helper: "clone", 
						    	revert: true,
						    	containment : "document",
						    	start: function(event, ui) {
						    		ajaxcart.dragging = true;

							    	//set the viewport meta tag for mobile devices; required for drag and drop
									if (ajaxcart.isMobile || ajaxcart.isTablet) {		
										ajaxcartTools.setViewportMeta();
									}

						    		//activate tooltip
						    		if (ajaxcart.enableTooltip){	
						    			if (!isSaleable) {
						    				jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar +' span.tooltip-sidebar').remove();
						    			}
						    			
										if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 8){
						    				jQueryAC('span.tooltip-sidebar').css({'display': 'block'});
						    				jQueryAC('span.tooltip-sidebar').css({'top': '-35'});
						    			} else {
						    				jQueryAC('span.tooltip-sidebar').animate({opacity: "show", top: "-31"}, "fast");
						    			}
						    		}

								    if (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 3) {
									    //center floaters
					        			jQueryAC('#cart-floater'+imgContainer.attr('product')).css({'top':(img.offset().top+height/2-50)});					    
					        			jQueryAC('#cart-floater'+imgContainer.attr('product')).css({'left':(img.offset().left+width/2-50)});	
					        			jQueryAC('#compare-floater'+imgContainer.attr('product')).css({'top':(img.offset().top+height/2-50)});					    
					        			jQueryAC('#compare-floater'+imgContainer.attr('product')).css({'left':(img.offset().left+width/2-50)});	
					        			jQueryAC('#wishlist-floater'+imgContainer.attr('product')).css({'top':(img.offset().top+height/2-50)});					    
					        			jQueryAC('#wishlist-floater'+imgContainer.attr('product')).css({'left':(img.offset().left+width/2-50)});	
					        		}

						    		ajaxcart.initFloaters(imgContainer.attr('product'));
						    		
							    	jQueryAC('.ui-draggable-dragging').css({'z-index':'999999'});
							    	
									if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 9){
							    		imgContainer.css({'display' : 'none'});
							    		
							    		imgContainer.find('.draggable-bkg').css({'display' : 'none'});
							    		jQueryAC('.ui-draggable-dragging').find('.draggable-bkg').css({'display' : 'none'});
							    	} else {
							    		imgContainer.css({'opacity' : '0'});
							    		//add image clone hover effects
										jQueryAC('.ui-draggable-dragging').css({'width':'auto','height':'auto'});
							    		jQueryAC('.ui-draggable-dragging').addClass('focus');
							    	}

							    	if (ajaxcart.dropEffect != 'noeffect') {
										img.css({'border-radius' : '50%', 'box-shadow':'0 2px 0px 1px rgba(0, 0, 0, 0.1)'});
										imgContainer.find('.draggable-bkg').css({'border-radius' : '50%'});
									}
							    	
							    	//ajaxcart.dragContainer is used in jquert-ui.js
						    		ajaxcart.dragContainer = imgContainer;			    		
						    	},
						    	stop: function(event, ui) {		
									if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 9){
										if (ajaxcart.itemDropped) {	
											imgContainer.fadeIn();
										} else {
											imgContainer.css({'display' : 'block'});
							    			imgContainer.find('.draggable-bkg').css({'display' : 'block'});
										}
									} else {
									    imgContainer.css({'opacity' : '1'});
								    	imgContainer.css({'transform' : 'scale(1)'});						    	
								    }
							    	
							    	imgContainer.find('.draggable-bkg').removeAttr('style');
							    	img.removeAttr('style');

							    	//remove the viewport meta tag for mobile devices
									if (ajaxcart.isMobile || ajaxcart.isTablet) {	
										if (ajaxcart.initialViewport) {
							    			jQueryAC('meta[name="viewport"]').attr('content', ajaxcart.initialViewport);
							    		} else {
							    			jQueryAC('meta[name="viewport"]').attr('content', '');
							    		}
							    	}

									ajaxcart.itemDropped = false;
						    	}
						    })
						} else {
							imgContainer.addClass('default-cursor');
						}
					}
				}
			})	
		} 
	},	
	
	//Sets the cart sidebar as a droppable area	
	makeCartDroppableArea: function() { 
	    jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).droppable({
	    	accept: function() { return true; },
	    	over: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['cart']){
	    			jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar + ' div').first().addClass('draggable-over');
	    		}
	    	},
	    	out: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['cart']){
	    			jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar + ' div').first().removeClass('draggable-over');
	    		}
	    	},
	    	drop: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['cart']){
		    		ajaxcart.itemDropped = true;
		    		ajaxcart.initAjaxcart(dragDropProducts[ui.draggable.attr('product')]['cart'], ui.draggable, false);		 
	    			jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar + ' div').first().removeClass('draggable-over');
	    		}
	    	}
	    })		
	},
	
	//Sets the compare sidebar as a droppable area
	makeCompareDroppableArea: function() { 
	    jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).droppable({
	    	accept: function() { return true; },
	    	over: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['compare']){
	    			jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar + ' div').first().addClass('draggable-over');
	    		}
	    	},
	    	out: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['compare']){
		    		jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar + ' div').first().removeClass('draggable-over');
		    	}
	    	},
	    	drop: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['compare']){
	    			ajaxcart.itemDropped = true;
					ajaxcart.addToCompare(dragDropProducts[ui.draggable.attr('product')]['compare'], false);
					jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar + ' div').first().removeClass('draggable-over');
				}
	    	}
	    })
	},
	
	//Sets the wishlist sidebar as a droppable area
	makeWishlistDroppableArea: function() { 
	    jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar, ajaxcart.updateWindow.document).droppable({
	    	accept: function() { return true; },
	    	over: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['wishlist']){
	    			jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar +' div').first().addClass('draggable-over');
	    		}
	    	},
	    	out: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['wishlist']){
		    		jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar +' div').first().removeClass('draggable-over');
		    	}
	    	},
	    	drop: function( event, ui ) {
	    		if(ui.draggable.attr('product') && dragDropProducts[ui.draggable.attr('product')]['wishlist']){
		    		ajaxcart.itemDropped = true;
					ajaxcart.addToWishlist(dragDropProducts[ui.draggable.attr('product')]['wishlist'],false);
					jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar +' div').first().removeClass('draggable-over');
				}
	    	}
	    })
	},

	//displays the floaters
	initFloaters: function(productId) {
		if (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 3) {
			this.floaterTotal = 0;
			this.displayCartFloater = this.displayFloater(jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar), productId, 'cart');
			this.displayCompareFloater = this.displayFloater(jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar), productId, 'compare');
			this.displayWishlistFloater = this.displayFloater(jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar), productId, 'wishlist');

		    if (this.displayCartFloater) {
		        this.cartFloater = jQueryAC('#cart-floater'+productId);
		        
			    //remove any initial classes
		    	this.cartFloater.removeClass('animated animate-mouse-over bounce-'+ajaxcart.cartFloaterPosition+' ac-floater-'+ajaxcart.cartFloaterPosition+' return-'+ajaxcart.cartFloaterPosition); 
		        this.cartFloaterPosition = this.getFloaterPosition('cart');
		       	this.cartFloater.addClass('animated bounce-'+this.cartFloaterPosition);

				var cartFloater = this.cartFloater;
				var cartFloaterPosition = this.cartFloaterPosition;
		        setTimeout(function() { if (ajaxcart.dragging) { cartFloater.addClass('ac-floater-'+cartFloaterPosition); cartFloater.removeClass('animated bounce-'+cartFloaterPosition); ajaxcart.checkOverlap(); } }, 500);
		        
		        if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion < 10) {
		        	cartFloater.addClass('ac-floater-'+cartFloaterPosition);
		        }
		    } else {
		    	this.cartFloater = false;
		    }
		    
		    if (this.displayCompareFloater) {
		        this.compareFloater = jQueryAC('#compare-floater'+productId);

			    //remove any initial classes
		    	this.compareFloater.removeClass('animated animate-mouse-over bounce-'+ajaxcart.compareFloaterPosition+' ac-floater-'+ajaxcart.compareFloaterPosition+' return-'+ajaxcart.compareFloaterPosition); 
		        this.compareFloaterPosition = this.getFloaterPosition('compare');
		        this.compareFloater.addClass('animated bounce-'+this.compareFloaterPosition);

				var compareFloater = this.compareFloater;
				var compareFloaterPosition = this.compareFloaterPosition;
		        setTimeout(function() { if (ajaxcart.dragging) { compareFloater.addClass('ac-floater-'+compareFloaterPosition); compareFloater.removeClass('animated bounce-'+compareFloaterPosition); ajaxcart.checkOverlap(); } }, 500);

		        if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion < 10) {
		        	compareFloater.addClass('ac-floater-'+compareFloaterPosition);
		        }
		    } else {
		    	this.compareFloater = false;
		    }

		    if (this.displayWishlistFloater) {
			    this.wishlistFloater = jQueryAC('#wishlist-floater'+productId);

			    //remove any initial classes
		    	this.wishlistFloater.removeClass('animated animate-mouse-over bounce-'+ajaxcart.wishlistFloaterPosition+' ac-floater-'+ajaxcart.wishlistFloaterPosition+' return-'+ajaxcart.wishlistFloaterPosition); 
		        this.wishlistFloaterPosition = this.getFloaterPosition('wishlist');
			    this.wishlistFloater.addClass('animated bounce-'+this.wishlistFloaterPosition);

				var wishlistFloater = this.wishlistFloater;
				var wishlistFloaterPosition = this.wishlistFloaterPosition;
		        setTimeout(function() { if (ajaxcart.dragging) { wishlistFloater.addClass('ac-floater-'+wishlistFloaterPosition); wishlistFloater.removeClass('animated bounce-'+wishlistFloaterPosition); ajaxcart.checkOverlap(); } }, 500);

		        if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion < 10) {
		        	wishlistFloater.addClass('ac-floater-'+wishlistFloaterPosition);
		        }
		    } else {
		    	this.wishlistFloater = false;
		    }
		}
	},

	//returns true if the floater should be displayed
	displayFloater: function(block, productId, type) {
		if (block.length > 0 && ajaxcart.dragdropCategory != 3 && block.is(':visible') && !block.hasClass('ac-header')) {
			var blockOffset = block.offset(),
				viewportWidth = window.innerWidth,
		        viewportHeight = window.innerHeight;

			if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion <= 9) {
				var viewport = document.viewport.getDimensions(); // Gets the viewport as an object literal
					viewportWidth = viewport.width; // Usable window width
					viewportHeight = viewport.height; // Usable window height
			}

		    var documentScrollTop = jQueryAC(window).scrollTop(),
		        documentScrollLeft = jQueryAC(window).scrollLeft(),

		        top = documentScrollTop,
		        bottom = documentScrollTop + viewportHeight,
		        left = documentScrollLeft,
		        right = documentScrollLeft + viewportWidth;

		    //display the floater if the sidebar block isn't visible
			if ((((block.height()/4 + blockOffset.top) < top) || ((3*block.height()/4 + blockOffset.top) > bottom) || ((block.width()/4 + blockOffset.left) < left) || ((3*block.width()/4 + blockOffset.left) > right)) && dragDropProducts[productId] && dragDropProducts[productId][type]) {
				return true;
			}	 		
		} else if (dragDropProducts[productId] && dragDropProducts[productId][type]) {
			return true;
		}

		return false;  
	},

	//returns the position where the floater should appear, depending on the position of the sidebar blocks
	getFloaterPosition: function(floaterId) {
		ajaxcart.floaterTotal++;

		if (ajaxcart.floaterTotal==1) {
			return 'top';
		} else if (ajaxcart.floaterTotal==2) {
			if (!this.displayCartFloater && jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).length>0) {
				if (jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).offset().left>ajaxcart[floaterId+'Floater'].offset().left) {
					return 'left';
				} else {
					return 'right';
				}
			} else if (!this.displayCompareFloater && jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).length>0) {
				if (jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).offset().left>ajaxcart[floaterId+'Floater'].offset().left) {
					return 'left';
				} else {
					return 'right';
				}
			} else if (!this.displayWishlistFloater && jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar).length>0) {
				if (jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar).offset().left>ajaxcart[floaterId+'Floater'].offset().left) {
					return 'left';
				} else {
					return 'right';
				}
			} else {
				return 'left';
			}
		} else if (ajaxcart.floaterTotal==3) {
			if (this.compareFloaterPosition=='left') {
				return 'right';
			} else {
				return 'left';
			}
		}
	},

	//determines if the product image is over a floater
	overlaps: function(a, b) {
	    function getPositions( elem ) {
	        var pos, width, height, adjustment;
	        pos = jQueryAC( elem ).offset();
	        width = jQueryAC( elem ).width();
	        height = jQueryAC( elem ).height();
	        //add adjustments for product image
	        adjustment = jQueryAC(elem).hasClass('ac-floater') ? 0 : 30;

	        //increase width/height of floater to take into account the scale effect
	        width += (jQueryAC(elem).hasClass('ac-floater') && jQueryAC(elem).hasClass('mouse-over')) ? 20 : 0;
	        height += (jQueryAC(elem).hasClass('ac-floater') && jQueryAC(elem).hasClass('mouse-over')) ? 20 : 0;
	        return [ [ pos.left + adjustment, pos.left + width - adjustment ], [ pos.top + adjustment, pos.top + height - adjustment ] ];
	    }

	    function comparePositions( p1, p2 ) {
	        var r1, r2;
	        r1 = p1[0] < p2[0] ? p1 : p2;
	        r2 = p1[0] < p2[0] ? p2 : p1;
	        return r1[1] > r2[0] || r1[0] === r2[0];
	    }

    	if (b && b.css('opacity')==1 && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 3)) {
	        var pos1 = getPositions( a ),
	            pos2 = getPositions( b );
	        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
	    } else {
	    	return false;
	    }
	},

	//add floater hover effects
	checkOverlap: function() {
		if (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 3) {
			var draggableHelper = jQueryAC('.ui-draggable-dragging');
			if (this.overlaps(draggableHelper, ajaxcart.cartFloater) && !this.floaterRunning.cart) {
				if (ajaxcart.compareFloater) {
					ajaxcart.compareFloater.removeClass('mouse-over');
				}
				if (ajaxcart.wishlistFloater) {
					ajaxcart.wishlistFloater.removeClass('mouse-over');		
				}

				ajaxcart.cartFloater.addClass('animate-mouse-over mouse-over');		
				this.floaterRunning.cart = true;
				jQueryAC('#cart-livicon'+draggableHelper.attr('product')).trigger('mouseover');
			} else if (ajaxcart.cartFloater && this.floaterRunning.cart && !this.overlaps(draggableHelper, ajaxcart.cartFloater)) {
				this.floaterRunning.cart = false;
				this.floaterRunning.compare = false;
				this.floaterRunning.wishlist = false;
				ajaxcart.cartFloater.removeClass('mouse-over');			
			}	

			if (this.overlaps(draggableHelper, ajaxcart.compareFloater) && !this.floaterRunning.compare) {	
				if (ajaxcart.cartFloater) {
					ajaxcart.cartFloater.removeClass('mouse-over');		
				}
				if (ajaxcart.wishlistFloater) {
					ajaxcart.wishlistFloater.removeClass('mouse-over');		
				}

				ajaxcart.compareFloater.addClass('animate-mouse-over mouse-over');	
				this.floaterRunning.compare = true;
				jQueryAC('#compare-livicon'+draggableHelper.attr('product')).trigger('mouseover');
			} else if (ajaxcart.compareFloater && this.floaterRunning.compare && !this.overlaps(draggableHelper, ajaxcart.compareFloater)) {
				this.floaterRunning.cart = false;
				this.floaterRunning.compare = false;
				this.floaterRunning.wishlist = false;
				ajaxcart.compareFloater.removeClass('mouse-over');			
			}	

			if (this.overlaps(draggableHelper, ajaxcart.wishlistFloater) && !this.floaterRunning.wishlist) {	
				if (ajaxcart.cartFloater) {
					ajaxcart.cartFloater.removeClass('mouse-over');		
				}
				if (ajaxcart.compareFloater) {
					ajaxcart.compareFloater.removeClass('mouse-over');		
				}

				ajaxcart.wishlistFloater.addClass('animate-mouse-over mouse-over');	
				this.floaterRunning.wishlist = true;
				jQueryAC('#wishlist-livicon'+draggableHelper.attr('product')).trigger('mouseover');
			} else if (ajaxcart.wishlistFloater && this.floaterRunning.wishlist && !this.overlaps(draggableHelper, ajaxcart.wishlistFloater)) {
				this.floaterRunning.wishlist = false;
				this.floaterRunning.cart = false;
				this.floaterRunning.compare = false;
				ajaxcart.wishlistFloater.removeClass('mouse-over');			
			}	
		}
	},

	//MAIN functions
	save: function(transport){
		if (transport){
			try{
				response = eval('(' + transport + ')');
			}
			catch (e) {
				response = {};
			}
		}
		
		if (response.error){
			this.hasError = true;
			ajaxcartTools.resetLoadWaiting('ajaxcart-loading');
			
			if ((typeof response.message) == 'string') {
				alert(response.message);
			} else {
				alert(response.message.join("\n"));
			}
			return false;
		}
		
		if (response.notice){
			if ((typeof response.message) == 'string') {
				alert(response.notice_message);
			} else {
				alert(response.notice_message.join("\n"));
			}
		}
		
		if (response.redirect) {
			location.href = response.redirect;
            return;
        }       

		this.successPopupDelay = 200; 

        //update ajaxcart blocks
		if (response.update_section) {
			this.updateSections(response);
		}	
		
		ajaxcartTools.resetLoadWaiting('ajaxcart-loading');
		
		//close options popup
		if (response.close_popup && jQueryAC('#'+response.close_popup+'-popup-container').css("left")=='0px') {	
			ajaxcartTools.hidePopup(response.close_popup, false);  
		} 
		
		if (response.popup) {
			if ((response.popup == "success" && this.showNotification == 1) || response.popup != "success") {
				setTimeout(function() {ajaxcartTools.showPopup(response.popup,response.is_action);}, ajaxcart.successPopupDelay);
			}		
		}
	},	
	
	failure: function(){
		location.href = this.failureUrl;
	},
	
	//CART functions	
	//add product to cart via ajax
	initAjaxcart: function(url,button,popup){
		//if popup or product page
		if (popup == 'options' || (!url && jQueryAC('#product_addtocart_form').length > 0)){
			if (!url && jQueryAC('#product_addtocart_form').length > 0){
				var formElement = jQueryAC('#product_addtocart_form');
				var formAction = String(formElement.attr("action"));
			    var productId = ajaxcartTools.getProductIdFromUrl(formAction,'product');
			} else {
				var productId = ajaxcartTools.getProductIdFromUrl(url,'product');
			}
			
			if (jQueryAC('#qty').length > 0) {
				var qtyElement = jQueryAC('#qty');									
				// Verify if the qty has an invalid entry
				var oldValue = parseFloat(qtyElement.val());
				if (isNaN(oldValue)){
				    qtyElement.val(productMinMax[productId]['min']);
				}			
				// Verify the minim qty added to the cart
				if ( qtyElement.val() <productMinMax[productId]['min']) {
				    alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['min'] + '.');
				    qtyElement.val(productMinMax[productId]['min']);
				    return;
				}
				// Verify if the qty added to the cart is smaller than the maximum qty
				if (qtyElement.val()>productMinMax[productId]['max']) {
				    alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
				    qtyElement.val(productMinMax[productId]['max']);
				    return;
				} 	
			}
			
			if(jQueryAC('#is_grouped_qty').length > 0){
				var inputElements = document.getElementsByTagName('input');
				for ( var j = 0; j<inputElements.length; j++ ) {
					if (inputElements[j].name != null && inputElements[j].name != '') {
						var qtyName = inputElements[j].getAttribute("name").toString();
						var result = qtyName.search("super_group");
						var productId = qtyName.replace("super_group[","").replace("]","");
						
						if ( result != -1 ) {
							var qty = inputElements[j].value;
							// Verify if the qty has an invalid entry
							var oldValue = parseFloat(qty);
							if (isNaN(oldValue)){
								inputElements[j].value = productMinMax[productId]['min'];
							}	
							// Verify the minim qty added to the cart
							if ( oldValue < 0) {
								alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['min'] + '.');
								inputElements[j].value = productMinMax[productId]['min'];
								return;
							}
							// Verify if the qty added to the cart is smaller than the maximum qty
							if (oldValue>productMinMax[productId]['max']) {
								alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
								inputElements[j].value = productMinMax[productId]['max'];
								return;
							} 							
						}
					}
				}				
			}					
			
			if (!url && jQueryAC('#product_addtocart_form').length > 0){		
				formId = 'product_addtocart_form';	
				var ajaxcartProductAddToCartForm = productAddToCartForm;							
				var addToCartUrl = this.initUrl;
			} else {
				formId = 'options_addtocart_form';					
				var ajaxcartProductAddToCartForm = new VarienForm(formId);	

				//if cart page, add param to load new cart page html as well	
				if (ajaxcart.updateWindow.location.href.indexOf('checkout/cart')!=-1 && jQueryAC('#' + formId + ' #is_cart_page').length == 0) {
					jQueryAC('#'+formId).append('<input type="hidden" value="1" id="is_cart_page" name="is_cart_page" />');
				}	
				
				//if compare popup add param to load the success popup
				if (window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup).length > 0 && jQueryAC('#'+formId+' #is_compare_popup').length == 0) {
					jQueryAC('#'+formId).append('<input type="hidden" value="1" id="is_compare_popup" name="is_compare_popup" />');
				}	
				var addToCartUrl = url;
			}
			
			if (jQueryAC('#' + formId + ' #redirect_url').length == 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="'+ window.location.href +'" id="redirect_url" name="redirect_url" />');
			}		
			
			if (ajaxcartProductAddToCartForm.validator.validate() && !this.ajaxCartRunning) {
				if (button && !disablePopupProductLoader) {
					this.addToCartButton = button;
				}
				this.ajaxCartRunning = true;
				ajaxcartTools.setLoadWaiting('ajaxcart-loading',true);
				
				//disable all buttons, inputs, links etc.
				jQueryAC('#ac-popup-top-bkg').show();

				jQueryAC('#'+formId).ajaxSubmit({ 
			        url:  addToCartUrl,      
			        type: 'post',
			        dataType: 'text',
			        success: function(response) {
				        ajaxcart.save(response);
				    },		
			        error: function() {
				        ajaxcart.failure();
				    }
			    }); 
			}
		} else {
			var productId = ajaxcartTools.getProductIdFromUrl(url,'product');
			if (jQueryAC('#qty-' + productId).length > 0) {
				qtyElement = jQueryAC(button).closest(".ac-product-list").find('#qty-' + productId);
			
				var qty = qtyElement.val();
			
				// Verify if the qty has an invalid entry
				var oldValue = parseFloat(jQueryAC('#qty-'+productId).val());
				if (isNaN(oldValue)){
					qtyElement.val(productMinMax[productId]['min']);
				}
				// Verify the minim qty added to the cart
				if ( qty < productMinMax[productId]['min']) {
					alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['min'] + '.');
					qtyElement.val(productMinMax[productId]['min']);
					return;
				}		
				// Verify if the qty added to the cart is smaller than the maximum qty
				if (qty>productMinMax[productId]['max']) {
					alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
					qtyElement.val(productMinMax[productId]['max']);
					return;
				} 
			} else {
				var qty = productMinMax[productId]['min'];				
			}
			
			if (!this.ajaxCartRunning) {
				var formData = {};
				formData.qty = qty;
				formData.redirect_url = window.location.href;
				if (popup=='success') {
					formData.close_popup = 'success';
					ajaxcartTools.deactivateTimer();
					jQueryAC("#countdownToClose").html('');
				}
				
				//if cart page, add param to load new cart page html as well	
				if (ajaxcart.updateWindow.location.href.indexOf('checkout/cart')!=-1) {
					formData.is_cart_page = true;
				}
				
				//if compare popup add param to load the success popup
				if (window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup).length > 0) {
					formData.is_compare_popup = true;
				}

				if (droppableSidebars['cart'] && !popup && jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).length>0) {
					ajaxcartTools.jump(productId, jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar), button);
				}

				if (popup=='success' && jQueryAC('#ac-cart-button'+productId).length>0) {
					this.addToCartButton = jQueryAC('#ac-cart-button'+productId);
				}
				ajaxcartTools.setLoadWaiting('ajaxcart-loading',true);		

				this.ajaxCartRunning = true;
				
				jQueryAC(this).ajaxSubmit({ 
			        url:  url,      
			        type: 'post',
			        data: formData,
			        dataType: 'text',
			        success: function(response) {
				        ajaxcart.save(response);
				    },		
			        error: function() {
				        ajaxcart.failure();
				    }
			    }); 
			}
		}
	},	
	
	//update cart sidebar block
	updateCart: function(response){
		if (response.update_section.html_cart) {
			for (var i=0;i<response.update_section.html_cart.length;i++) {
				if (response.update_section.html_cart[i] && this.updateWindow.document.getElementById(ajaxcart.cartSidebar+i)) {
		    		//add empty/update cart actions to sidebar
			    	var content = response.update_section.html_cart[i];  			 				    					 			
        			var jsScripts = '';
        			var contentScripts = content.extractScripts();
        			if (contentScripts != null && contentScripts != ''){
        				for (var j=0; j < contentScripts.length; j++){
							if (typeof(contentScripts[j]) != 'undefined'){
        						jsScripts += '<script type="text/javascript">'+contentScripts[j]+'</script>';
        					}
        				}
        			}    
			    					 			
		    		if (content.indexOf("ac-qty") != -1 && !jQueryAC('#'+ajaxcart.cartSidebar + i).hasClass('ac-header')) { 
			    	    var actionsContainer = '<div class="actions" id="ajaxcart-actions" style="border-bottom:none;">';
					    actionsContainer += '<button onclick="ajaxcart.emptyCartConfirmation();" class="button left" title="' + Translator.translate('Empty Cart').stripTags() + '" type="button"><span><span>' + Translator.translate('Empty Cart').stripTags() + '</span></span></button>';
					    if (ajaxcart.sidebarQty == 1){
					    	actionsContainer += '<button onclick="ajaxcart.updateQty(\'\',false,\'' + ajaxcart.cartSidebar + i + '\')" class="button" title="' + Translator.translate('Update Cart').stripTags() + '" type="button"><span><span>' + Translator.translate('Update Cart').stripTags() + '</span></span></button>';
					    }		
					    actionsContainer += '</div>';		
					    
				    	var wrapped = jQueryAC('<div>'+content+'</div>');
						wrapped.find('div').first().append(actionsContainer);
			    		content = wrapped.html();
			    	} 	

			    	content += jsScripts;		    	

					//extract jquery events
					var bindings = ajaxcartTools.extractBindings(ajaxcart.cartSidebar+i);
					
					//flash cart sidebar
			  		if (window.location.href.indexOf('catalog/product_compare/index/')==-1 && jQueryAC('#'+ajaxcart.comparePopup).length == 0) {
						var cartSidebar = this.updateWindow.document.getElementById(ajaxcart.cartSidebar+i);	
					    jQueryAC(cartSidebar).hide().fadeIn(300);					
					}
			    	
			    	//update cart sidebar
					ajaxcartTools.updateSection(content,(ajaxcart.cartSidebar+i));	

					//re-apply jquery events
					ajaxcartTools.reapplyBindings(bindings);
					
					//add qty inputs + increase/decrease buttons
					if (jQueryAC('#'+ajaxcart.comparePopup).length==0) {
						if (jQueryAC('#'+ajaxcart.cartSidebar+i, ajaxcart.updateWindow.document).html().indexOf('"<ac-qty>') != -1) {
							//if input exists
							jQueryAC('#'+ajaxcart.cartSidebar+i+' input', ajaxcart.updateWindow.document).each(function() {
								var input = jQueryAC(this);
								if (input.val().indexOf('<ac-qty>') != -1) {	
									var value = input.val().replace('<ac-qty>','').replace('</ac-qty>','');
									var itemId = value.split('-')[0];
									var qty = value.split('-')[1];
									input.val(qty);
								    input.attr('id','sidebar-qty-' + itemId);
								    input.attr('name','cart['+itemId+'][qty]');

							    	ajaxcart.addQtyBoxHtml('ac-cart-sidebar', jQueryAC(this), 'item'+itemId);	
								}
							});
						} else if (jQueryAC('#'+ajaxcart.cartSidebar+i, ajaxcart.updateWindow.document).html().indexOf('<ac-qty>') != -1) {
							//if input doesn't exists
							if (ajaxcart.sidebarQty==1) {
								jQueryAC('#'+ajaxcart.cartSidebar+i+' ac-qty', ajaxcart.updateWindow.document).each(function() {
									var qtyTag = jQueryAC(this);
									var value = qtyTag.text();
									var itemId = value.split('-')[0];
									var qty = value.split('-')[1];
									if (jQueryAC('#'+ajaxcart.cartSidebar+i+' #sidebar-qty-'+itemId).length==0) {
										qtyTag.html('<input id="sidebar-qty-'+itemId+'" class="input-text qty" name="cart['+itemId+'][qty]" value="'+qty+'" />');
										qtyTag.contents().unwrap();

									    ajaxcart.addQtyBoxHtml('ac-cart-sidebar', jQueryAC('#'+ajaxcart.cartSidebar+i+' #sidebar-qty-'+itemId, ajaxcart.updateWindow.document), 'item'+itemId);	
									}
								});
							}				
						}
					}

					//add tooltip
					if (i==ajaxcart.lastCartSidebar && ajaxcart.enableTooltip != 0 && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['cart'] && !jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar + ' span.tooltip-sidebar', ajaxcart.updateWindow.document).length > 0 && !jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).hasClass('ac-header')){		
						jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar + ' div', ajaxcart.updateWindow.document).first().append('<span class="tooltip-sidebar">' + Translator.translate('Buy Me!').stripTags() + '</span>');
					}
					
					//make the cart sidebar a droppable area	
					if(i==ajaxcart.lastCartSidebar && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['cart'] && !jQueryAC('#'+ajaxcart.cartSidebar + ajaxcart.lastCartSidebar).hasClass('ac-header')) {
					    ajaxcart.makeCartDroppableArea();		
					}
				    
				    truncateOptions();						        
				    ajaxcart.updateWindow.dispatchLiveUpdates('cart_sidebar', false);
			    }
		    }
	    }
	    this.updateCartLink(response);
	},
	
	//update cart link
	updateCartLink: function(response){
		if (response.update_section.html_cart_link) {
			if (!cartLink) {
	    		jQueryAC('#ac-links a', ajaxcart.updateWindow.document).each(function() {
					var href = jQueryAC(this, ajaxcart.updateWindow.document).attr('href');
					if (href != null && href != '' && href.indexOf('/checkout/cart/') != -1) {
						jQueryAC(this, ajaxcart.updateWindow.document).html(response.update_section.html_cart_link);
					}    			
				});
			} else {
				jQueryAC(cartLink, ajaxcart.updateWindow.document).html(response.update_section.html_cart_link);
			}
    	}
	},	

	//remove cart item
	removeCartItem: function(itemId){ 
		if(confirm(Translator.translate("Are you sure you would like to remove this item from the shopping cart?").stripTags())){
			if (!this.ajaxCartRunning) {
				this.ajaxCartRunning = true;
				
				var formData = {};
				if(jQueryAC('#'+ajaxcart.cartPage).length > 0) {
					formData[jQueryAC('#cart-qty-'+itemId).attr('name')] = 0;
				} else {
					formData[jQueryAC('#sidebar-qty-'+itemId).attr('name')] = 0;
				}
				
				ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);			
				
				jQueryAC(this).ajaxSubmit({ 
				    url:  this.updateCartUrl,      
				    type: 'post',
				    data: formData,
				    dataType: 'text',
				    success: function(response) {
				        ajaxcart.save(response);
				    },		
				    error: function() {
				        ajaxcart.failure();
				    }
				}); 		
			} 	
		} 	
    },
	
	//empty cart
	emptyCart: function(url){ 
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			var formData = {};
			if (ajaxcart.updateWindow.location.href.indexOf('checkout/cart/')!=-1) {
				formData.is_cart_page = true;
			}

			formData.redirect_url = window.location.href;
		
			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
												 
			jQueryAC(this).ajaxSubmit({ 
			    url:  url,      
			    type: 'post',
				data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    },

	emptyCartConfirmation: function(){
		if(confirm(Translator.translate("Are you sure you would like to remove all the items from the shopping cart?").stripTags())){
			ajaxcart.emptyCart(this.clearCartUrl);
		}	
	},	
	
	//update cart qty
	updateQty: function(qtyElementId,isIncrease,button){ 
		if (!this.ajaxCartRunning) {
			var qtyElement = jQueryAC('#'+qtyElementId);
			if (typeof button == 'string') {
				var formId = button;
			} else {
				var formId = jQueryAC(button).closest(".ac-cart-sidebar").attr('id');
				if (jQueryAC(button).closest(".ac-cart-sidebar").find("#" + qtyElementId).length) {
					qtyElement = jQueryAC(button).closest(".ac-cart-sidebar").find("#" + qtyElementId);
				}
			}
			
			this.ajaxCartRunning = true;
			
			if(qtyElementId != ''){
				var itemId = 'item'+qtyElementId.replace('sidebar-qty-', '');
				if (isIncrease){
					qtyElement.val(parseFloat(qtyElement.val()) + productMinMax[itemId]['inc']);
				} else {
					qtyElement.val(parseFloat(qtyElement.val()) - productMinMax[itemId]['inc']);
				}
			}
			
			var formData = {};
			formData.redirect_url = window.location.href;
			jQueryAC('#'+formId+' :input').each(function() {
				if (qtyElementId!='' && jQueryAC(this).attr('name') && jQueryAC(this).attr('name')==jQueryAC('#'+qtyElementId).attr('name')) {
					formData[jQueryAC(this).attr('name')] = jQueryAC(this).val();	
				} else if (qtyElementId=='' && jQueryAC(this).attr('name')) {
					formData[jQueryAC(this).attr('name')] = jQueryAC(this).val();						
				}
			}); 

			if (qtyElementId != '' && !isIncrease && qtyElement.val() == 0){
				// qtyElement.val() = 1;
				if (jQueryAC(button).closest(".ac-cart-sidebar").find("#" + qtyElementId).length) {
					qtyElement = jQueryAC(button).closest(".ac-cart-sidebar").find("#" + qtyElementId);
					qtyElement.val(parseFloat(qtyElement.val()) + productMinMax[itemId]['inc']);
				}
			}
			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);	
												 
			jQueryAC(this).ajaxSubmit({ 
			    url:  this.updateCartUrl,      
			    type: 'post',
				data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    },
	
	//SHOPPING CART PAGE functions 		
	//update cart page blocks
	updateCartPage: function(response){
		if (response.update_section.html_cart_page && this.updateWindow.document.getElementById(ajaxcart.cartPage)) {
    		ajaxcartTools.updateSection(response.update_section.html_cart_page,ajaxcart.cartPage);	

    		jQueryAC('#'+ajaxcart.cartPage+' input', ajaxcart.updateWindow.document).each(function() {
				//add increase/decrease buttons to qty inputs
				var input = jQueryAC(this);
				if (input.attr('name') != null && input.attr('name') != '' && input.attr('name').indexOf('cart') != -1 && input.attr('name').indexOf('[qty]') != -1) {	
				    var itemId = input.attr('name').replace("cart[","").replace("][qty]","");
				    input.attr('id','cart-qty-' + itemId);
				    ajaxcart.addQtyBoxHtml('ac-cart-page', jQueryAC(this), 'item'+itemId);	
				}
			        
			    ajaxcart.updateWindow.dispatchLiveUpdates('cart', false);
			});
	    }
	},
	
	//update cart page qty
	updateCartQty: function(qtyElementId,isIncrease){ 
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			if(qtyElementId != ''){
				var itemId = 'item'+qtyElementId.replace('cart-qty-', '');
				if (isIncrease){
					jQueryAC('#'+qtyElementId).val(parseFloat(jQueryAC('#'+qtyElementId).val()) + productMinMax[itemId]['inc']);
				} else {
					jQueryAC('#'+qtyElementId).val(parseFloat(jQueryAC('#'+qtyElementId).val()) - productMinMax[itemId]['inc']);
				}
			}

			var formElements = document.getElementsByTagName('form');
			for ( var i = 0; i<formElements.length; i++ ) {
				if (formElements[i].action != null && formElements[i].action != '') {
					var formUrl = formElements[i].getAttribute("action").toString();
					if ( formUrl.search("checkout/cart/updatePost/") != -1 ) {
						var form = formElements[i];
						break;
					} 	
				} 	
			} 			
			
			var formData = {};
			formData.redirect_url = window.location.href;
			jQueryAC(form).find('input').each(function() {
				if (qtyElementId!='' && jQueryAC(this).attr('name') && jQueryAC(this).attr('name')==jQueryAC('#'+qtyElementId).attr('name')) {
					formData[jQueryAC(this).attr('name')] = jQueryAC(this).val();	
				} else if (qtyElementId=='' && jQueryAC(this).attr('name') && (jQueryAC(this).attr('type') != 'checkbox' || (jQueryAC(this).attr('type') == 'checkbox' && jQueryAC(this).is(':checked')))) {
					formData[jQueryAC(this).attr('name')] = jQueryAC(this).val();						
				}
			});  
			
			if (qtyElementId != '' && !isIncrease && jQueryAC('#'+qtyElementId).val() == 0){
				jQueryAC('#'+qtyElementId).val(1);
			}
			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
			
			jQueryAC(this).ajaxSubmit({ 
			    url:  this.updateCartUrl,      
			    type: 'post',
			    data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    },	
    
    //edit cart item from shopping cart page
    configureCartItem: function(url) {
	    if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;

			var formData = {};
			formData.redirect_url = window.location.href;

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
	
			jQueryAC(this).ajaxSubmit({ 
			    url:  url,      
			    type: 'post',
			    data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    },
	
	//update cart item; used in edit cart item popup on shopping cart page
	updateCartItem: function(url, button){ 
		if (!this.ajaxCartRunning) {	
			var formId = 'options_addtocart_form';	
			productId = this.itemProductId;	
			
			if (jQueryAC('#popup-qty').length > 0) {
			    var qtyElement = jQueryAC('#popup-qty');									
			    // Verify if the qty has an invalid entry
			    var oldValue = parseFloat(qtyElement.val());
			    if (isNaN(oldValue)){
			        qtyElement.val(productMinMax[productId]['min']);
			    }			
			    // Verify the minim qty added to the cart
			    if ( qtyElement.val() <productMinMax[productId]['min']) {
			        alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['min'] + '.');
			        qtyElement.val(productMinMax[productId]['min']);
			        return;
			    }
			    // Verify if the qty added to the cart is smaller than the maximum qty
			    if (qtyElement.val()>productMinMax[productId]['max']) {
			        alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
			        qtyElement.val(productMinMax[productId]['max']);
			        return;
			    } 	
			}
			
			if(jQueryAC('#is_grouped_qty').length > 0){
			    var inputElements = document.getElementsByTagName('input');
			    for ( var j = 0; j<inputElements.length; j++ ) {
			    	if (inputElements[j].name != null && inputElements[j].name != '') {
			    		var qtyName = inputElements[j].getAttribute("name").toString();
			    		var result = qtyName.search("super_group");
			    		var productId = qtyName.replace("super_group[","").replace("]","");
			    		
			    		if ( result != -1 ) {
			    			var qty = inputElements[j].value;
			    			// Verify if the qty has an invalid entry
			    			var oldValue = parseFloat(qty);
			    			if (isNaN(oldValue)){
			    				inputElements[j].value = productMinMax[productId]['min'];
			    			}	
			    			// Verify the minim qty added to the cart
			    			if ( oldValue <productMinMax[productId]['min']) {
			    				alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['min'] + '.');
			    				inputElements[j].value = productMinMax[productId]['min'];
			    				return;
			    			}
			    			// Verify if the qty added to the cart is smaller than the maximum qty
			    			if (oldValue>productMinMax[productId]['max']) {
			    				alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
			    				inputElements[j].value = productMinMax[productId]['max'];
			    				return;
			    			} 							
			    		}
			    	}
			    }				
			}				
				
			//if cart page, add param to load new cart page html as well	
			if (ajaxcart.updateWindow.location.href.indexOf('checkout/cart')!=-1 && jQueryAC('#'+formId+' #is_cart_page').length == 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="1" id="is_cart_page" name="is_cart_page" />');
			}		
				
			if (jQueryAC('#'+formId+' #redirect_url').length == 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="'+ window.location.href +'" id="redirect_url" name="redirect_url" />');
			}
			
			var ajaxcartProductAddToCartForm = new VarienForm(formId);
			
			if (ajaxcartProductAddToCartForm.validator.validate()) {
				this.ajaxCartRunning = true;
				if (button) {
					this.addToCartButton = button;
				}
				ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
				
				//disable all buttons, inputs, links etc.
				jQueryAC('#ac-popup-top-bkg').show();

				jQueryAC('#'+formId).ajaxSubmit({ 
			        url:  url,      
			        type: 'post',
			        dataType: 'text',
			        success: function(response) {
				        ajaxcart.save(response);
				    },		
			        error: function() {
				        ajaxcart.failure();
				    }
			    }); 
			}
		}
    }, 

	//update configurable product options from shopping cart page
	updateItemOptions: function(selectElement){ 
		if (!this.ajaxCartRunning && selectElement.value != '') {
			this.ajaxCartRunning = true;
			
			var formElements = document.getElementsByTagName('form');
			for ( var i = 0; i<formElements.length; i++ ) {
				if (formElements[i].action != null && formElements[i].action != '') {
					var formUrl = formElements[i].getAttribute("action").toString();
					if ( formUrl.search("checkout/cart/updatePost/") != -1 ) {
						var form = formElements[i];
						break;
					} 	
				} 	
			} 	
						
			var formData = {};
			formData.redirect_url = window.location.href;
			jQueryAC(form).find('select').each(function() {
				formData[jQueryAC(this).attr('name')] = jQueryAC(this).val();
			}); 
			
			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
	
			jQueryAC(this).ajaxSubmit({ 
			    url:  this.updateCartUrl,      
			    type: 'post',
			    data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		} 	
    },  
    
    //move cart item to wishlist
    moveToWishlist: function(url){ 
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			var formData = {};
			formData.is_cart_page = true;

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
			
			jQueryAC(this).ajaxSubmit({ 
			    url:  url,      
			    type: 'post',
			    data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    }, 
	
	//WISHLIST functions	
	//add product to wishlist via ajax
	addToWishlist: function(url, popup){
		if (jQueryAC('#product_addtocart_form').length > 0 && !popup){			
			if (jQueryAC('#qty')){
				var formAction = String(jQueryAC('#product_addtocart_form').attr("action"));
			    var productId = ajaxcartTools.getProductIdFromUrl(formAction,'product');
			    
				var qty = jQueryAC('#qty').val();
				// Verify if the qty has an invalid entry
				var oldValue = parseFloat(jQueryAC('#qty').val());
				if (isNaN(oldValue)){
					jQueryAC('#qty').val(productMinMax[productId]['min']);
				}			
				// Verify the minim qty added to the cart
				if ( qty <productMinMax[productId]['min']) {
					jQueryAC('#qty').val(productMinMax[productId]['min']);
				}
			}	
			
			if(jQueryAC('#is_grouped_qty').length > 0){
				var inputElements = document.getElementsByTagName('input');
				for ( var j = 0; j<inputElements.length; j++ ) {
					if (inputElements[j].name != null && inputElements[j].name != '') {
						var qtyName = inputElements[j].getAttribute("name").toString();
						var result = qtyName.search("super_group");
						var productId = qtyName.replace("super_group[","").replace("]","");
						
						if ( result != -1 ) {
							var qty = inputElements[j].value;
							// Verify if the qty has an invalid entry
							var oldValue = parseFloat(qty);
							if (isNaN(oldValue)){
								inputElements[j].value = productMinMax[productId]['min'];
							}	
							// Verify the minim qty added to the cart
							if ( oldValue <productMinMax[productId]['min']) {
								inputElements[j].value = productMinMax[productId]['min'];
							}
						}
					}
				}				
			}				
			
			var ajaxcartProductAddToCartForm = new VarienForm('product_addtocart_form');
			if (!this.ajaxCartRunning) {
				this.ajaxCartRunning = true;

				var redirectUrl = window.location.href;
				if (jQueryAC('#product_addtocart_form #redirect_url').length == 0) {
					jQueryAC('#product_addtocart_form').append('<input type="hidden" value="'+ redirectUrl +'" id="redirect_url" name="redirect_url" />');				
				}

				if (!ajaxcartLogin.loginPostResponse) {
					ajaxcartTools.setLoadWaiting('ajaxcart-loading',true);
				}
				
				jQueryAC('#product_addtocart_form').ajaxSubmit({ 
			        url:  url,      
			        type: 'post',
			        dataType: 'text',
			        success: function(response) {
				        ajaxcart.save(response);
				    },		
			        error: function() {
				        ajaxcart.failure();
				    }
			    }); 
			}
		} else {
			var productId = ajaxcartTools.getProductIdFromUrl(url,'product');
			if (jQueryAC('#qty-' + productId).length > 0) {
				var qty = jQueryAC('#qty-' + productId).val();
				// Verify if the qty has an invalid entry
				var oldValue = parseFloat(jQueryAC('#qty-'+productId).val());
				if (isNaN(oldValue)){
					jQueryAC('#qty-'+productId).val(productMinMax[productId]['min']);
				}
				// Verify the minim qty added to the cart
				if ( qty <productMinMax[productId]['min']) {
					jQueryAC('#qty-' + productId).val(productMinMax[productId]['min']);
				}
			} else {
				var qty = 1;
			}
			
			if (!this.ajaxCartRunning) {	
				var formData = {};
				formData.redirect_url = window.location.href;	
				formData.qty = qty;		
			
				//if wishlist page, add param to load new wishlist page html as well	
				if (jQueryAC(('#' + ajaxcart.wishlistPage), ajaxcart.updateWindow.document).length > 0) {
					formData.is_wishlist_page = true;	
				}	

				if (popup=='success') {
					formData.close_popup = 'success';
					ajaxcartTools.deactivateTimer();
					jQueryAC("#countdownToClose").html('');
				}			

				if (droppableSidebars['wishlist'] && !popup && jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar).length>0) {
					ajaxcartTools.jump(productId, jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar), false);
				}

				if (popup=='success' && jQueryAC('#ac-cart-button'+productId).length>0) {
					this.addToCartButton = jQueryAC('#ac-cart-button'+productId);
				}

				this.ajaxCartRunning = true;
				if (!ajaxcartLogin.loginPostResponse) {
					ajaxcartTools.setLoadWaiting('ajaxcart-loading',true);
				}
				
				jQueryAC(this).ajaxSubmit({ 
			        url:  url,      
			        type: 'post',
				    data: formData,
			        dataType: 'text',
			        success: function(response) {
				        ajaxcart.save(response);
				    },		
			        error: function() {
				        ajaxcart.failure();
				    }
			    }); 
			}
		}
	},	
	
	//add wishlist item to cart
	addWishlistItemToCart: function(url, button){ 
		if (!this.ajaxCartRunning) {			
			if (button) {
				var formId = 'options_addtocart_form';	
				productId = this.itemProductId;	
				
				if (jQueryAC('#popup-qty').length > 0) {
					var qtyElement = jQueryAC('#popup-qty');									
					// Verify if the qty has an invalid entry
					var oldValue = parseFloat(qtyElement.val());
					if (isNaN(oldValue)){
					    qtyElement.val(productMinMax[productId]['min']);
					}			
					// Verify the minim qty added to the cart
					if (qtyElement.val() < productMinMax[productId]['min']) {
					    alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['min'] + '.');
					    qtyElement.val(productMinMax[productId]['min']);
					    return;
					}
					// Verify if the qty added to the cart is smaller than the maximum qty
					if (qtyElement.val()>productMinMax[productId]['max']) {
					    alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
					    qtyElement.val(productMinMax[productId]['max']);
					    return;
					} 	
				}
				
				if(jQueryAC('is_grouped_qty').length > 0){
					var inputElements = document.getElementsByTagName('input');
					for ( var j = 0; j<inputElements.length; j++ ) {
						if (inputElements[j].name != null && inputElements[j].name != '') {
							var qtyName = inputElements[j].getAttribute("name").toString();
							var result = qtyName.search("super_group");
							var productId = qtyName.replace("super_group[","").replace("]","");
							
							if ( result != -1 ) {
								var qty = inputElements[j].value;
								// Verify if the qty has an invalid entry
								var oldValue = parseFloat(qty);
								if (isNaN(oldValue)){
									inputElements[j].value = productMinMax[productId]['min'];
								}	
								// Verify the minim qty added to the cart
								if (oldValue < 0) {
									alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['min'] + '.');
									inputElements[j].value = productMinMax[productId]['min'];
									return;
								}
								// Verify if the qty added to the cart is smaller than the maximum qty
								if (oldValue>productMinMax[productId]['max']) {
									alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax[productId]['max'] + '.');
									inputElements[j].value = productMinMax[productId]['max'];
									return;
								} 							
							}
						}
					}				
				}			
			} else {
				if (jQueryAC(('#' + ajaxcart.wishlistPage), ajaxcart.updateWindow.document).length > 0) {
					var formId = 'wishlist-view-form';
					
					//validate qty
					var itemId = ajaxcartTools.getProductIdFromUrl(url,'item');
					if (jQueryAC('#wishlist-qty-' + itemId).length > 0) {
						var qty = jQueryAC('#wishlist-qty-' + itemId).val();
					
						// Verify if the qty has an invalid entry
						var oldValue = parseFloat(jQueryAC('#wishlist-qty-'+itemId).val());
						if (isNaN(oldValue)){
							jQueryAC('#wishlist-qty-'+itemId).val(productMinMax['witem'+itemId]['min']);
						}
						// Verify the minim qty added to the cart
						if ( qty < productMinMax['witem'+itemId]['min']) {
							alert(Translator.translate('The minimum quantity allowed for purchase is ').stripTags() + productMinMax['witem'+itemId]['min'] + '.');
							jQueryAC('#wishlist-qty-' + itemId).val(productMinMax['witem'+itemId]['min']);
							return;
						}		
						// Verify if the qty added to the cart is smaller than the maximum qty
						if (qty>productMinMax['witem'+itemId]['max']) {
							alert(Translator.translate('The maximum quantity allowed for purchase is ').stripTags() + productMinMax['witem'+itemId]['max'] + '.');
							jQueryAC('#wishlist-qty-' + itemId).val(productMinMax['witem'+itemId]['max']);
							return;
						} 
					}
				} else {
					var formId = 'options_addtocart_form';				
				}
			}
				
			//if cart page, add param to load new cart page html as well	
			if (ajaxcart.updateWindow.location.href.indexOf('checkout/cart')!=-1 && jQueryAC('#'+formId+' #is_cart_page').length == 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="1" id="is_cart_page" name="is_cart_page" />');
			}			
			
			//if wishlist page, add param to load new wishlist page html as well	
			if (jQueryAC(('#' + ajaxcart.wishlistPage), ajaxcart.updateWindow.document).length > 0 && jQueryAC('#'+formId+' #is_wishlist_page').length == 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="1" id="is_wishlist_page" name="is_wishlist_page" />');
			}
				
			if (jQueryAC('#'+formId+' #redirect_url').length == 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="'+ window.location.href +'" id="redirect_url" name="redirect_url" />');
			}
			var ajaxcartProductAddToCartForm = new VarienForm(formId);
			
			if (ajaxcartProductAddToCartForm.validator.validate()) {
				this.ajaxCartRunning = true;
				if (button) {
					this.addToCartButton = button;
				}
				ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);

				//disable all buttons, inputs, links etc.
				jQueryAC('#ac-popup-top-bkg').show();

				jQueryAC('#'+formId).ajaxSubmit({ 
			        url:  url,      
			        type: 'post',
			        dataType: 'text',
			        success: function(response) {
				        ajaxcart.save(response);
				    },		
			        error: function() {
				        ajaxcart.failure();
				    }
			    }); 
			}
		}
    }, 
	
	initAddWishlistItemToCart: function(itemId) {
	   var url = this.generateWishlistItemUrl(itemId).replace("wishlist/index/cart/","ajaxcart/wishlist/cart/");
	   
	   this.addWishlistItemToCart(url, false);
    },
	
	//generate add wishlist item to cart url; used on wishlist page
	generateWishlistItemUrl: function(itemId) {
       var url = this.addWishlistItemToCartUrl;
       url = url.gsub('%item%', itemId);
       if (jQueryAC('#wishlist-view-form').length > 0) {
       		var form = jQueryAC('#wishlist-view-form');
            var input = form['qty[' + itemId + ']'];
            if (input) {
            	var separator = (url.indexOf('?') >= 0) ? '&' : '?';
                url += separator + input.name + '=' + encodeURIComponent(input.value);
            }
       }
       
       return url;
    },
    
    addAllWishlistItemsToCart: function() {
	   if (!this.ajaxCartRunning) {
  	   		var url = this.addAllItemsToCartUrl;      
	   
			this.ajaxCartRunning = true;
			
			var formData = {};
			formData.redirect_url = window.location.href;

			//if wishlist page, add param to load new wishlist page html as well	
			if (jQueryAC(('#' + ajaxcart.wishlistPage), ajaxcart.updateWindow.document).length > 0) {
				formData.is_wishlist_page = true;
				formData.qty = this.calculateQty();
			}

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
			
			jQueryAC(this).ajaxSubmit({ 
			    url:  url,      
			    type: 'post',
			    data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    },
	
	//generate add all wishlist items to cart url; used on wishlist page
	calculateQty: function() {  
        var itemQtys = new Array();
        jQueryAC('#wishlist-view-form .qty').each(function() {
        	var input = jQueryAC(this);
            var idxStr = input.attr('name');
            var idx = idxStr.replace( /[^\d.]/g, '' );
            itemQtys[idx] = input.val();
        });

        return JSON.stringify(itemQtys);
    },

    
    configureWishlistItem: function(url) {
	    if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			var formData = {};
			formData.redirect_url = window.location.href;

			//if wishlist page, add param to load new wishlist page html as well	
			if (jQueryAC(('#' + ajaxcart.wishlistPage), ajaxcart.updateWindow.document).length > 0) {
				formData.is_wishlist_page = true;
			}

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);

			jQueryAC(this).ajaxSubmit({ 
			    url:  url,    
			    data: formData,  
			    type: 'post',
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    },
    
    updateWishlistItem: function(url, button) {
    	this.addWishlistItemToCart(url, button);
    },
    
    updateWishlistItems: function() {
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			var formId = 'wishlist-view-form';
			var formAction = String(jQueryAC('#'+formId).attr("action"));
			var url = formAction.replace("wishlist/index/update/","ajaxcart/wishlist/update/");		
			
			//if wishlist page, add param to load new wishlist page html as well	
			if (jQueryAC(('#' + ajaxcart.wishlistPage), ajaxcart.updateWindow.document).length > 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="1" id="is_wishlist_page" name="is_wishlist_page" />');
			}
				
			if (jQueryAC('#'+formId+' #redirect_url').length == 0) {
				jQueryAC('#'+formId).append('<input type="hidden" value="'+ window.location.href +'" id="redirect_url" name="redirect_url" />');
			}

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
			
			jQueryAC('#'+formId).ajaxSubmit({ 
			    url:  url,      
			    type: 'post',
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    },
    
	//update wishlist page qty with increase/decrease buttons
	updateWishlistQty: function(qtyElementId,isIncrease){ 			
		if(qtyElementId != ''){
			var itemId = 'witem'+qtyElementId.replace('wishlist-qty-', '');
		    if (isIncrease){
		    	jQueryAC('#'+qtyElementId).val(parseFloat(jQueryAC('#'+qtyElementId).val()) + productMinMax[itemId]['inc']);
		    } else {
		    	jQueryAC('#'+qtyElementId).val(parseFloat(jQueryAC('#'+qtyElementId).val()) - productMinMax[itemId]['inc']);
		    }
		}	
		
		this.updateWishlistItems();
		
		if (qtyElementId != '' && !isIncrease && jQueryAC('#'+qtyElementId).val() == 0){
		    jQueryAC('#'+qtyElementId).val(1);
		}
    },	
	
	//remove wishlist item
	removeWishlistItem: function(url){ 
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			var formData = {};
			formData.redirect_url = window.location.href;			

			//if wishlist page, add param to load new wishlist page html as well	
			if (jQueryAC(('#' + ajaxcart.wishlistPage), ajaxcart.updateWindow.document).length > 0) {
				formData.is_wishlist_page = true;
			}

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);

			jQueryAC(this).ajaxSubmit({ 
			    url:  url,      
			    type: 'post',
			    data: formData,
			    dataType: 'text',
			    success: function(response) {
			        ajaxcart.save(response);
			    },		
			    error: function() {
			        ajaxcart.failure();
			    }
			}); 
		}
    }, 
	
	//update wishlist sidebar block
	updateWishlist: function(response){	
		if (response.update_section.html_wishlist) {
			for (var i=0;i<response.update_section.html_wishlist.length;i++) {	
				if (response.update_section.html_wishlist[i]) {
		    		if (this.updateWindow.document.getElementById(ajaxcart.wishlistSidebar + i)) {	
						ajaxcartTools.updateSection(response.update_section.html_wishlist[i],(ajaxcart.wishlistSidebar + i));					
			    	} else if(jQueryAC('.sidebar', this.updateWindow.document).length > 0) {
						var sidebar = jQueryAC('.sidebar', this.updateWindow.document);
						sidebar.first().prepend('<div class="ac-wishlist-sidebar" id="'+ajaxcart.wishlistSidebar+i+'"></div>');
						ajaxcartTools.updateSection(response.update_section.html_wishlist[i],(ajaxcart.wishlistSidebar + i));	
					}
					/*
		else if(this.updateWindow.document.getElementById(ajaxcart.cartSidebar)) {
						var cart = jQueryAC('#'+ajaxcart.cartSidebar, this.updateWindow.document);
			    	    cart.after(response.update_section.html_wishlist);
					}
		*/				
					//add tooltip
					if (i==ajaxcart.lastWishlistSidebar && ajaxcart.enableTooltip != 0 && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['wishlist'] && !jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar +' span.tooltip-sidebar', ajaxcart.updateWindow.document).length > 0 && !jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar).hasClass('ac-header')){		
						jQueryAC('#'+ajaxcart.wishlistSidebar+ ajaxcart.lastWishlistSidebar +' div', ajaxcart.updateWindow.document).first().append('<span class="tooltip-sidebar">' + Translator.translate('Wish Me!').stripTags() + '</span>');
					}
					
					//make the wishlist sidebar a droppable area
					if(i==ajaxcart.lastWishlistSidebar && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['wishlist'] && !jQueryAC('#'+ajaxcart.wishlistSidebar + ajaxcart.lastWishlistSidebar).hasClass('ac-header')) {
						if (window.opener != null && window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup).length > 0) {
							window.opener.ajaxcart.makeWishlistDroppableArea();		
						} else {
					    	ajaxcart.makeWishlistDroppableArea();		
					    }
					}	

				    ajaxcart.updateWindow.dispatchLiveUpdates('wishlist_sidebar', false);
					
					//flash wishlist block
			  		if (window.location.href.indexOf('catalog/product_compare/index/')==-1 && jQueryAC('#'+ajaxcart.comparePopup).length == 0) {
						var wishlistSidebar = this.updateWindow.document.getElementById(ajaxcart.wishlistSidebar + i);			    	
					    jQueryAC(wishlistSidebar).hide().fadeIn(300);					
					}
			    }
			}
		}
	    this.updateWishlistLink(response);	    
	},	
	
	//update wishlist page blocks
	updateWishlistPage: function(response){
		if (response.update_section.html_wishlist_page && this.updateWindow.document.getElementById(ajaxcart.wishlistPage)) {
    		ajaxcartTools.updateSection(response.update_section.html_wishlist_page, ajaxcart.wishlistPage);	

			jQueryAC('#'+ajaxcart.wishlistPage+' input', ajaxcart.updateWindow.document).each(function() {
				//add increase/decrease buttons to qty inputs
				var input = jQueryAC(this);
				if (input.attr('name') != null && input.attr('name') != '' && input.attr('name').indexOf('qty[') != -1) {	
				    var itemId = input.attr('name').replace("qty[","").replace("]","");
				    input.attr('id','wishlist-qty-' + itemId);
				    ajaxcart.addQtyBoxHtml('ac-wishlist-page', jQueryAC(this), 'witem'+itemId);	
				}
				
			    truncateOptions();
			        
			    ajaxcart.updateWindow.dispatchLiveUpdates('wishlist', false);
			})
	    }
	},
	
	//update wishlist link
	updateWishlistLink: function(response){
    	if (response.update_section.html_wishlist_link) {
    		if (!wishlistLink) {
	    		jQueryAC('#ac-links a', this.updateWindow.document).each(function() {
					var href = jQueryAC(this).attr('href');
					if (href != null && href != '' && href.indexOf('/wishlist/') != -1) {
						jQueryAC(this).html(response.update_section.html_wishlist_link);
					}    			
				}); 
			} else {
				jQueryAC(wishlistLink).html(response.update_section.html_wishlist_link);
			}
    	}
	},		
	
	//COMPARE functions
	addToCompare: function(url, popup){
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;

			var formData = {};
			formData.redirect_url = window.location.href;

			if (popup=='success') {
				formData.close_popup = 'success';
				ajaxcartTools.deactivateTimer();
				jQueryAC("#countdownToClose").html('');
			}

			var productId = ajaxcartTools.getProductIdFromUrl(url,'product');
			if (droppableSidebars['compare'] && !popup && jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).length>0) {
				ajaxcartTools.jump(productId, jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar), false);
			}

			if (popup=='success' && jQueryAC('#ac-cart-button'+productId).length>0) {
				this.addToCartButton = jQueryAC('#ac-cart-button'+productId);
			}
			
			//if compare popup add param to load new compare popup html as well
			if (window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup).length > 0) {
				formData.is_compare_popup = true;
			}

			ajaxcartTools.setLoadWaiting('ajaxcart-loading',true);
			
			jQueryAC(this).ajaxSubmit({ 
		        url:  url,      
		        type: 'post',
			    data: formData,
		        dataType: 'text',
		        success: function(response) {
			        ajaxcart.save(response);
			    },		
		        error: function() {
			        ajaxcart.failure();
			    }
		    }); 
		}
	},

	//update compare sidebar block
	updateCompare: function(response){
		if (response.update_section.html_compare) {
			for (var i=0;i<response.update_section.html_compare.length;i++) {
				if (response.update_section.html_compare[i] && this.updateWindow.document.getElementById(ajaxcart.compareSidebar+i)) {
					
					//extract jquery events
					var bindings = ajaxcartTools.extractBindings(ajaxcart.compareSidebar+i);

		    		ajaxcartTools.updateSection(response.update_section.html_compare[i],(ajaxcart.compareSidebar+i));

					//re-apply jquery events
					ajaxcartTools.reapplyBindings(bindings);
					
					//add tooltip
					if (i==ajaxcart.lastCompareSidebar && ajaxcart.enableTooltip != 0 && (ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['compare'] && !jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar + ' span.tooltip-sidebar', ajaxcart.updateWindow.document).length > 0 && !jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).hasClass('ac-header')){		
						jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar + ' div', ajaxcart.updateWindow.document).first().append('<span class="tooltip-sidebar">' + Translator.translate('Compare Me!').stripTags() + '</span>');
					}
					
					//make the compare sidebar a droppable area
					if((ajaxcart.dragdropCategory == 1 || ajaxcart.dragdropCategory == 2) && droppableSidebars['compare'] && !jQueryAC('#'+ajaxcart.compareSidebar + ajaxcart.lastCompareSidebar).hasClass('ac-header')) {
					    ajaxcart.makeCompareDroppableArea();		
					}
				        
				    ajaxcart.updateWindow.dispatchLiveUpdates('compare_sidebar', false);

					//flash compare block
			  		if (window.location.href.indexOf('catalog/product_compare/index/')==-1 && jQueryAC('#'+ajaxcart.comparePopup).length == 0) {
						var compareSidebar = this.updateWindow.document.getElementById(ajaxcart.compareSidebar+i);
					    jQueryAC(compareSidebar).hide().fadeIn(300);					
					}		
			    }
		    }
		}
	    
	    //update compare button from success popup
		if (response.update_section.compare_onclick) {
			jQueryAC('#success-compare-button').attr("onclick",response.update_section.compare_onclick);
			
		    //ie7 fix
			if (ajaxcartTools.browserTypeIE && ajaxcartTools.browserVersion == '7.0'){
		    	var buttonHtml = document.getElementById('success-compare-button').outerHTML;
				document.getElementById('success-compare-button').outerHTML = buttonHtml;
			}
		}
	},	

	//update compare popup block
	updateComparePopup: function(response){
		if (response.update_section.html_compare_popup && jQueryAC('#'+ajaxcart.comparePopup).length > 0) {
    		ajaxcartTools.updateSection(response.update_section.html_compare_popup,ajaxcart.comparePopup);

			//flash compare popup block
			jQueryAC('#'+ajaxcart.comparePopup).hide().fadeIn(300);	
	    }
	},
	
	//remove compare sidebar item
	removeCompareItem: function(url){ 
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			var formData = {};
			formData.redirect_url = window.location.href;
			
			//if compare popup add param to load new compare popup html as well
			if (window.location.href.indexOf('catalog/product_compare/index/')!=-1 && jQueryAC('#'+ajaxcart.comparePopup).length > 0) {
				formData.is_compare_popup = true;
			}

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
	
			jQueryAC(this).ajaxSubmit({ 
		        url:  url,      
		        type: 'post',
			    data: formData,
		        dataType: 'text',
		        success: function(response) {
			        ajaxcart.save(response);
			    },		
		        error: function() {
			        ajaxcart.failure();
			    }
		    }); 
		}	
    },	
	
	//remove all compare sidebar items
	removeCompareItems: function(url){ 
		if (!this.ajaxCartRunning) {
			this.ajaxCartRunning = true;
			
			var formData = {};
			formData.redirect_url = window.location.href;

			ajaxcartTools.setLoadWaiting('ajaxcart-loading', true);
			
			jQueryAC(this).ajaxSubmit({ 
		        url:  url,      
		        type: 'post',
			    data: formData,
		        dataType: 'text',
		        success: function(response) {
			        ajaxcart.save(response);
			    },		
		        error: function() {
			        ajaxcart.failure();
			    }
		    }); 
		}
    }		
}
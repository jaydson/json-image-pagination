/**
 * @Image JSON Pagination
 * jQuery Plugin to dynamically image pagination using JSON
 * @author Jaydson Gomes
 * @version 1.0
 * @date 06/10/09
 * @lastDateReview 05/11/09
 */
 
jQuery.fn.extend({

	/**
	 * ImageJSONPagination
	 */
	ImageJSONPagination: function(settings){
		/**
		 * Default properties
		 */
		var defaults = {
			imagePath      	      : "img",
			json 		   	      : "sample.json",
			textPreviousButton    : "Previous",
			textNextButton        : "Next",
			oneOfText		      : "of",
			totalImagesLabel      : true,
			gotoEnable			  : true,
			gotoClass			  : "json-goto-class-pagination",
			gotoText			  : "Go To Page",
			imageBoxClass		  : "json-box-class-pagination",
			totalElementText      : "Total of Images ",
			totalElementClass     : "json-total-class-pagination",
			paginationClass	      : "json-class-pagination",
			paginationOrientation : "after",
			buttonClass		      : "json-button-class-pagination",
			className 		      : "json-content-pagination",
			fadeIn				  : false,
			hashURL				  : true,
			
			/**
				Events
			*/
			onBeforeInit		  : null,
			onNext				  : null,
			onPrevious			  : null,
			onGoTo				  : null,
			onLoadJSON			  : null
		}
		
		/**
		* Core
		*/
		var core = {
		
			/**
			 * Core Properties
			 */
			targetElementId  : "",
			elementsToAppend : null,
			imagesJSON       : null,
			totalPages       : 0,
			currentPage      : 1,
			size 	         : null, 
			 
			 /**
			 * Create the images of gallery
			 */
			 CreateImages : function(){
				// Get the total of elements
				var totalImages = core.elementsToAppend.length;

				// Loop that create elements IMG
				for(var i=0;i<totalImages;i++){
					var elem = document.createElement("IMG");
					elem.src = defaults.imagePath + "/" + core.imagesJSON.images[i].thumbName;
					elem.alt = core.imagesJSON.images[i].alt;
					elem.imageName = core.imagesJSON.images[i].thumbName;
					elem.style.width = core.imagesJSON.images[i].width;
					//elem.style.height = core.imagesJSON.images[i].height;
					
					// Append the image created to correct element
					$(core.elementsToAppend[i]).append(elem);
					$(elem).bind("click",function(e){
						core.OpenImage(this.imageName,e);
					});
				}
				
				// Update the size property
				core.size = core.elementsToAppend.length;
				
				// Create the pagination
				core.CreatePagination();
				
				// Create the ModalMask
				core.CreateModalMask();
				
				// Create the box
				core.CreateBoxImage();				

			 },
			 
			 /**
			 * Open image modal
			 */
			 OpenImage : function(src,e){
				// Get the document Width and Height
				var maskHeight = $(document).height();
				var maskWidth = $(document).width();
				
				// Apply the Width and Height in a modalmask
				$('#image_json_modalmask').css({'width':maskWidth,'height':maskHeight});
				
				// Apply the top and left position in the modal
				$("#image_json_box").css('top',  maskHeight/2-$("#image_json_box").height()/2);
				$("#image_json_box").css('left', maskWidth/2-$("#image_json_box").width()/2);
				
				// Set the source to image
				$("#image_json_box_container").attr("src", defaults.imagePath + "/" + decodeURI(src));
				
				// Apply opacity with fadeTo in modalmask
				$('#image_json_modalmask').fadeTo("fast",0.7);
				
				// Show modalmask with fadeIn()
				$('#image_json_modalmask').fadeIn(500,function(){
					// In callback show the modal image
					$("#image_json_box").fadeIn(2000,function(){
						// Bind mousedown event in modalmask
						$("#image_json_modalmask").bind("mousedown",function(){
							core.CloseImage();
						});
					});
				});
			 },
			 
			 /**
			 * Close image modal
			 */
			 CloseImage : function(){
				// First, fadeout the box image
				$('#image_json_box').fadeOut(400,function(){
					// Hide the modalmask
					$('#image_json_modalmask').fadeOut(function(){
						// Unbind mousedown event in modalmask
						$("#image_json_modalmask").unbind("mousedown");
					});
				});
			 },
			
			 /**
			 * Create the element container to box image
			 */
			 CreateBoxImage : function(){
				var box = document.createElement("DIV");
				$(box).addClass(defaults.imageBoxClass);
				$(box).attr("id","image_json_box");
				var img = document.createElement("IMG");
				$(img).attr("id","image_json_box_container");
				$(box).html($(img));
				$("body").append($(box));
			 },
			 
			  /**
			 * Create the element mask
			 */
			 CreateModalMask : function(){
				var box = document.createElement("DIV");
				$(box).addClass("json-modal-mask-pagination");
				$(box).attr("id","image_json_modalmask");
				$("body").append($(box));
			 },
			 			 
			 /**
			 *Go To Page
			 */
			 GoTo : function(){
				var to = parseInt(document.getElementById("image_json_gotopage").value) >= 0  ? parseInt(document.getElementById("image_json_gotopage").value) : null;
					if(to!=null && to <= core.totalPages && to>0){
						core.currentPage = to;
						core.size = core.elementsToAppend.length * to;
						core.Pager();
					}
					// Call a function defined in onGoTo
					core.ApplyCallBack(defaults.onGoTo);
					
					// Add hash to URL refered to the current page
					core.AddHashURL();
			 },
			 
			 /**
			 * Method that do the pagination
			 */
			 Pager : function(){
				
				// Array with the images to append
				var newImages = new Array();
				
				// Loop to get the appropriate images
				for(var i=core.size-core.elementsToAppend.length;i<core.size;i++){
					newImages.push(core.imagesJSON.images[i]);
				}
				
				// Loop that change de src attribute of images
				for(var x=0;x<newImages.length;x++){
					$(core.elementsToAppend[x]).children().css("display","none");
					
					// Test to verify if image exists
					if(newImages[x]){
						//Update the name referene
						$(core.elementsToAppend[x]).children().attr("imageName",newImages[x].imageName);
						
						//Change the src
						$(core.elementsToAppend[x]).children().attr("src",defaults.imagePath+"/"+newImages[x].thumbName);
						
						//If default setting FadeIn is set apply then
						defaults.fadeIn ? $(core.elementsToAppend[x]).children().fadeIn("slow") : $(core.elementsToAppend[x]).children().css("display","block");
					}else{
						//Clean src and alt attributes
						$(core.elementsToAppend[x]).children().attr({"src":"","alt":""});
					}
				}
				
				// Clean up the newImages Array
				delete newImages;
				
				//Remove the element image_json_pagination
				document.getElementById("image_json_pagination").parentNode.removeChild(document.getElementById("image_json_pagination"));
				
				//Create the pagination
				core.CreatePagination();
				
			 },
			 
			 /**
			 * Method that build a pagination element
			 */			 
			 CreatePagination : function(){
			 
				// Create the element root of pagination
				var pagination = document.createElement("DIV");
				pagination.id = "image_json_pagination";
				
				// Add the class to pagination
				$(pagination).addClass(defaults.paginationClass);
					
					// Create the elements to navigate
					var previous = document.createElement("A");
						$(previous).addClass(defaults.buttonClass);
					var next = document.createElement("A");
						$(next).addClass(defaults.buttonClass);
					var oneOfText =  document.createElement("SPAN");
						oneOfText.innerHTML = "&nbsp;" + core.currentPage + "&nbsp;" + defaults.oneOfText + "&nbsp;" + core.totalPages +"&nbsp;";
					previous.innerHTML = defaults.textPreviousButton + "&nbsp;";
					next.innerHTML = defaults.textNextButton;
					pagination.appendChild(previous);
					pagination.appendChild(oneOfText);
					pagination.appendChild(next);
					
					//Label total images
					if(defaults.totalImagesLabel){
						var totalText = document.createElement("SPAN");
						totalText.innerHTML = defaults.totalElementText + " " + core.imagesJSON.images.length;
						$(totalText).addClass(defaults.totalElementClass);
						pagination.appendChild(totalText);
					}
					
					// Go To Element
					if(defaults.gotoEnable){
						var gotoElement = document.createElement("DIV");
						var inputGoToElement = document.createElement("INPUT");
						$(inputGoToElement).attr("id", "image_json_gotopage");
						$(inputGoToElement).attr("type", "text");
						$(inputGoToElement).val(core.currentPage);
						$(inputGoToElement).addClass(defaults.gotoClass);
						var buttonGoTo =  document.createElement("INPUT");
						$(buttonGoTo).attr("type","button");
						$(buttonGoTo).attr("id", "image_json_gotopage.action");
						$(buttonGoTo).val(defaults.gotoText);
						$(buttonGoTo).bind("click",function(){
							core.GoTo();
						});
						gotoElement.appendChild(inputGoToElement);
						gotoElement.appendChild(buttonGoTo);
						pagination.appendChild(gotoElement);
					}
					
				// Switch Orientation(after,before)
				switch(defaults.paginationOrientation){
					case "after":
						$("#"+core.targetElementId).after(pagination);
					break;
					case "before":
						$("#"+core.targetElementId).before(pagination);
					break;
					default:
						$("#"+core.targetElementId).after(pagination);
				}
				
				// Bind event click to button calling a method to see the previous page
				$(previous).bind("click",function(){
					core.PreviousPage();
				});
				
				// Bind event click to button calling a method to see the next page
				$(next).bind("click",function(){
					core.NextPage();					
				});
			 },
			 
			 /**
			 * Method that do the calc to go at the next page
			 */	
			 NextPage : function(){
				if(core.currentPage >= core.totalPages) {return false};
				core.currentPage++;
				core.size=core.size+core.elementsToAppend.length;
				core.Pager();
				
				// Add hash to URL refered to the current page
				core.AddHashURL();
				
				// Call a function defined in onNext
				core.ApplyCallBack(defaults.onNext);
			 },
			 
			 /**
			 * Method that do the calc to go at the previous page
			 */	
			 PreviousPage : function(){
				if(core.currentPage <= 1) {return false};
				core.currentPage--;
				core.size=core.size-core.elementsToAppend.length;
				core.Pager();
				
				// Add hash to URL refered to the current page
				core.AddHashURL();
				
				// Call a function defined in onPrevious
				core.ApplyCallBack(defaults.onPrevious);
			 },
			 
			 /**
			 * Get a JSON object
			 */	
			 GetJSON : function(){
				$.getJSON(defaults.json,function(jsonObject){
				
					// Call a function defined in onLoadJSON
					core.ApplyCallBack(defaults.onLoadJSON,jsonObject);
					
					// Pass to core the object loaded
					core.imagesJSON = jsonObject;
					
					// Calc the total pages (The number is rounded upwards to the nearest integer)
					core.totalPages = Math.ceil(parseInt(core.imagesJSON.images.length) / (parseInt(core.elementsToAppend.length)));
					
					// Create Images
					core.CreateImages();
					
					// Test if hashURL is enable
					if(defaults.hashURL){
						// Call the core to enable hash url functionality
						core.Hash();
					}
				});
			 },
			 
			 /**
			 * Add an hash to URL
			 */	
			 AddHashURL : function(){
				if(defaults.hashURL){
					document.location.hash = core.currentPage;
				}
			 },
			 
			 /**
			 * Method that manipulate the url hash
			 */	
			 Hash : function(){
				var url = document.location;
				if(url.hash == ""){
					core.AddHashURL();
				}else{
					var hash = url.hash.split("#")[1];
					core.currentPage = hash;
					core.size = core.elementsToAppend.length * hash;
					core.Pager();
				}
			 },
			 
			 /**
			 * Method to check if the callback is valid and apply it
			 */	
			 ApplyCallBack : function(callback,params){
				// Check if has params
				params = params != null && params != "undefined" && params != "" ? params : null;
				
				// Check if the callback is a function and if callback is not null. If params are not null apply with params
				return callback != null && typeof(callback) == "function" ? params != null ? callback(params) : callback(): false;
			 },
			 
			 /**
			 * Init the plugin
			 */	
			 Init : function(){
				// Call a function defined in onBeforeInit
				core.ApplyCallBack(defaults.onBeforeInit);
				
				// Pass to core the target objects
				core.elementsToAppend = $("."+defaults.className);
				
				// Call GetJSON
				core.GetJSON();
			 }
		}
		
		/**
		 * Extend configurations
		 */
		settings = $.extend(defaults, settings);
		
		/**
		 * Capture the element
		 */			 
		return this.each(function(){
			// Pass to core the target object ID
			core.targetElementId = $(this).attr("id");
			
			// Init the Core
			core.Init();
		});
	}
});
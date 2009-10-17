                                                                     
                                                                     
                                                                     
                                             
/**
 * @Image JSON Pagination
 * jQuery Plugin to dynamically image pagination using JSON
 * @author Jaydson Gomes
 * @version 1.0
 * @date 06/10/09
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
		
		var core = {
		
			/**
			 * Core Properties
			 */
			targetElementId : "",
			elementsToAppend : null,
			imagesJSON : null,
			totalPages : 0,
			currentPage : 1,
			size 	   : null, 
			 
			 /**
			 * Create the images of gallery
			 */
			 CreateImages : function(){
				// Get the total of elements
				var totalImages = core.elementsToAppend.length;
				
				// Loop that create elements IMG
				for(var i=0;i<totalImages;i++){
					var elem = document.createElement("IMG");
					elem.src = defaults.imagePath + "/" + core.imagesJSON.images[i].name;
					elem.alt = core.imagesJSON.images[i].alt;
					elem.style.width = core.imagesJSON.images[i].width;
					//elem.style.height = core.imagesJSON.images[i].height;
					
					// Append the image created to correct element
					$(core.elementsToAppend[i]).append(elem);
					$(elem).bind("click",function(){
						core.OpenImage();
					});
				}
				
				// Update the size property
				core.size = core.elementsToAppend.length;
				
				// Create the pagination
				core.CreatePagination();
				
				// Create the box
				//core.CreateBoxImage();
			 },
			 
			 OpenImage : function(){
				
			 },
			 
			 CreateBoxImage : function(){
				var box = document.createElement("DIV");
				$(box).addClass(defaults.imageBoxClass);
				$(box).attr("id","image.json.box");
				$(box).html("XXXX");
				$("body").append($(box));
			 },
			 
			 /**
			 *Go To Page
			 */
			 GoTo : function(){
				var to = parseInt(document.getElementById("image.json.gotopage").value) >= 0  ? parseInt(document.getElementById("image.json.gotopage").value) : null;
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
						//Change the src
						$(core.elementsToAppend[x]).children().attr("src",defaults.imagePath+"/"+newImages[x].name);
						
						//If default setting FadeIn is set apply then
						defaults.fadeIn ? $(core.elementsToAppend[x]).children().fadeIn("slow") : $(core.elementsToAppend[x]).children().css("display","block");
					}else{
						//Clean src and alt attributes
						$(core.elementsToAppend[x]).children().attr({"src":"","alt":""});
					}
				}
				
				// Clean up the newImages Array
				delete newImages;
				
				//Remove the element image.json.pagination
				document.getElementById("image.json.pagination").parentNode.removeChild(document.getElementById("image.json.pagination"));
				
				//Create the pagination
				core.CreatePagination();
				
			 },
			 
			 /**
			 * Method that build a pagination element
			 */			 
			 CreatePagination : function(){
			 
				// Create the element root of pagination
				var pagination = document.createElement("DIV");
				pagination.id = "image.json.pagination";
				
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
						$(inputGoToElement).attr("id", "image.json.gotopage");
						$(inputGoToElement).attr("type", "text");
						$(inputGoToElement).val(core.currentPage);
						$(inputGoToElement).addClass(defaults.gotoClass);
						var buttonGoTo =  document.createElement("INPUT");
						$(buttonGoTo).attr("type","button");
						$(buttonGoTo).attr("id", "image.json.gotopage.action");
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
				document.location.hash = core.currentPage;
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


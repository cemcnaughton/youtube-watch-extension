  
var urls = [];
var url;
var backButtonDisplay = false;
var nextButtonDisplay = false;

function setURLToVideo(url){
	$('#frame').attr('src',url + '?autoplay=1');
	$('#url').attr('placeholder',url);
}

function saveURl(url){
	localStorage['url'] = url;
	if(urls.indexOf(url)==-1){
		urls.push(url);
		localStorage['urls'] = JSON.stringify(urls.slice(0,100));
	}
	
}
function loadUrls(){
	if(localStorage['urls']){
		urls = JSON.parse(localStorage['urls']);
		
	}
	if(localStorage['url']){
		url = localStorage['url'];
		setURLToVideo(url);
	}
	
}
function cleanUrl(url){
	var splitter = 'watch?v='
	
	if(url.indexOf(splitter)>-1){
		url = url.split(splitter)[0] + 'embed/' + url.split(splitter)[1];
	}
	return url
}
function checkButtons(){
	
	var index = urls.indexOf(url)
	if(index == urls.length-1){
		nextButtonDisplay =  false;
	}else{
		nextButtonDisplay = true
	}
	if(index == 0){
		backButtonDisplay = false;
	}else{
		backButtonDisplay =  true;
	}
	$('#back').toggle(backButtonDisplay);
	$('#next').toggle(nextButtonDisplay);
	
}

function setButtonListeners(){
	
	$('#back').click( function() {
		var index = urls.indexOf(url);
		index -=1;
		url = urls[index];
		checkButtons();
		saveURl(url);
		setURLToVideo(url);
	
  });
  $('#next').click(  function() {
		var index = urls.indexOf(url);
		index +=1;
		url = urls[index];
		checkButtons();
		saveURl(url);
		setURLToVideo(url);
	
  });
}
function checkURL(url){
	
	if(url.toLowerCase().indexOf('youtube')==-1){return false;}
	if(url.toLowerCase().indexOf('http')==-1){return false;}
	if(url.toLowerCase().indexOf('watch?v=')==-1 && url.toLowerCase().indexOf('embed/')==-1){return false;}
	return true
	
}
function newVideo(){
	if(!checkURL(url)){
		console.log('ERROR')
		console.log(url)
		return;
	}
	url = cleanUrl(url);
	setURLToVideo(url);
	saveURl(url);
	checkButtons();
	
}
function removeUrl(){
	var index = urls.indexOf(url);
	var newIndex = urls.length-1==index?index-1:index;
	if(newIndex==-1){
		clear()
	}else{
		urls.splice(index,1)
		url = urls[newIndex];
		newVideo();
	}
	
	
	
}
function setOtherListners(){
	
	  
	$('#url').on('paste', function(ev) {
	 
	 setTimeout( function() {
		url = document.getElementById('url').value
		document.getElementById('url').value = ''
		
		newVideo();
	}, 100);
	 
	});
	
	$(function(){
        $(document).on('click','input[type=text]',function(){ this.select(); });
    });
	$(function(){
        $(document).on('click','#popout',popout);
    });
	$(function(){
        $(document).on('click','#clear',clear);
    });
	$(function(){
        $(document).on('click','#remove',removeUrl);
    });
	$(function(){
        $(document).on('click','#copy',function(ev){
			var urlToCopy = $('#url').attr('placeholder').replace('embed/','watch?v=')
			executeCopy(urlToCopy)
		});
    });
	$(function(){
        $(document).on('click','.menu',function(){
			$('.hiddenBtns').toggle();
			$(this).text($(this).text()=='More'?'Less':'More');
		});
    });
	
	
	$('input').keyup(function(event){
		
		if(event.keyCode == 13){
			url = document.getElementById('url').value
			document.getElementById('url').value = ''
			newVideo();
		}
	})
}
function popout(){
	var popupWindow = window.open(
		chrome.extension.getURL("popout.html"),
		"Watch!",
		"width=600,height=500"
	);
	window.close();
}

function clear(){
	urls = [];
	url = 'https://www.youtube.com/watch?v=JYtYCNkR1Yo';
	$('#frame').attr('src','');
	$('#url').attr('placeholder','');
	//newVideo();
	
}
function executeCopy(text) {
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = text;
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
}
function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}


$(document).ready(function(){
	loadUrls();
	checkButtons();
	setButtonListeners();
	setOtherListners();
});








//https://www.youtube.com/watch?v=JYtYCNkR1Yo

//http://www.sitepoint.com/create-chrome-extension-10-minutes-flat/
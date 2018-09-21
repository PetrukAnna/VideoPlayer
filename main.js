window.addEventListener("load", function() {
	var play = document.getElementById("play-pause");
	var current_time = document.getElementById("time_current");
	var video = document.getElementById("video");
	var full_time = document.getElementById("time_full");
	var volume_value = document.getElementById("volume_value");
	var container = document.getElementById("container");
	var userScreen = document.getElementById("screen");
	var video_duration = document.getElementById("video_duration");
	var video_progress = document.getElementById("video_progress");
	var volume_img = document.getElementById("volume_img");
	var controls = document.getElementById("controls");
	
	full_time.innerHTML = formatTime(video.duration);

	play.addEventListener("click", start_pause);
	volume_value.addEventListener("input", volume);
	userScreen.addEventListener("click", fullScreen);
	video_duration.addEventListener("click", getPosition);
	volume_img.addEventListener("click", offVolume);
	video.addEventListener("click", start_pause);
	window.addEventListener("keypress", function(e) {
		if(e.keyCode == 32) {
			start_pause();
		}
	});

	function offVolume() {
		if(volume_img.getAttribute("value") == "on") {
			volume_img.style.backgroundImage = "url('images/volumeoff.png')";
			volume_img.setAttribute("value", "off");
			volume_value.setAttribute("value", volume_value.value);
			video.volume = 0.0;
			volume_value.value = 0.0;
		} else if(volume_img.getAttribute("value") == "off") {
			volume_img.style.backgroundImage = "url('images/volumeon.png')";
			volume_img.setAttribute("value", "on");
			volume_value.value = volume_value.getAttribute("value");
			video.volume = volume_value.getAttribute("value");
		}
	}

	function scaleValue() {
		var durationWidth = window.getComputedStyle(video_duration).width;
		durationWidth = durationWidth.substring(0,durationWidth.length-2);
		return durationWidth / video.duration;
	}

	function getPosition(e) {
		var pointWidth = e.offsetX;
		var pointTime = pointWidth / scaleValue();

		video_progress.style.width = pointWidth + "px";
		video.currentTime = pointTime;
	}
	
	function start_pause() {
		if(play.getAttribute("value") == "play") {
			video.play();
			play.style.backgroundImage = "url('images/pause.png')";
			play.setAttribute("value", "pause");

			var timer = setInterval(function() {
				current_time.innerHTML = formatTime(video.currentTime);
				video_progress.style.width = video.currentTime * scaleValue() + "px";

				if (video.currentTime == video.duration) clearInterval(timer);
			}, 1000);
		} else if(play.getAttribute("value") == "pause") {
			video.pause();
			play.style.backgroundImage = "url('images/play.png')";
			play.setAttribute("value", "play");
			clearInterval(timer);
		} 
	}

	function formatTime(time){
		time = Math.round(time);
		var minutes = Math.floor(time / 60),
			seconds = time - minutes * 60;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		return minutes + ":" + seconds;
	}

	function volume() {
		video.volume = volume_value.value;
	}
	
	function fullScreen() {
		if ( isFullScreen() ) {
			if (document.exitFullscreen) document.exitFullscreen();
		    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
		    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
		    else if (document.msExitFullscreen) document.msExitFullscreen();

		    userScreen.style.backgroundImage = "url('images/fullscreen.png')";			
			current_time.innerHTML = formatTime(video.currentTime);
			video_progress.style.width = video.currentTime * scaleValue() + "px";
		} else {
			if (container.requestFullscreen) container.requestFullscreen();
		    else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
		    else if (container.webkitRequestFullScreen) container.webkitRequestFullScreen();
		    else if (container.msRequestFullscreen) container.msRequestFullscreen();

		    userScreen.style.backgroundImage = "url('images/fullscreen-exit.png')";
			current_time.innerHTML = formatTime(video.currentTime);
			video_progress.style.width = video.currentTime * scaleValue() + "px";
		}
	}

	function isFullScreen() {
  		return !!(document.fullScreen ||
            document.webkitIsFullScreen ||
            document.mozFullScreen ||
            document.msFullscreenElement ||
            document.fullscreenElement);
	}	
});
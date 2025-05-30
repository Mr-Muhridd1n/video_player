const playBtn = document.querySelector("#play");
const video = document.querySelector("#video");
const voiceRange = document.querySelector("#voice");
const voiceValue = document.querySelector("#voice-value");
const container = document.querySelector(".container");
const backward = document.querySelector("#backward");
const forward = document.querySelector("#forward");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress__container");
const progressMusicTime = document.querySelector(".progress__music_time");
const progressPresentTime = document.querySelector(".progress__present_time");
const muteBtn = document.querySelector("#mute");
const fullscreenBtn = document.querySelector("#fullscreen");
const videoShiftLeft = document.querySelector(".video__shift-left");
const videoShiftRight = document.querySelector(".video__shift-right");
const videoShiftPlay = document.querySelector(".video__shift-play");
const videoInput = document.getElementById("videoInput");
const videoSelectBtn = document.getElementById("videoSelectBtn");
const videoFileName = document.getElementById("videoFileName");
const videoWrapper = document.querySelector(".video__wrapper");
const playlist__list = document.querySelector(".playlist__list");

const videos = [
  {
    video_title: "Pixabay random",
    video_link: "https://cdn.pixabay.com/video/2025/04/10/271161_large.mp4",
  },
];
let videosCounter = 0;
let isDragging = false;

function changeMusic(videosCounter) {
  video.src = videos[videosCounter].video_link;
  videoFileName.textContent = videos[videosCounter].video_title;
  if (container.classList.contains("play")) {
    video.play();
  }
}
function playlist_add() {
  playlist__list.innerHTML = "";
  videos.forEach((v) => {
    playlist__list.innerHTML += `<li class="playlist__item" data-link="${v.video_link}" data-title="${v.video_title}">
            <video class="playlist__video" src="${v.video_link}"></video>
            <div class="playlist__info">
              <h4 class="playlist__title">${v.video_title}</h4>
              <div class="playlist__time-wrapper">
                <p class="playlist__music_time">00:00</p>
              </div>
            </div>
          </li>`;
  });

  document.querySelectorAll(".playlist__item").forEach((item) => {
    item.addEventListener("click", function () {
      playvideo(this.dataset.link, this.dataset.title);
    });
  });
}
playlist_add();

changeMusic(videosCounter);

function play() {
  video.play();
  container.classList.add("play");
  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function pause() {
  video.pause();
  container.classList.remove("play");
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

function forwardFunc() {
  videosCounter = (videosCounter + 1) % videos.length;
  changeMusic(videosCounter);
}

function backwardFunc() {
  videosCounter = (videosCounter - 1 + videos.length) % videos.length;
  changeMusic(videosCounter);
}

function playvideo(videourl, video_name) {
  video.src = videourl;
  videoFileName.textContent = video_name;
  play();
}

video.volume = 0.5;
voiceValue.textContent = 50;

playBtn.addEventListener("click", () => {
  const isPlaying = container.classList.contains("play");
  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

videoShiftPlay.addEventListener("click", () => {
  const isPlaying = container.classList.contains("play");
  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

voiceRange.addEventListener("input", () => {
  video.volume = voiceRange.value / 100;
  voiceValue.textContent = voiceRange.value;
  video.muted = video.volume === 0;
  muteBtn.innerHTML = video.muted
    ? `<i class="fa-solid fa-volume-xmark"></i>`
    : `<i class="fa-solid fa-volume-up"></i>`;
});

forward.addEventListener("click", forwardFunc);
backward.addEventListener("click", backwardFunc);

muteBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  muteBtn.innerHTML = video.muted
    ? `<i class="fa-solid fa-volume-xmark"></i>`
    : `<i class="fa-solid fa-volume-up"></i>`;
  voiceRange.value = video.muted ? 0 : video.volume * 100;
  voiceValue.textContent = voiceRange.value;
});

fullscreenBtn.addEventListener("click", () => {
  if (
    document.fullscreenElement === videoWrapper ||
    document.webkitFullscreenElement === videoWrapper ||
    document.msFullscreenElement === videoWrapper
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (videoWrapper.requestFullscreen) {
      videoWrapper.requestFullscreen();
    } else if (videoWrapper.webkitRequestFullscreen) {
      videoWrapper.webkitRequestFullscreen();
    } else if (videoWrapper.msRequestFullscreen) {
      videoWrapper.msRequestFullscreen();
    }
  }
});

video.addEventListener("timeupdate", () => {
  if (!isNaN(video.duration) && video.duration > 0) {
    const times = (video.currentTime / video.duration) * 100;
    progress.style.width = `${times}%`;
    const durationMinutes = Math.floor(video.duration / 60);
    const durationSeconds = Math.floor(video.duration % 60);
    const currentMinutes = Math.floor(video.currentTime / 60);
    const currentSeconds = Math.floor(video.currentTime % 60);
    progressMusicTime.textContent = `${durationMinutes
      .toString()
      .padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;
    progressPresentTime.textContent = `${currentMinutes
      .toString()
      .padStart(2, "0")}:${currentSeconds.toString().padStart(2, "0")}`;
  } else {
    progress.style.width = "0%";
    progressMusicTime.textContent = "00:00";
    progressPresentTime.textContent = "00:00";
  }
});

function seek(e, isGlobal = false) {
  const rect = progressContainer.getBoundingClientRect();
  let x = isGlobal ? e.clientX - rect.left : e.offsetX;
  x = Math.max(0, Math.min(x, rect.width));
  const percent = x / rect.width;
  progress.style.width = `${percent * 100}%`;
  video.currentTime = percent * video.duration;
}

progressContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  seek(e);
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    seek(e, true);
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

progressContainer.addEventListener("click", seek);

video.addEventListener("ended", () => {
  pause();
});

videoShiftLeft.addEventListener("dblclick", () => {
  video.currentTime = Math.max(0, video.currentTime - 5);
});
videoShiftRight.addEventListener("dblclick", () => {
  video.currentTime = Math.max(0, video.currentTime + 5);
});

videoSelectBtn.addEventListener("click", () => {
  videoInput.click();
});

videoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    video.src = url;
    videoFileName.textContent = file.name;
    videos.push({ video_link: url, video_title: file.name });
    playlist_add();
    forwardFunc();
  }
});

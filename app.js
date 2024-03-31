const songs = [
    {
        name: "Calm Waterside",
        author: "Nobou Uematsu",
        photo: "public/photos/blue-dragon.jpg",
        url: "public/music/0.mp3",
        time: "2:27",
    },
    {
        name: "Mako Reactor",
        author: "Nobou Uematsu",
        photo: "public/photos/ff7.jpg",
        url: "public/music/1.mp3",
        time: "3:21",
    },
    {
        name: "Cavern",
        author: "Nobou Uematsu",
        photo: "public/photos/blue-dragon.jpg",
        url: "public/music/2.mp3",
        time: "2:53",
    },
    {
        name: "Eternity",
        author: "Nobou Uematsu",
        photo: "public/photos/blue-dragon.jpg",
        url: "public/music/3.mp3",
        time: "3:54",
    },
    {
        name: "Zbroja",
        author: "Jacek Kaczmarski",
        photo: "public/photos/jk.jpg",
        url: "public/music/4.mp3",
        time: "5:15", 
    },
]

const mainControls = document.querySelector(".main-controls");
const playPause = mainControls.querySelector(".play-pause");
const loopButton = mainControls.querySelector(".loop");

const secondsToTime = (secondsReceived) => {
    let seconds, minutes, hours;
    let arr = [];
    let currentSeconds = secondsReceived;
    hours = Math.floor(currentSeconds / 3600);
    if (hours > 0)
        arr.push(hours.toString());
    currentSeconds -= hours * 3600;
    minutes = (Math.floor(currentSeconds / 60)).toString();
    if (hours > 0 && minutes < 10) {
        minutes = ["0", (Number(minutes).toFixed(0)).toString()].join("");
        arr.push(minutes);
    } else {
        arr.push((Number(minutes).toFixed(0)).toString());
    }
    currentSeconds -= Number(minutes) * 60;
    seconds = currentSeconds.toString();
    if (seconds < 10) {
        seconds = ["0", (Number(seconds).toFixed(0)).toString()].join("")
        arr.push(seconds);
    }else{
        arr.push((Number(seconds).toFixed(0)).toString());
    }
    return arr.join(":");
}

const timeToSeconds = (time) => {

    // Setup Code
    const countLetterInString = (str, char) => {
        let iteration = 0;
        let helpStr = str;
        while (helpStr.includes(char)) {
            const closestLetterPosition = helpStr.indexOf(char);
            helpStr = helpStr.slice(0, closestLetterPosition) + helpStr.slice(closestLetterPosition + 1, helpStr.length);
            iteration++;
        }
        return iteration;
    }

    // Actual Function


    let values = [0, 0, 0];
    let i = 1, exit = 1, doneWork = 0;
    if (countLetterInString(time, ":") == 2) {
        i = 0;
    }
    while (time.includes(":") || exit > 0) {
        doneWork++;
        if (time.includes(":")) {
            const separatorClosestPosition = time.indexOf(":");
            values[i] = Number(time.slice(0, separatorClosestPosition));
            time = time.slice(separatorClosestPosition + 1);
        } else {
            values[i] = Number(time);
            exit--;
        }
        i++;
    }

    return Number(values[0] * 3600 + values[1] * 60 + values[2])
}

let shouldShuffle = false, onProgress, lastTime = 0;

const audioPlayer = document.querySelector("#audio-player")
const title = document.querySelector(".song-title");
const author = document.querySelector(".song-author");
const photo = document.querySelector(".song-photo");
const duration = document.querySelector(".timeline-ends");

const shuffleHandler = (previousId) => {
    let newId = Math.floor(Math.random()*songs.length);
    if(newId == previousId)
        shuffleHandler(previousId);
    else{
        lastTime = 0;
        setList(newId);
        setSong(newId);
        setProgress(1, 0)
    }
}

audioPlayer.addEventListener("ended", () => {
    if(playPause.classList.contains("active"));
        playPause.classList.remove("active");
    setProgress(1,1)
    if(shouldShuffle) 
        shuffleHandler(Number(audioPlayer.getAttribute("current-audio-id")));
    else if(loopButton.classList.contains("active")){ 
        audioPlayer.currentTime = 0;
        lastTime = 0;
        setProgress(1,0)
        if(!playPause.classList.contains("active"))
            playPause.classList.add("active");
        audioPlayer.play();
    }
})

const timelineContainer = document.querySelector(".timeline-container")
const fill = timelineContainer.querySelector(".fill");
const timelineCurrent = timelineContainer.querySelector(".timeline-current")

const setProgress = (duration, current) => {
    if (!current) {
        fill.style.width = `${(lastTime / duration) * 100}%`
    } else {
        fill.style.width = `${(current / duration) * 100}%`
    }
    timelineCurrent.innerText = secondsToTime(lastTime);
}

const setSong = (id) => {
    clearInterval(onProgress);
    lastTime = 0;
    const playPause = document.querySelector(".play-pause") 
    if(playPause.classList.contains("active"))
        playPause.classList.remove("active")
    photo.setAttribute("src", songs[id].photo);
    audioPlayer.setAttribute("src", songs[id].url);
    audioPlayer.setAttribute("current-audio-id", id);
    title.innerText = songs[id].name;
    author.innerText = songs[id].author;
    duration.innerText = songs[id].time;
    onProgress = setInterval(() => {
        if (lastTime < Math.floor(audioPlayer.currentTime)) {
            setProgress(audioPlayer.duration);
            lastTime++;
        }
    })
}

const setList = (activeId) => {
    const songsList = document.querySelector(".songs-list");
    const songItems = songsList.querySelectorAll(".song");
    songItems.forEach((song) => { song.remove() });
    songs.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.classList.add("song");
        if (index == activeId) songItem.classList.add("active");
        else if (songItem.classList.contains("active"))
            songItem.classList.remove("active");
        const songTitle = document.createElement("span")
        songTitle.classList.add("song-item-name");
        songTitle.innerText = song.name;
        const songDuration = document.createElement("span");
        songDuration.classList.add("song-duration");
        songDuration.innerText = song.time;
        songItem.append(songTitle, songDuration);

        songItem.addEventListener("click", () => {
            lastTime = 0;
            setProgress(timeToSeconds(song.time));
            setSong(index);
            setList(index);
        })

        songsList.appendChild(songItem);
    })
}

setList(4);
setSong(4);



loopButton.addEventListener("click", () => {
    loopButton.classList.toggle("active");
})


playPause.addEventListener("click", () => {
    if (audioPlayer.paused){
        if(audioPlayer.currentTime === audioPlayer.duration){
            setProgress(1,0);
            lastTime = 0;
            audioPlayer.currentTime = 0;
            if(!playPause.classList.contains("active"))
                playPause.classList.add("active");
            audioPlayer.play();
            return;
        }
        audioPlayer.play();
        if(!playPause.classList.contains("active"))
            playPause.classList.add("active");
    }else{
        audioPlayer.pause();
        if(playPause.classList.contains("active"))
            playPause.classList.remove("active");
    }
})

const nextTrack = mainControls.querySelector(".next-track");
nextTrack.addEventListener("click", () => {
    const currentTrack = Number(audioPlayer.getAttribute("current-audio-id"))
    if (currentTrack + 1 < songs.length) {
        setSong(currentTrack+1)
        setList(currentTrack + 1)
        setProgress(1,0)
    }
})

const previousTrack = mainControls.querySelector(".previous-track");
previousTrack.addEventListener("click", () => {
    const currentTrack = Number(audioPlayer.getAttribute("current-audio-id"))
    if (currentTrack  > 0) {
        setSong(currentTrack-1)
        setList(currentTrack-1)
        setProgress(1,0)
    }
})

const shuffle = mainControls.querySelector(".shuffle");
shuffle.addEventListener("click", () => {
    shuffle.classList.toggle("active");
    shouldShuffle = !shouldShuffle;
})

const timeline = document.querySelector(".timeline")
const timelineRect = timeline.getBoundingClientRect();
timeline.addEventListener("click", (e) => {  
    const clickRelativeX = e.clientX - timelineRect.x;
    const newTimePosition = clickRelativeX / timelineRect.width * timeToSeconds(songs[Number(audioPlayer.getAttribute("current-audio-id"))].time);
    lastTime = newTimePosition;
    audioPlayer.currentTime = newTimePosition;
    setProgress(audioPlayer.duration, lastTime);
})

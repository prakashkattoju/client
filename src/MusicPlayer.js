import React from "react";
import { Button } from "react-bootstrap";
import { connect } from 'react-redux'
import { startPlayer, closePlayer, Toggle } from './Action'

const MusicPlayer = ({ PlayerData, IsPlaying, startPlayer, closePlayer, Toggle }) => {

    const trackList = PlayerData[0].list
    const trackCount = trackList.length
    const currentTrack = PlayerData[0].current
    const alterCover = PlayerData[0].alter
    const src = `${process.env.PUBLIC_URL}/uploads/songs/file/${trackList[currentTrack].song_file}`
    const [mainAudio] = React.useState(new Audio(src));
    const [trackProgress, setTrackProgress] = React.useState(0);
    const [trackVolume, setTrackVolume] = React.useState(0.5);
    //const [repeat, setRepeat] = React.useState(false)
    //const [IsPlaying, setIsPlaying] = React.useState(IsPlaying)

    const toggle = () => {
        IsPlaying ? Toggle(true) : Toggle(false)
    };

    const audioRef = React.useRef(mainAudio);
    const intervalRef = React.useRef();
    const isReady = React.useRef(false);

    const { duration } = audioRef.current;

    const currentPercentage = duration
        ? `${(trackProgress / duration) * 100}%`
        : "0%";
    const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                NextSong();
            } else {
                setTrackProgress(audioRef.current.currentTime);
            }
        }, [1000]);
    };

    const counter = () => {
        var totalTime = duration
        var totalminutes = Math.floor(totalTime / 60);
        var totalseconds = Math.floor(totalTime % 60);
        var totalsecondsWithLeadingZero = totalseconds < 10 ? '0' + totalseconds : totalseconds;
        var totaltimer = totalminutes + ':' + totalsecondsWithLeadingZero

        var timeRemaining = 0 + trackProgress
        var minutes = Math.floor(timeRemaining / 60);
        var seconds = Math.floor(timeRemaining % 60);
        var secondsWithLeadingZero = seconds < 10 ? '0' + seconds : seconds;
        var timer = minutes + ':' + secondsWithLeadingZero

        return duration ? timer + ' / ' + totaltimer : ''
    }

    const onScrub = (value) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    };

    const onScrubVolume = (value) => {
        audioRef.current.volume = value;
        setTrackVolume(audioRef.current.volume);
    }

    const onSetVolume = (value) => {
        if (parseInt(value) !== 0) {
            audioRef.current.volume = value;
            setTrackVolume(audioRef.current.volume);
        } else {
            audioRef.current.volume = 0;
            setTrackVolume(0);
        }
    }

    const onScrubEnd = () => {
        // If not already playing, start
        if (!IsPlaying) {
            Toggle(false)
        }
        startTimer();
    };

    React.useEffect(() => {
        IsPlaying ? audioRef.current.play() : audioRef.current.pause();
    }, [IsPlaying]);

    React.useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(src);
        setTrackProgress(audioRef.current.currentTime);
        setTrackVolume(audioRef.current.volume)
        audioRef.current.load();
        if (isReady.current) {
            audioRef.current.play();
            Toggle(false);
            startTimer();
        } else {
            // Set the isReady ref as true for the next pass
            isReady.current = true;
        }
    }, [currentTrack]);

    React.useEffect(() => {
        // Pause and clean up on unmount
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, []);

    audioRef.onended = async () => {
        if (parseInt(currentTrack) + 1 < trackCount) {
            const current = parseInt(currentTrack) + 1
            await startPlayer(PlayerData[0].id, current, trackList,alterCover)
        } else {
            await startPlayer(PlayerData[0].id, 0, trackList,alterCover)
        }
        await Toggle(false)
    }

    const PreviousSong = async () => {
        if (parseInt(currentTrack) - 1 < 0) {
            await startPlayer(PlayerData[0].id, trackCount - 1, trackList,alterCover)
        } else {
            const current = parseInt(currentTrack) - 1
            await startPlayer(PlayerData[0].id, current, trackList,alterCover)
        }
        await Toggle(false)
    }

    const NextSong = async () => {
        if (parseInt(currentTrack) < trackCount - 1) {
            const current = parseInt(currentTrack) + 1
            await startPlayer(PlayerData[0].id, current, trackList,alterCover)
        } else {
            await startPlayer(PlayerData[0].id, 0, trackList,alterCover)
        }
        await Toggle(false)
    }

    const closeHandle = async () => {
        await Toggle(true)
        await closePlayer()
    }

    /* const RepeatSong = async() =>{
        if(repeat === false){
            const repeatList = trackList.filter(function(el,index){
                return index === currentTrack
            });
            repeatList.push(trackList[currentTrack])
            await startPlayer(PlayerData[0].id, 0, repeatList, alterCover)
            setRepeat(true)
        } else {
            await startPlayer(PlayerData[0].id, currentTrack, trackList,alterCover)
            setRepeat(false)
        }
    } */

    return (
        <div className="audio-player">
            <input
                type="range"
                value={trackProgress}
                step="0.01"
                min="0"
                max={duration ? duration : `${duration}`}
                className="progress duration"
                onChange={(e) => onScrub(e.target.value)}
                onMouseUp={onScrubEnd}
                onKeyUp={onScrubEnd}
                style={{ background: trackStyling }}
            />
            
            <div className="audio-player-inner">
                <div className="audio-cover">
                    <img src={trackList[currentTrack].song_cover ? `${process.env.PUBLIC_URL}/uploads/songs/cover/${trackList[currentTrack].song_cover}` : `${process.env.PUBLIC_URL}/uploads/album/${alterCover}`} alt={trackList[currentTrack].song_name} />
                </div>
                {/* <h6 className="text-center"> {IsPlaying ? `${trackList[currentTrack].song_name} is Playing...` : `${trackList[currentTrack].song_name} is Paused`} </h6> */}
                <h6>{trackList[currentTrack].song_name}</h6>
                <div className="audio-track-progress">
                    <span>{counter()} </span>
                </div>
                <div className="audio-controls">
                    <Button size='sm' variant="outline-light" onClick={() => PreviousSong()}><i className="fa-solid fa-backward-step"></i></Button>
                    <Button size='sm' variant="outline-light" onClick={toggle}>{IsPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}</Button>
                    <Button size='sm' variant="outline-light" onClick={() => NextSong()}><i className="fa-solid fa-forward-step"></i></Button>
                    {/* <Button size="sm" variant={repeat ? 'light' : 'outline-light'} onClick={() => RepeatSong()}><i className="fa-solid fa-repeat"></i></Button> */}
                </div>
                <div className="audio-track-volume">
                    <i className={trackVolume === 0 ? 'fa-solid fa-volume-xmark' : trackVolume > 0.5 ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-low'} /* onClick={() => onSetVolume(trackVolume)} */></i>
                    {' '}
                    <input
                        type="range"
                        value={trackVolume}
                        step="0.01"
                        min="0"
                        max="1"
                        className="progress volume"
                        onChange={(e) => onScrubVolume(e.target.value)}
                    />
                </div>
                <div className="audio-player-menu"><i className="fa-solid fa-bars"></i></div>
                <div className="audio-player-close" onClick={() => closeHandle()}><i className="fa-solid fa-xmark"></i></div>
            </div>
        </div>
    )
}

const mapStateToPros = state => ({
    PlayerData: state.PlayerData,
    IsPlaying: state.IsPlaying
})

export default connect(mapStateToPros, { startPlayer, closePlayer, Toggle })(MusicPlayer)

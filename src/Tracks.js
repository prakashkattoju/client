import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { startPlayer } from './Action'

const Tracks = (props, { startPlayer }) => {
    const [tracks, setTracks] = React.useState([]);

    const getTracks = async () => {
        const response = await fetch(`http://localhost:5000/tracks/${props.id}`);
        const jsonResponse = await response.json();
        setTracks(jsonResponse)
    }

    React.useEffect(() => {
        getTracks()
    }, [])

    const playAllHandle = async () => {
        if (tracks.length > 0) {
            await startPlayer(props.id, 0, tracks)
        }
    }

    return (
        <div className='track-list'>
            <Button size='sm' variant='outline-light' style={{ 'marginBottom': '45px' }} onClick={() => playAllHandle()}>Play All <i className='fa-solid fa-play ms-2'></i></Button>

            {tracks.length > 0 ? tracks.map((item, index) => (
                <div key={index} className='track'>
                    <div className='track-cover'><img src={item.song_cover ? `${process.env.PUBLIC_URL}/uploads/album/${item.song_cover}` : props.cover} alt={item.song_name} /></div>
                    <Button size='sm' variant='outline-light'><i className='fa-solid fa-play'></i></Button>
                    <div className='track-info'><span className='track-name'>{item.song_name}</span>
                        <span className='track-meta'>{item.song_meta}</span></div>

                </div>
            )) : <div>No tracks avaliable.</div>}
        </div>
    )
}
const mapStateToProps = state => ({
    PlayerData: state.PlayerData
})

export default connect(mapStateToProps, { startPlayer })(Tracks)
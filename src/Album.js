import React from 'react'
import SideNav from './SideNav'
import TopNav from './TopNav'
import { Button, Card, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { startPlayer, closePlayer, Toggle } from './Action'

const Album = ({ PlayerData, IsPlaying, startPlayer, closePlayer, Toggle }) => {
    let params = useParams();

    const [albumData, setAlbumData] = React.useState([]);
    const [tracks, setTracks] = React.useState([]);

    const getAlbumData = async () => {
        const response = await fetch(`http://localhost:5000/album/${params.id}`);
        const jsonResponse = await response.json();
        setAlbumData(jsonResponse)
    }

    const getTracks = async () => {
        const response = await fetch(`http://localhost:5000/tracks/${params.id}`);
        const jsonResponse = await response.json();
        setTracks(jsonResponse)
    }

    React.useEffect(() => {
        getAlbumData()
        getTracks()
    }, [])

    const playAllHandle = async (cover) => {
        if (tracks.length > 0) {
            await closePlayer()
            await startPlayer(params.id, 0, tracks, cover)
            await Toggle(false)
        }
    }

    const playCurrentHandle = async (current, cover) => {
        if (tracks.length > 0) {
            await closePlayer()
            await startPlayer(params.id, current, tracks, cover)
            await Toggle(false)
        }
    }

    return (
        <div><TopNav />
            <div className='dashboard'>
                <SideNav />
                <div className='dashboard-body'>
                    <div className='admin-main'>
                        {albumData.length > 0 ?
                            albumData.map((item, index) => (
                                <Row key={index}><Col sm={2}><Card className='album-info'>
                                    <Card.Header>
                                        <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/uploads/album/${item.album_cover}`} />
                                    </Card.Header>
                                    <Card.Body>
                                        <p>{``}</p>
                                    </Card.Body>
                                </Card></Col>
                                    <Col sm={10}>
                                        <h1>{item.album_name}</h1>
                                        <p>{item.album_desc}</p>
                                        <div className='track-list'>
                                            <Button size='sm' variant='outline-light' style={{ 'marginBottom': '45px' }} onClick={() => playAllHandle(item.album_cover)}>Play All <i className='fa-solid fa-play ms-2'></i></Button>
                                            {tracks.length > 0 ? tracks.map((track, index) => (
                                                <div key={index} className={PlayerData.length > 0 && parseInt(PlayerData[0].id) === item.album_id && PlayerData[0].current === index ? 'track active' : 'track'} onClick={() => PlayerData.length > 0 && parseInt(PlayerData[0].id) === item.album_id ? PlayerData[0].current !== index ? playCurrentHandle(index, track.song_cover ? track.song_cover : item.album_cover) : IsPlaying ? Toggle(true) : Toggle(false) : playCurrentHandle(index, track.song_cover ? track.song_cover : item.album_cover)}>
                                                    <div className='track-cover'><img src={track.song_cover ? `${process.env.PUBLIC_URL}/uploads/songs/cover/${track.song_cover}` : `${process.env.PUBLIC_URL}/uploads/album/${item.album_cover}`} alt={track.song_name} /></div>
                                                    <Button size='sm' variant='outline-light'><i className={PlayerData.length > 0 && PlayerData[0].current === index && parseInt(PlayerData[0].id) === item.album_id && IsPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'}></i></Button>
                                                    <div className='track-info'><span className='track-name'>{track.song_name}</span>
                                                        <span className='track-meta'>{track.song_meta}</span></div>

                                                </div>
                                            )) : <div>No tracks avaliable.</div>}
                                        </div>
                                    </Col></Row>
                            )) : <h3 className='text-center'>No Albums are avalible.</h3>}
                    </div>
                </div>
            </div >
        </div>
    )
}

const mapStateToProps = state => ({
    PlayerData: state.PlayerData,
    IsPlaying: state.IsPlaying,
})

export default connect(mapStateToProps, { startPlayer, closePlayer, Toggle })(Album)
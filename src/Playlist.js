import React from 'react'
import SideNav from './SideNav'
import TopNav from './TopNav'
import { Card, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { startPlayer, closePlayer, Toggle } from './Action'

const Playlist = ({ startPlayer, closePlayer, Toggle }) => {
    let params = useParams();
    const navigate = useNavigate();

    const [user, setUser] = React.useState({})
    const [listData, setListData] = React.useState([]);
    const [tracks, setTracks] = React.useState([]);

    const accessToken = localStorage.getItem('accessToken')

    var myHeaders = new Headers();

    myHeaders.append("x-token", accessToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const getUser = async () => {
        const response = await fetch('http://localhost:5000/user', requestOptions);
        const jsonResponse = await response.json();
        setUser(jsonResponse)
    }

    React.useEffect(() => {
        if (accessToken) getUser()
    }, [accessToken])

    const getListData = async (uid) => {
        const response = await fetch(`http://localhost:5000/list/${params.id}`);
        const jsonResponse = await response.json();
        setListData(jsonResponse)
    }

    const getTracks = async () => {
        const response = await fetch(`http://localhost:5000/tracks`);
        const jsonResponse = await response.json();
        setTracks(jsonResponse)
    }

    React.useEffect(() => {
        getListData(user.id)
        getTracks()
    }, [params.id])

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
    const addtolistHandle = async (song_id) => {
        
    }
    console.log(listData[0]?.user_id)
    console.log(user.id)

    return (
        <div><TopNav />
            <div className='dashboard'>
                <SideNav />
                <div className='dashboard-body'>
                    <div className='admin-main'>
                        {listData.length > 0 ? parseInt(listData[0].user_id) === parseInt(user.id) ?
                            listData.map((item, index) => (
                                <Row key={index}><Col sm={2}><Card className='album-info'>
                                    <Card.Header>
                                        <Card.Img variant="top" src={item.list_cover ? `${process.env.PUBLIC_URL}/uploads/list/${item.list_cover}` : `${process.env.PUBLIC_URL}/uploads/defaultalbum.png`} />
                                    </Card.Header>
                                    <Card.Body>
                                        <p>{``}</p>
                                    </Card.Body>
                                </Card></Col>
                                    <Col sm={10}>
                                        <h1>{item.list_name}</h1>
                                        <p>{item.list_desc}</p>
                                    </Col></Row>
                            )) : <h3 className='text-center'>Access Denied, You Don't Have Permission To Access on This Playlist</h3> : <h3 className='text-center'>No List are avalible.</h3>}
                        <div className='track-list'>
                            <h2>Recommandations</h2>
                            {tracks.length > 0 ? tracks.map((track, index) => (
                                <div key={index} className='track list' onClick={() => addtolistHandle(track.song_id)}>
                                    <div className='list-head'><div className='track-cover'><img src={track.song_cover ? `${process.env.PUBLIC_URL}/uploads/songs/cover/${track.song_cover}` : `${process.env.PUBLIC_URL}/uploads/album/${track.album_cover}`} alt={track.song_name} /></div>
                                    <div className='track-info'><span className='track-name'>{track.song_name}</span> <span className='track-meta'>{track.song_meta}</span></div>
                                    </div>
                                    <div className='album-info'>{track.album_name}</div>
                                    <div className='addtolist'><span>ADD</span></div>
                                </div>
                            )) : <div>No tracks avaliable.</div>}
                        </div>
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

export default connect(mapStateToProps, { startPlayer, closePlayer, Toggle })(Playlist)
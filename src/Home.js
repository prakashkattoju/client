import React from 'react'
import SideNav from './SideNav'
import TopNav from './TopNav'
import { Card, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { startPlayer, closePlayer, Toggle } from './Action'

const Home = ({ PlayerData, IsPlaying, startPlayer, closePlayer, Toggle }) => {
    const [albumData, setAlbumData] = React.useState([]);

    const getAlbumData = async () => {
        const response = await fetch('http://localhost:5000/album/get');
        const jsonResponse = await response.json();
        setAlbumData(jsonResponse)
    }

    React.useEffect(() => {
        getAlbumData()
    }, [])

    return (
        <div><TopNav />
            <div className='dashboard'>
                <SideNav />
                <div className='dashboard-body'>
                    <div className='admin-main'>
                        <h1>Latest Uploads</h1>
                        {albumData.length > 0 ? <Row>
                            {albumData.map((item, index) => (
                                <Col key={index} sm={2} xs={6}><Card className='album-info'><Link to={`/album/${item.album_id}`}>
                                    <Card.Header>
                                        <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/uploads/album/${item.album_cover}`} />
                                    </Card.Header>
                                    <Card.Body>
                                        <h5>{item.album_name}</h5>
                                    </Card.Body>
                                </Link></Card></Col>))}
                        </Row> : <h3 className='text-center'>No Albums are avalible.</h3>}
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToPros = state => ({
    PlayerData: state.PlayerData,
    IsPlaying: state.IsPlaying
})

export default connect(mapStateToPros, { startPlayer, closePlayer, Toggle })(Home)
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Album from './Album'
import AlbumCreate from './dashboard/AlbumCreate'
import SongCreate from './dashboard/SongCreate'
import MusicPlayer from './MusicPlayer'
import Home from './Home'
import { connect } from 'react-redux'
import Login from './Login'
import Register from './Register'
import Playlist from './Playlist'

const App = ({ PlayerData }) => {

  const PrivateRoute = ({ children }) => {
    const location = useLocation()
    const accessToken = localStorage.getItem('accessToken')
    return accessToken ? children : <Navigate to="/login" replace state={{ from: location}} />;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/album/:id' element={<PrivateRoute><Album /></PrivateRoute>} />
          <Route path='/playlist/:id' element={<PrivateRoute><Playlist /></PrivateRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard/album/create' element={<AlbumCreate />} />
          <Route path='/dashboard/song/create' element={<PrivateRoute><SongCreate /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
      {PlayerData.length > 0 ? <MusicPlayer /> : ''}
    </div >
  )
}

const mapStateToProps = state => ({
  PlayerData: state.PlayerData,
})

export default connect(mapStateToProps)(App)
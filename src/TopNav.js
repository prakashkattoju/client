import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { removeAuth, closePlayer, Toggle } from "./Action"

const TopNav = ({ removeAuth, closePlayer, Toggle }) => {

  const [user, setUser] = React.useState({})

  const accessToken = localStorage.getItem('accessToken')

  var myHeaders = new Headers();

  myHeaders.append("x-token", accessToken);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const getUser = async () => {
    const response = await fetch('http://localhost:5000/user', requestOptions);
    const jsonResponse = await response.json();
    setUser(jsonResponse)
  }

  React.useEffect(() => {
    if (accessToken) {
      const decodedJwt = parseJwt(accessToken);
      if (decodedJwt.exp * 1000 < Date.now()) {
        logoutHandle(accessToken);
      } else {
        getUser()
      }
    }
  }, [accessToken])

  const logoutHandle = async (token) => {
    await removeAuth(token)
    await Toggle(true)
    await closePlayer()
  }

  return (
    <div className='admin-topnav'>
      <div className='brand'><Link to='/'><img src={`${process.env.PUBLIC_URL}/logo.png`} alt='ProjectFour' style={{ 'width': '125px' }} /></Link></div>
      <div className='account'>
        {accessToken && user ?
          <div className='d-flex justify-content-end align-items-center'>
            <div className='me-2'>Hello, {user.name}</div>
            <Button size='sm' variant='primary' onClick={() => logoutHandle(accessToken)}>Logout <i className="fa-solid fa-arrow-right-from-bracket"></i></Button>
          </div> : <div className='d-flex justify-content-end align-items-center'>
            <Link to='/register' className='me-2'><Button size='sm' variant='light'>Register <i className="fa-solid fa-user-plus"></i></Button></Link>
            <Link to='/login'><Button size='sm' variant='primary'>Login <i className="fa-solid fa-arrow-right-to-bracket"></i></Button></Link>
          </div>}
      </div>
    </div>
  )
}
const mapStateToPros = state => ({
  Auth: state.Auth.auth,
})

export default connect(mapStateToPros, { removeAuth, closePlayer, Toggle })(TopNav)
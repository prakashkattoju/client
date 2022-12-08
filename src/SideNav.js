import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from "react-hook-form";


const SideNav = () => {
    const location = useLocation();
    const { pathname } = location;

    const navigate = useNavigate();

    const splitLocation = pathname.split("/");

    const [user, setUser] = React.useState({})
    const [lists, setLists] = React.useState({})
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    const getLists = async (id) => {
        const response = await fetch(`http://localhost:5000/lists/${id}`);
        const jsonResponse = await response.json();
        setLists(jsonResponse)
    }

    React.useEffect(() => {
        if (accessToken) getUser()
    }, [accessToken])

    React.useEffect(() => {
        if (user.id) getLists(user.id)
    }, [user])

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("list_name", data.list_name);
        formData.append("list_desc", data.list_desc);
        formData.append("list_cover", data.list_cover[0]);

        var addPlaylist = await fetch('http://localhost:5000/list/create', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(result => {
                navigate(`/playlist/${result.list_id}`)
            })
            .catch(err => console.log(err))
            .finally(() => {
                reset()
                handleClose()
            })
    };

    const onError = (error) => {
        console.log("ERROR:::", error);
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        mode: "onTouched",
        reValidateMode: "onSubmit",
    });


    return (
        <div className='admin-sidenav'>
            <ul>
                <li>
                    <Link to='/'><i className="fa-solid fa-home"></i> Home</Link>
                </li>
                {accessToken && user && (user.role === 'user' || user.role === 'admin') ? <li>
                    <span onClick={handleShow}><i className="fa-regular fa-square-plus"></i> Create Playlist</span>
                </li> : ''}
                {accessToken && user && user.role === 'admin' ?
                    <ul>
                        <li>
                            <Link to='/dashboard/album/create'><i className="fa-solid fa-compact-disc"></i> Albums</Link>
                        </li>
                        <li>
                            <Link to='/dashboard/song/create'><i className="fa-solid fa-music"></i> Songs</Link>
                        </li>
                    </ul> : ''}
            </ul>
            {accessToken && lists.length > 0 ? <ul className='my-lists'>
                {lists.map((item, index) =>
                    <li key={index}><Link to={`/playlist/${item.list_id}`}>{item.list_name}</Link></li>
                ) }
            </ul> : ''}
            <Modal show={show} onHide={handleClose} centered>
                <Form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Playlist</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="list_cover" className="mb-3">
                            <Form.Label>Upload Playlist Cover Image (<small><span style={{ 'color': 'red' }}>* .png,.jpg,.jpeg,.webp</span></small>)</Form.Label>
                            <Form.Control
                                as="input"
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                size='sm'
                                {...register("list_cover")}
                            />
                            {errors.list_cover && (
                                <Form.Text className="text-danger">
                                    {errors.list_cover.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="list_name">
                            <Form.Label>Playlist Name</Form.Label>
                            <Form.Control
                                type="text"
                                size='sm'
                                {...register("list_name", { required: "Playlist Name Required" })}
                            />
                            {errors.list_name && (
                                <Form.Text className="text-danger">
                                    {errors.list_name.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="list_desc">
                            <Form.Label>Playlist Description</Form.Label>
                            <Form.Control
                                type="textarea"
                                size='sm'
                                {...register("list_desc")}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type='submit'>
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default SideNav
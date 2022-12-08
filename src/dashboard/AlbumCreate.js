import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useForm } from "react-hook-form";
//import Alert from '../Alert';
import SideNav from '../SideNav';
import TopNav from '../TopNav';

const AlbumCreate = () => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  /* const [show, setShow] = React.useState(false);
  const [title, setTitle] = React.useState(null);
  const [msg, setMsg] = React.useState(null);

  const handleClose = () => setShow(false); */

  const formSubmit = async(data, event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("album_name", data.album_name);
    formData.append("album_desc", data.album_desc);
    formData.append("album_cover", data.album_cover[0]);

    const addMusicAlbum = await fetch('http://localhost:5000/album/create', {
      method: 'POST',
      body: formData,
    })
    const addMusicAlbumJson = await addMusicAlbum.json();
    console.log(addMusicAlbumJson)
    if(addMusicAlbumJson !== undefined){
      alert(addMusicAlbumJson.msg)
    }
  };

  return (
    <div><TopNav />
      <div className='dashboard'>
        <SideNav />
        <div className='dashboard-body'>
          <div className='admin-main'>
            <h1>Add Music Album</h1>
            <Row>
              <Col sm={5}>
                <Form onSubmit={handleSubmit(formSubmit)}>
                  <Form.Group controlId="album_cover" className="mb-3">
                    <Form.Label>Upload Album Cover Image</Form.Label>
                    <Form.Control
                      as="input"
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      size='sm'
                      {...register("album_cover", { required: "Album Cover Image Required" })}
                    />
                    {errors.album_cover && (
                      <Form.Text className="text-danger">
                        {errors.album_cover.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="album_name">
                    <Form.Label>Album Name</Form.Label>
                    <Form.Control
                      type="text"
                      size='sm'
                      {...register("album_name", { required: "Album Name Required" })}
                    />
                    {errors.album_name && (
                      <Form.Text className="text-danger">
                        {errors.album_name.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="album_desc">
                    <Form.Label>Album Description</Form.Label>
                    <Form.Control
                      type="textarea"
                      size='sm'
                      {...register("album_desc", { required: "Album Description Required" })}
                    />
                    {errors.album_desc && (
                      <Form.Text className="text-danger">
                        {errors.album_desc.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Button variant="light" type="submit">
                    Save
                  </Button>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {/* <Alert show={show} onHide={handleClose} title={title} msg={msg} /> */}
    </div>
  )
}

export default AlbumCreate
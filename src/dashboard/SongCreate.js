import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import SideNav from '../SideNav';
import TopNav from '../TopNav';
//import Header from './Header';

const SongCreate = () => {

  //const [album, setAlbum] = React.useState(null);
  const [albumData, setAlbumData] = React.useState([]);

  const getAlbumData = async () => {
    const response = await fetch('http://localhost:5000/album/get');
    const jsonResponse = await response.json();
    setAlbumData(jsonResponse)
  }

  React.useEffect(() => {
    getAlbumData()
  }, [])

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("album_id", data.album_id);
    formData.append("song_cover", data.song_cover[0]);
    formData.append("song_name", data.song_name);
    formData.append("song_meta", data.song_meta);
    formData.append("song_file", data.song_file[0]);

    var addMusicAlbum = await fetch('http://localhost:5000/song/create', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .catch(err => console.log(err))
      .finally(() => reset(data));
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
    <div><TopNav />
      <div className='dashboard'>
        <SideNav />
        <div className='dashboard-body'>
          <div className='admin-main'>
            <h1>Add Song</h1>
            <Row>
              <Col sm={5}>
                <Form onSubmit={handleSubmit(onSubmit, onError)}>
                  <Form.Group className="mb-3" controlId="album_id">
                    <Form.Label>Product Category</Form.Label>
                    <Form.Control
                      as="select"
                      size='sm'
                     /*  onChange={e => {
                        setAlbum(e.target.value);
                      }} */
                      {...register("album_id", { required: "Album Required" })}
                    ><option value="">Select Album</option>
                      {albumData.length > 0 ? albumData.map((item, index) => (
                        <option key={index} value={item?.album_id}>{item?.album_name}</option>
                      )) : <option value="">No Album avalible</option>
                      }
                    </Form.Control>
                    {errors.album_id && (
                      <Form.Text className="text-danger">
                        {errors.album_id.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group controlId="song_cover" className="mb-3">
                    <Form.Label>Upload Song Cover Image (<small><span style={{ 'color': 'red' }}>* .png,.jpg,.jpeg,.webp</span></small>)</Form.Label>
                    <Form.Control
                      as="input"
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      size='sm'
                      {...register("song_cover")}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="song_name">
                    <Form.Label>Song Name</Form.Label>
                    <Form.Control
                      type="text"
                      size='sm'
                      {...register("song_name", { required: "Song Name Required" })}
                    />
                    {errors.song_name && (
                      <Form.Text className="text-danger">
                        {errors.song_name.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="song_meta">
                    <Form.Label>Song Info</Form.Label>
                    <Form.Control
                      type="textarea"
                      size='sm'
                      placeholder='ex: singer names, artists etc'
                      {...register("song_meta", { required: "Song Info Required" })}
                    />
                    {errors.song_meta && (
                      <Form.Text className="text-danger">
                        {errors.song_meta.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group controlId="song_file" className="mb-3">
                    <Form.Label>Upload Song(<small><span style={{ 'color': 'red' }}>* .mp3,.wav,.m4a,.oga,.ogg</span></small>)</Form.Label>
                    <Form.Control
                      as="input"
                      type="file"
                      accept=".mp3,.wav,.m4a,.oga,.ogg"
                      size='sm'
                      {...register("song_file", {
                        required: "Upload Song"
                      })}
                    />
                    {errors.song_file && (
                      <Form.Text className="text-danger">
                        {errors.song_file.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Button variant="light" type="submit">
                    Save
                  </Button>
                </Form>
              </Col>
              <Col sm={7}></Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SongCreate
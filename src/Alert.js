import React from 'react'
import { Modal } from 'react-bootstrap'

const Alert = (props) => {
    const [show, setShow] = React.useState(props.show);
    //const handleClose = () => setShow(false);

    return (
        <Modal
            show={show}
            onHide={props.onHide}
            size="sm"
            centered
        >
            <Modal.Body>
                <h4>{props.title}</h4>
                <p>{props.msg}</p>
            </Modal.Body>
        </Modal>
    )
}

export default Alert
import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { connect } from "react-redux"

const Register = ({ Auth }) => {

    const navigate = useNavigate();

    const [unameerror, setunameerror] = React.useState();
    const [successmsg, setSuccessMsg] = React.useState({
        status: false,
        msg: ''
    });

    const onSubmit = async (data) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var loginReq = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                if(result !== undefined){
                    if(result.error === 'uname') setunameerror(result)
                    if(result.status) setSuccessMsg(result)
                }
            })
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
        <div>
            <div className='auth'>
                <div className='auth-inner'>
                    <h1 className="text-center">Register</h1>
                    <Form onSubmit={handleSubmit(onSubmit, onError)}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                size='sm'
                                {...register("name", { required: "Full Name Required" })}
                            />
                            {errors.name && (
                                <Form.Text className="text-danger">
                                    {errors.name.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="uname">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                size='sm'
                                {...register("uname", { required: "Username Required" })}
                            />
                            {errors.uname && (
                                <Form.Text className="text-danger">
                                    {errors.uname.message}
                                </Form.Text>
                            )}
                            {(!errors.uname && unameerror) && (
                                <Form.Text className="text-danger">
                                    {unameerror.msg}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                size='sm'
                                {...register("password", { required: "Password Required" })}
                            />
                            {errors.password && (
                                <Form.Text className="text-danger">
                                    {errors.password.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        {successmsg.status && (<div className="mb-3"><Form.Text className="text-success"> {successmsg.msg} </Form.Text></div>)}
                        <Button variant="primary" type="submit" size='sm' className="w-100">
                            Register
                        </Button>
                    </Form>
                    <div className='mt-3 text-center'><Link to='/' style={{ 'color': '#fff', 'textDecoration': 'none' }}>Back to Home</Link> | <Link to='/login' style={{'color': '#fff', 'textDecoration': 'none'}}>Login</Link> </div>
                </div >
            </div>
        </div>
    )
}
const mapStateToPros = state => ({
    Auth: state.Auth.auth,
})
export default connect(mapStateToPros)(Register)

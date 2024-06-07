import React, { useEffect, useState } from 'react'
import "./ResetPassword.css"
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { resetPassword } from '../../Actions/User';
import { Link, useParams } from 'react-router-dom';
const ResetPassword = () => {
    const [newpassword,setNewPassword]=useState("");
    const alert=useAlert();
    const {error,loading,message}=useSelector((state)=>state.like)

    const params=useParams();
    // console.log(params);
    const dispatch=useDispatch();


    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(resetPassword(params.token,newpassword));
    };

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch({type:"clearErrors"});
        }
        if(message){
            alert.success(message);
            dispatch({type:"clearMessage"});
        }
    },[alert,error,message,dispatch]);
    
  return (
    <div className='resetPassword'>
        <form className='resetPasswordForm' onSubmit={submitHandler}>
            <Typography variant='h3' style={{padding:"2vmax"}}>
                Social App
                </Typography>


              <input  type="password"
                placeholder='New Password'
                required
                value={newpassword}
                className="resetPasswordInputs"
                onChange={(e)=>setNewPassword(e.target.value)}/>

               <Link to="/" >
                    <Typography>
                    Login
                    </Typography>
                    </Link>
                    <Typography>Or</Typography>
                <Link to="/forgot/password" >
                    <Typography>
                    Request Another Token
                    </Typography>
                    </Link>
          
            <Button disabled={loading} type='submit'>Reset Password</Button>
            
        </form>
    </div>
  )
}

export default ResetPassword
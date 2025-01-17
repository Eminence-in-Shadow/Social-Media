import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import {useDispatch, useSelector} from "react-redux";
import {  followAndUnfollowUser, getAllUsers, getFollowingPosts, getUserPosts, getUserProfile, loadUser } from '../../Actions/User';
import Post from '../Post/Post';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import { useAlert } from 'react-alert';
// import { Link } from 'react-router-dom';
import User from '../User/User';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const dispatch=useDispatch(); 
   const alert=useAlert();
   const params=useParams();

   const{user,loading:userLoading,error:userError} =useSelector((state)=> state.userProfile);

   const{user:me} =useSelector((state)=>state.user);

  //  const {loading,posts,error} = useSelector(
  //   (state)=>state.postofFollowing
  // );
  const {loading,error,posts}=useSelector((state)=>state.userPost);

  const {error:followError,message,loading:followLoading}=useSelector((state)=>state.like);
  
  const [followersToggle,setFollowersToggle]=useState(false);
  const [followingToggle,setFollowingToggle]=useState(false);
  const [following,setFollowing]=useState(false);
  const [myProfile,setmyProfile]=useState(false);

  const followHandler=async()=>{
    setFollowing(!following);
    await dispatch(followAndUnfollowUser(user._id));
    dispatch(getUserProfile(params.id));
    dispatch(loadUser());
    dispatch(getAllUsers());
  }
  useEffect(()=>{
    dispatch(getUserPosts(params.id));
    dispatch(getUserProfile(params.id));
  },[dispatch,params.id]);

  useEffect(()=>{
    dispatch(getAllUsers());
    dispatch(getFollowingPosts());
  },[dispatch]);

  useEffect(()=>{
    if(me._id === params.id){
      setmyProfile(true);
    }

    if(user){
      user.followers.forEach((item)=>{
        if(item._id === me._id){
          setFollowing(true);
        }
       });
      }else{
      setFollowing(false);
    }
  },[user,me._id,params.id])
  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch({type:"clearErrors"});
    }
    if(followError){
        alert.error(followError);
        dispatch({type:"clearErrors"});
    }
    if(userError){
        alert.error(userError);
        dispatch({type:"clearErrors"});
    }
    if(message){
        alert.success(message);
        dispatch({type:"clearMessage"});
    }},[alert,error,message,followError,userError,dispatch]);


  return loading===true || userLoading===true ? (
    <Loader/>
  ):(
    <div className='account'>
        <div className="accountleft">

        {posts && posts.length > 0 ? (posts.map((post)=>( 
            <Post
            key={post._id}
            postId={post._id}
            caption={post.caption}
            postImage={post.image.url}
            // postImage={post.caption}
            likes={post.likes}
            comments={post.comments}
            ownerImage={post.owner.avatar.url}
            ownerName={post.owner.name}
            ownerId={post.owner._id}
            />
          )) 
         ) : <Typography variant='h5'>User has not Posted anything yet </Typography> 
          }

        </div>
        <div className="accountright">
          
          {
          user && (
             <>
            <Avatar
              src={user.avatar.url}
              sx={{ height: "8vmax", width: "8vmax" }}
            />
             
          <Typography variant='h5'>{user.name}</Typography>
          <div>
            <button onClick={()=>setFollowersToggle(!followersToggle)}>
              <Typography>
                Followers
              </Typography>
            </button>
            <Typography>{user.followers.length}</Typography>
          </div>
          <div>
            <button  onClick={()=>setFollowingToggle(!followingToggle)}>
              <Typography>
                Following
              </Typography>
            </button>
            <Typography>{user.following.length}</Typography>
          </div>
          <div>
              <Typography>
                Post
              </Typography>            
            <Typography>{user.posts.length}</Typography>
          </div>
          {
            myProfile ? null :(
              <Button variant='contained' onClick={followHandler}
              style={{backgroundColor:following?"red":"blue"}}
              disabled={followLoading}
              >
                {following ? "Unfollow" :"Follow"}
                </Button>
            )
          }
             </>
          )
          }

         


          <Dialog
        open={followersToggle} 
        onClose={()=>setFollowersToggle(!followersToggle)}
        > 
        <div className="DialogBox">
            <Typography variant='h4'>
                Followers
            </Typography>
            {
              user && user.followers.length >0 ?(
              user.followers.map((follower)=>(
                <User
                key={follower._id}
                userId={follower._id}
                name={follower.name}
                avatar={follower.avatar.url}
                />

              ))
            ):(
              <Typography style={{margin:"2vmax"}}>
                You Have No Followers
                </Typography>
            )}

            
        </div>
        </Dialog>

        <Dialog
        open={followingToggle} 
        onClose={()=>setFollowingToggle(!followingToggle)}
        > 
        <div className="DialogBox">
            <Typography variant='h4'>
                Following
            </Typography>
            {
              user && user.following.length >0 ?(
              user.followers.map((follow)=>(
                <User
                key={follow._id}
                userId={follow._id}
                name={follow.name}
                avatar={follow.avatar.url}
                />

              ))
            ):(
              <Typography style={{margin:"2vmax"}}>
                You Are Not Following Anyone.
                </Typography>
            )}    
        </div>
        </Dialog>

        </div>
        </div>
  )
}

export default UserProfile
import Grid from '@mui/material/Grid';
import React from 'react';
import Block from '../../components/Blockuser';
import Friendrequest from '../../components/friendrequest';
import Friends from '../../components/friends';
import Grouplist from '../../components/Grouplist';
import Mygroups from '../../components/Mygroups';
import Searchbox from '../../components/Searchbox';
import Userlist from '../../components/userlist';
import "./style.css";

const Home = () => {
  return (
    <>
     
    <Grid container className="home-pages">
        <Grid item xs={4} className="home-items">
         <div>
            <Searchbox/>
         </div>
         <div>
            <Grouplist/>
            <Friendrequest/>
         </div>
        </Grid>
        <Grid item xs={4} className="home-items">
         <div>
         <Friends/>
         </div>
         <div>
            <Mygroups/>
         </div>
        </Grid>
        <Grid item xs={4} className="home-items">
         <div>
         <Userlist/>
         </div>
        <div>
         <Block/>
        </div>
        </Grid>
     </Grid>
    
    </>
  )
}

export default Home;

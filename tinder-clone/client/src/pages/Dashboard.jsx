import React, { useEffect, useState } from 'react'
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios';
import { useCookies } from 'react-cookie'
import { CircularProgress } from '@mui/material';
import { HOST } from '../App';

function Dashboard() {
  const [lastDirection, setLastDirection] = useState();
  const [cookie] = useCookies(['user']);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [genderedUsers, setGenderedUsers] = useState();
  const [isChanged, setChanged] = useState(false);

  const onSwipe = async (direction, swipedUserId) => {
    if (direction === 'right') {
      try {
        const { user_id } = user;
        const resp = await axios.post(`${HOST}/add-match`, { user_id, swipedUserId });
        if (resp.status == 201) {
          getUser();
          setChanged(!isChanged)
        }
      } catch (e) {
        //nothing to do with this thing
      } finally {
        //we have to do final things
      }
    }
  }

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  const getUser = async () => {
    !genderedUsers?.length && setLoading(true);
    const userId = cookie.UserId;
    try {
      const response = await axios.get(`${HOST}/user`, {
        params: { userId }
      })

      if (response.status === 201) setUser(response.data);

    } catch (e) {
      console.log('error occred in loading user info');
    } finally {
      //some action to do like loading set to falseconnect 
    }
  }

  const matchedUserArray = user?.matches?.map(user => user?.user_id)

  const newUsers = genderedUsers?.filter(user => !matchedUserArray.includes(user.user_id))

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get(`${HOST}/genered-users`, {
        params: {
          gender: user.gender_interest,
        }
      })
      setGenderedUsers(response.data)
    } catch (e) {
      //nothing to do 
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUser();
  }, [])

  useEffect(() => {
    user.gender_interest && getGenderedUsers();
  }, [user?.user_id])


  return (
    <div className="dashboard">
      <ChatContainer user={user} isChanged={isChanged} />

      <div className="swipe-container">
        <div className="card-container">

          {loading ?
            <div className="loader">
              <CircularProgress />
              <h3>Loading Your swipes</h3>
            </div>
            : <>
              {
                newUsers?.map(character => (
                  <>
                    <TinderCard
                      className="swipe"
                      key={Math.random() * 10000000 + character?.first_name}
                      onSwipe={dir => onSwipe(dir, character.user_id)}
                      onCardLeftScreen={() => onCardLeftScreen(character.first_name)}
                      preventSwipe={['up', 'down']}
                    >
                      <div style={{ backgroundImage: `url(${character.url})` }} className='card'>
                        <h3>{character.first_name}</h3>
                      </div>
                    </TinderCard>
                  </>
                )
                )
              }
            </>
          }

          <div className="swipe-info">
            {lastDirection ? <p> You Swiped {lastDirection}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

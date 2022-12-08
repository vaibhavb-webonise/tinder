import React, { useState } from 'react'
import Nav from '../components/Nav';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import LoadingScreen from './LoadingScreen';
import { useLoading } from '../Consumer';
import { useNavigate } from 'react-router-dom';
import { HOST } from '../App';
function Onboarding() {
  const [cookie] = useCookies(['user']);
  const [loading, setLoading] = useLoading();

  const [formData, setFromData] = useState({
    user_id: cookie?.UserId,
    first_name: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    show_gender: true,
    gender_identity: 'man',
    gender_interest: 'woman',
    email: cookie?.Email,
    url: '',
    about: '',
    matches: [],
  })

  const [radioValue, setRadioValue] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name } = e.target;
    const value = e.target.value;
    console.log(name, value);
    setFromData({ ...formData, [name]: value })
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${HOST}/update`, formData);

      const success = response.status === 201;
      if (success) navigate('/dashboard')
    } catch (err) {
      console.log('error occcured in API call');
    } finally {
      setLoading(false);
    }


  }


  return (
    <>
      <Nav
        minimal={true}
        setShowModal={() => { }}
        showModal={false}
      />

      <div className="onboarding">
        <h2>CREATE ACCOUNT</h2>

        <form onSubmit={handleSubmit}>
          <section>

            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="First Name"
              required
              onChange={handleChange}
            />


            <label htmlFor="dob_day">Birthday</label>
            <div className="multiple-input-container">
              <input
                type="number"
                name="dob_day"
                id="dob_day"
                placeholder="DD"
                required
                onChange={handleChange}
              />


              <input
                type="number"
                name="dob_month"
                id="dob_month"
                placeholder="MM"
                required
                onChange={handleChange}
              />

              <input
                type="number"
                name="dob_year"
                id="dob_year"
                placeholder="YYYY"
                required
                onChange={handleChange}
              />
            </div>



            <label>Gender</label>
            <div className="multiple-input-container">

              <input
                type="radio"
                name="gender_identity"
                id="woman_gender_identity"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_identity === "woman"}
              />
              <label htmlFor="woman_gender_identity">Woman</label>



              <input
                type="radio"
                name="gender_identity"
                id="man_gender_identity"
                value="man"
                onChange={handleChange}
                checked={formData.gender_identity === "man"}
              />
              <label htmlFor="man_gender_identity">Man</label>

              <input
                type="radio"
                name="gender_identity"
                id="more_gender_identity"
                value="more"
                onChange={handleChange}
                checked={formData.gender_identity === "more"}
              />
              <label htmlFor="more_gender_identity">More</label>
            </div>

            <label htmlFor="show_gender">Show gender on my profile</label>
            <input
              type="checkbox"
              name="show_gender"
              id="more_gender"
              value={radioValue}
              onChange={(e) => {
                setRadioValue(!radioValue)
                handleChange(e);
              }}
              checked={!radioValue}
            />



            {/* <label htmlFor="show_me">Show Me</label>
            <input
              type="checkbox"
              name="show_gender"
              id="more_gender"
              onChange={handleChange}
            /> */}




            <label>Gender Interested</label>
            <div className="multiple-input-container">

              <input
                type="radio"
                name="gender_interest"
                id="woman_gender_interest"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_interest === "woman"}
              />
              <label htmlFor="woman_gender_interest">Woman</label>



              <input
                type="radio"
                name="gender_interest"
                id="man_gender_interest"
                value="man"
                onChange={handleChange}
                checked={formData.gender_interest === "man"}
              />
              <label htmlFor="man_gender_interest">Man</label>

              <input
                type="radio"
                name="gender_interest"
                id="everyone_gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={formData.gender_interest === "everyone"}
              />
              <label htmlFor="everyone_gender_interest">Everyone</label>
            </div>



            <label htmlFor="about">About</label>
            <input
              type="text"
              name="about"
              id="about"
              placeholder="I like the walks..."
              onChange={handleChange}
              required
            />
            <input type="submit" />
          </section>

          <section>
            <label htmlFor="profile">Profile</label>
            <div className="photo-container">
              <input
                type="url"
                name="url"
                value={formData.url}
                id="url"
                onChange={handleChange}
              />
              {
                formData.url &&
                <div className="photo-wrapper">
                  <img className="profile-photo" src={formData.url} alt="profile photo preview" />
                </div>
              }
            </div>
          </section>
        </form>
      </div>

      <LoadingScreen open={loading} alertText={'Updating .... please wait... '} />
    </>
  )
}

export default Onboarding

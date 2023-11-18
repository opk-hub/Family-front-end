import { createContext, useState,useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import MyProfile from './components/MyProfile';
import PersonInfo from './components/PersonInfo';
import UpdateMember from './components/UpdateMember';
import { FamilyIdProvider } from './components/FamilyIdContext';
import { RegisterIdProvider } from './components/RegisterIdContext';
import { Eclipse } from "react-loading-io";
import DisplayFamilyData from './components/DisplayFamilyData';
import UpdateDetails from './components/UpdateDetails';
import Cookies from 'js-cookie';


export const store = createContext();

const App = () => {
  const [token, setToken] = useState(null);

  const [loading,setLoading]=useState(false)
  useEffect(() => {
    const initializeApp = async () => {
      // Check if the token is present in cookies or any other storage mechanism
      const storedToken = Cookies.get('token'); // Import Cookies if not already done

      if (storedToken) {
        // Token is present, set it in the state
        setToken(storedToken);
      }

      setLoading(false);
    };

    initializeApp();
  }, []);
  
  return (
    <div>
      {
        loading? <Eclipse size={64} />
        :
        <center>
        <store.Provider value={[token, setToken]}>
          <RegisterIdProvider>
            <FamilyIdProvider>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/users/register" element={<Register />} />
                  <Route path="/" element={<Login />} />
                  <Route path="/home" element={<Home />} /> 
                  <Route path='/display-register-family' element={<DisplayFamilyData />} /> 
                  <Route path="/users/my-profile/:registerId" element={<MyProfile />} />
                  <Route path="/family" element={<UpdateDetails />} />

                  <Route path="/users/personinfo/:familyId" element={<PersonInfo />} />
                  <Route path="/update-member/:memberId" element={<UpdateMember />} />
                </Routes>
              </BrowserRouter>
            </FamilyIdProvider>
          </RegisterIdProvider>
        </store.Provider>
      </center>


      }
    </div>
  );
};

export default App;

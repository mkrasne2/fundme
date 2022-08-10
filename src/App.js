import React from 'react';
import Home from './Home.js';
import About from './About.js';
import Proposals from './Proposals.js';
import Indprop from './Indprop.js';
import Create from './Create.js';
import Header from './components/Navigation.js';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";


function Homepage() {
return (
  <div>
  <Header />
  <Home />
  </div>
)
}

  function Aboutpage() {
    return (
      <div>
      <Header />
      <About />
      </div>
    )
    }
    function Fundproposals() {
      return (
        <div>
        <Header />
        <Proposals />
        </div>
      )
      }

      function Individualprops() {
        return (
          <div>
          <Header />
          <Indprop />
          </div>
        )
        }

        function Createprops() {
          return (
            <div>
            <Header />
            <Create />
            </div>
          )
          }

export default function App() {
  return (
    <div >
    <Routes>
      <Route  path='/' element={<Homepage />} />
    </Routes>
    <Routes>
      <Route  path='/about'  element={<Aboutpage />}/>
    </Routes>
    <Routes>
      <Route  path='/proposals'  element={<Fundproposals />}/>
    </Routes>
    <Routes>
      <Route  path='/submit'  element={<Createprops />}/>
    </Routes>
    <Routes>
      <Route  path='/proposals/:id'  element={<Individualprops />}/>
    </Routes>
    
  
  </div>
  );
}
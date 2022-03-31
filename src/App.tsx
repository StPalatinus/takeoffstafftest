import React from 'react';
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAppSelector } from './app/hooks';

import {
  // login,
  logout,
  toggleLoginFormVision,
} from "./features/login/MainSlice";


import LoginPage from './components/loginpage/login-page';
import Contacts from './components/contacts/contacts';
import './App.css';
import 'antd/dist/antd.css'
import { Layout, Button  } from 'antd';
import { useAppDispatch } from './app/hooks';
const { Header, Footer, Sider, Content } = Layout;



function App() {
  const dispatch = useAppDispatch();
  const isLogedIng = useAppSelector((state) => state.handleLogin.isLogedIng);
  
  const loginButton  =  isLogedIng ? 
  <Button onClick={() => dispatch(logout())}>logout</Button> :
  <Button onClick={() => dispatch(toggleLoginFormVision())}>login</Button>;

  return (
    <Layout>
      <Header>
      <Link to="/home">{loginButton}</Link>
      </Header>
      <Layout>
        <Sider>
        <nav>
        <ul>
          <li>
          <Link to="/home"><Button>Home</Button></Link>
          </li>
          <li>
            <Link to="/contacts"><Button>Contacts</Button></Link>
          </li>
        </ul>
      </nav>
        </Sider>
        <Content>
        <Routes>
        <Route
          path="/home"
          element={
            <LoginPage></LoginPage> 
          }
        ></Route>
        <Route
          path="/contacts"
          element={
            <Contacts></Contacts>
          }
        ></Route>
        <Route path="/" element={<Navigate replace to="/home" />} />
        </Routes>
        </Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
    
  );
}

export default App;

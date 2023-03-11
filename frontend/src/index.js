import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './index.css'
import App from './App'
import Login from "./components/loginpage/loginpage"
import Dashboard from "./components/dashboard/dashboard"
import Register from "./components/register/register"
import CreateTicket from "./components/createTicket/createTicket"
import ViewTickets from "./components/viewTickets/viewTickets"
import TicketDetail from "./components/ticketDetail/ticketDetail";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <BrowserRouter>
          <Routes>
              <Route index element={<App />} />
              <Route path="login" element={<Login />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="register" element={<Register />} />
              <Route path="createTicket" element={ <CreateTicket /> }/>
              <Route path="viewTickets" element={ <ViewTickets /> }/>
              <Route path="viewTickets/:ticketId" element={ <TicketDetail /> }/>
          </Routes>
      </BrowserRouter>
);


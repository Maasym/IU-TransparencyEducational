import React from 'react'
import { Navigate } from "react-router-dom"
import './dashboard.css'
import Navbar from "../navbar/navbar";

const Dashboard = () => {

    if(!JSON.parse(localStorage.getItem("loggedUser"))){
        return <Navigate replace to="/login" />
    } else {
        return (
            <div className='dashboard'>
                <Navbar />
                <div className='dashboardInfo'>
                    <p>Welcome to Transparency Educational</p>
                    <p>Please use the links to create a ticket or view your tickets</p>
                </div>
            </div>

        )
    }
}

export default Dashboard
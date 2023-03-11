import React, {useEffect, useState} from 'react'
import {Link, Navigate} from "react-router-dom"
import './viewTickets.css'
import Navbar from "../navbar/navbar"
import GetTicketService from '../../services/TicketService'
import Moment from 'react-moment'

const ViewTickets = () => {

    const [tickets, setTickets] = useState([])
    const [status, setStatus] = useState('added')
    const [module, setModule] = useState('all')
    const [arrModule, setArrModule] = useState([] )
    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

    useEffect(() => {
        fetchTickets()
    },[])

    useEffect(() => {
        fetch(`${API_ENDPOINT}api/modules`)
            .then(response => response.json())
            .then(data => setArrModule(data.splice(1)))
    },[])

    const fetchTickets = () => {
        const tempTickets = GetTicketService.getTickets()
        tempTickets.then(function (result) {
            setTickets(result)
        })
    }

    if(!JSON.parse(localStorage.getItem("loggedUser"))){
        return <Navigate replace to="/login" />
    } else {
        return (
            <div className='viewTicket'>
                <Navbar />
                <div className='viewTicketPage'>

                    <div className='viewTicketsStatusBoxes'>
                        <div className='viewTicketStatusFilter'>
                            Status Filter
                            <select
                                className= 'viewTicketStatusFilterInput'
                                type="text"
                                value={status}
                                name="Status"
                                onChange={({ target }) => setStatus(target.value)}
                            >
                                <option value="added">added</option>
                                <option value="in progress">in progress</option>
                                <option value="closed">closed</option>
                            </select>
                        </div>

                        <div className='viewTicketModuleFilter'>
                            Module Filter
                            <select
                                className= 'viewTicketModuleFilterInput'
                                type="text"
                                value={module}
                                name="Module"
                                onChange={({ target }) => setModule(target.value)}
                            >
                                <option value='all'>all</option>
                                {arrModule.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.text}
                                    </option>
                                ))}

                            </select>
                        </div>
                    </div>

                    <div className='viewTicketContainer'>
                         {tickets.map((tickets, index) => {
                             if(module !== 'all'){
                                if(tickets.status === status && tickets.module === module){
                                    return(
                                        <Link to={`/viewTickets/${tickets.ticketNumber}`} >
                                            <div className='viewTicketForm' >
                                                <div className='viewTicketID'>
                                                    <p key={index}>Ticket ID: {tickets.ticketNumber}</p>
                                                </div>
                                                <div className='viewTicketTop'>
                                                    <div className='titleModule'>
                                                        <p key={index}>Title: {tickets.title}</p>
                                                        <p key={index}>Module: {tickets.module}</p>
                                                    </div>

                                                    <div className='statusCategory'>
                                                        <p key={index}>Status: {tickets.status}</p>
                                                        <p key={index}>Category: {tickets.category}</p>
                                                    </div>
                                                </div>

                                                <div className='dateViewTicket'>
                                                    <p key={index}>Date added: <Moment format="DD.MM.YYYY HH.mm">{tickets.date}</Moment></p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                }
                             } else if(module === 'all'){
                                 if(tickets.status === status){
                                     return(
                                         <Link to={`/viewTickets/${tickets.ticketNumber}`} >
                                             <div className='viewTicketForm'>
                                                 <div className='viewTicketID'>
                                                     <p key={index}>Ticket ID: {tickets.ticketNumber}</p>
                                                 </div>
                                                 <div className='viewTicketTop'>
                                                     <div className='titleModule'>
                                                         <p key={index}>Title: {tickets.title}</p>
                                                         <p key={index}>Module: {tickets.module}</p>
                                                     </div>

                                                     <div className='statusCategory'>
                                                         <p key={index}>Status: {tickets.status}</p>
                                                         <p key={index}>Category: {tickets.category}</p>
                                                     </div>
                                                 </div>

                                                 <div className='dateViewTicket'>
                                                     <p key={index}>Date added: <Moment format="DD.MM.YYYY HH.MM">{tickets.date}</Moment></p>
                                                 </div>
                                             </div>
                                         </Link>
                                     )
                                 }
                             }
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewTickets
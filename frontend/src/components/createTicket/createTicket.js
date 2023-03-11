import React, {useState, useEffect} from 'react'
import {Link, Navigate} from "react-router-dom"
import './createTicket.css'
import Navbar from "../navbar/navbar";
import Notification from "../notification/notification";
import createTicketService from "../../services/TicketService";
import axios from "axios";


const CreateTicket = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [module, setModule] = useState('')
    const [category, setCategory] = useState('')
    const [page, setPage] = useState('')
    const [arrModule, setArrModule] = useState([] )
    const [arrCategory, setArrCategory] = useState([] )
    const [image, setImage] = useState('')
    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

    useEffect(() => {
        fetch(`${API_ENDPOINT}api/modules`)
            .then(response => response.json())
            .then(data => setArrModule(data))
    },[])

    useEffect(() => {
        fetch(`${API_ENDPOINT}api/categories`)
            .then(response => response.json())
            .then(data => setArrCategory(data))
    },[])

    const handleCreateTicket = async (event) => {
        event.preventDefault()

        if(title === '' || text === '' || page === '' || category === 'Please select one' || module === 'Please select one'){
            setErrorMessage('all fields must be filled')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        } else {

            let imageUrl = "";
            if (image) {
                const formData = new FormData()
                formData.append("file", image)
                formData.append("upload_preset", 's2Yspkm7dvbBxu')
                const dataRes = await axios.post("https://api.cloudinary.com/v1_1/dcvhvqtzw/image/upload", formData)
                imageUrl = dataRes.data.url
            }

            const userId = createTicketService.getUserID()

            try {
                await createTicketService.createTicket({
                    title, text, module, category, page, imageUrl, userId
                })

                setTitle('')
                setText('')
                setModule('')
                setCategory('')
                setPage('')
                setImage('')
            } catch (exception) {
                setErrorMessage('internal Error')
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            }
        }
    }

    if(!JSON.parse(localStorage.getItem("loggedUser"))){
        return <Navigate replace to="/login" />
    } else {
        return (
            <div className='createTicket'>
                <Navbar />

                <div className='createTicketContainer'>
                    <form className='createTicketForm' onSubmit={handleCreateTicket}>
                        <Notification message={errorMessage} />

                        <div className='createTicketTitleCategory'>
                            <div className='createTicketTitle'>
                                Title
                                <input
                                    className= 'createTicketTitleInput'
                                    type="text"
                                    value={title}
                                    name="Title"
                                    onChange={({ target }) => setTitle(target.value)}
                                />
                            </div>

                            <div className='createTicketCategory'>
                                Category
                                <select
                                    onChange={({ target }) => setCategory(target.value)}
                                    className= 'createTicketCategoryInput'
                                    type="text"
                                    value={category}
                                    name="Category"
                                >
                                    {arrCategory.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className='createTicketTextPage'>
                            <div className='createTicketText'>
                                Text
                                <textarea
                                    className='createTicketTextInput'
                                    type="textarea"
                                    value={text}
                                    name="Text"
                                    onChange={({ target }) => setText(target.value)}
                                />
                            </div>

                            <div className='createTicketPageModule'>
                                <div className='createTicketPage'>
                                    Page
                                    <input
                                        className='createTicketPageInput'
                                        type="number"
                                        min='0'
                                        value={page}
                                        name="Page"
                                        onChange={({ target }) => setPage(target.value)}
                                    />
                                </div>

                                <div className='createTicketModule'>
                                    Module
                                    <select
                                        className= 'createTicketModuleInput'
                                        type="text"
                                        value={module}
                                        name="Module"
                                        onChange={({ target }) => setModule(target.value)}
                                    >
                                        {arrModule.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='createTicketUpload'>
                                    Attachments
                                    <input
                                        className='createTicketUploadInput'
                                        type="file"
                                        name="Attachment"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>
                            </div>
                        </div>

                        <button className='createTicketButton' type="submit">Create Ticket</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateTicket
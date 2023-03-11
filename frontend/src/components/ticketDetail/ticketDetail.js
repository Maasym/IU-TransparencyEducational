import React, {useEffect, useState} from 'react'
import {Link, Navigate, useParams} from "react-router-dom"
import './ticketDetail.css'
import Navbar from "../navbar/navbar"
import Notification from "../notification/notification";
import GetTicketService from "../../services/TicketService";
import axios from "axios";
import createTicketService from "../../services/TicketService";
import Moment from 'react-moment'

const TicketDetail = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const [errorMessageAttachment, setErrorMessageAttachment] = useState(null)
    const [errorMessageComment, setErrorMessageComment] = useState(null)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [module, setModule] = useState('')
    const [category, setCategory] = useState('')
    const [page, setPage] = useState('')
    const [arrModule, setArrModule] = useState([] )
    const [arrCategory, setArrCategory] = useState([] )
    const [arrEditor, setArrEditor] = useState([] )
    const [disabled, setDisabled] = useState(true)
    const [editor, setEditor] = useState('')
    const [editorChange, setEditorChange] = useState('')
    const [status, setStatus] = useState('')
    const [arrAttachments, setArrAttachments] = useState([] )
    const [image, setImage] = useState('')
    const [arrComments, setArrComments] = useState([] )
    const [newComment, setNewComment] = useState('')
    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

    const params = useParams()

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

    useEffect(() => {
        fetch(`${API_ENDPOINT}api/users`)
            .then(response => response.json())
            .then(data => setArrEditor(data))
    },[])

    useEffect( () => {
       fetchTicket()
       fetchAttachment()
       fetchComment()

        const isAdmin = window.localStorage.getItem('role').replaceAll('"', '')
        if( isAdmin === 'admin'){
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    },[])


    const fetchTicket =  () => {
        const tempTickets = GetTicketService.getTicket(params.ticketId)
        tempTickets.then(function (result) {
            setTitle(result[0].title)
            setCategory(result[0].category)
            setText(result[0].text)
            setPage(result[0].page)
            setModule(result[0].module)
            setEditor(result[0].editor)
            setStatus(result[0].status)
        })
    }

    const fetchComment =  () => {
        const tempComments = GetTicketService.getComment(params.ticketId)
        tempComments.then(function (result) {
           setArrComments(result)
        })
    }

    const fetchAttachment =  () => {
        const tempAttachments = GetTicketService.getAttachment(params.ticketId)
        tempAttachments.then(function (result) {
            setArrAttachments(result)
        })
    }

    const handleUpdateTicket = async (event) => {
        event.preventDefault()

        if(title === '' || text === '' || page === '' || category === 'Please select one' || module === 'Please select one'){
            setErrorMessage('all fields must be filled')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        } else {

            try {
                await createTicketService.updateTicket({
                    title, text, module, category, page, editor, status
                }, params.ticketId)

                setErrorMessage('ticket updated')
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)

            } catch (exception) {
                setErrorMessage('internal Error')
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            }
        }
    }

    const handleAttachmentUpload = async (event) => {
        event.preventDefault()

        if(image === ''){
            setErrorMessageAttachment('all fields must be filled')
            setTimeout(() => {
                setErrorMessageAttachment(null)
            }, 5000)
        } else {
            try {

                let imageUrl = "";
                if (image) {
                    const formData = new FormData()
                    formData.append("file", image)
                    formData.append("upload_preset", 's2Yspkm7dvbBxu')
                    const dataRes = await axios.post("https://api.cloudinary.com/v1_1/dcvhvqtzw/image/upload", formData)
                    imageUrl = dataRes.data.url
                }

                await createTicketService.updateAttachment({imageUrl}, params.ticketId)

                setErrorMessageAttachment('attachment uploaded')
                setTimeout(() => {
                    setErrorMessageAttachment(null)
                }, 5000)

                fetchAttachment()

            } catch (exception) {
                setErrorMessageAttachment('internal Error')
                setTimeout(() => {
                    setErrorMessageAttachment(null)
                }, 5000)
            }
        }
    }

    const handleCreateComment = async (event) => {
        event.preventDefault()

        if(newComment === ''){
            setErrorMessageComment('all fields must be filled')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        } else {
            try {

                await createTicketService.createComment(newComment, params.ticketId)

                setErrorMessageComment('comment uploaded')
                setTimeout(() => {
                    setErrorMessageComment(null)
                }, 5000)

                fetchComment()
                setNewComment('')

            } catch (exception) {
                setErrorMessageComment('internal Error')
                setTimeout(() => {
                    setErrorMessageComment(null)
                }, 5000)
            }
        }
    }


    if(!JSON.parse(localStorage.getItem("loggedUser"))){
        return <Navigate replace to="/login" />
    } else {
        return (
            <div className='ticketDetail'>
                <Navbar />
                    <div className='ticketDetailContainer'>
                            <form className='ticketDetailForm' onSubmit={handleUpdateTicket}>
                                <Notification message={errorMessage} />

                                <div className='ticketDetailTitleCategory'>
                                    <div className='ticketDetailTitle'>
                                        Title
                                        <input
                                            className= 'ticketDetailTitleInput'
                                            type="text"
                                            value={title}
                                            name="Title"
                                            disabled={disabled}
                                            onChange={({ target }) => setTitle(target.value)}
                                        />
                                    </div>

                                    <div className='ticketDetailCategory'>
                                        Category
                                        <select
                                            onChange={({ target }) => setCategory(target.value)}
                                            className= 'ticketDetailCategoryInput'
                                            type="text"
                                            value={category}
                                            name="Category"
                                            disabled={disabled}
                                        >
                                            {arrCategory.map((option, index) => (
                                                <option key={index*87} value={option.value}>
                                                    {option.text}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                <div className='ticketDetailTextPage'>
                                    <div className='ticketDetailText'>
                                        Text
                                        <textarea
                                            className='ticketDetailTextInput'
                                            type="textarea"
                                            value={text}
                                            name="Text"
                                            disabled={disabled}
                                            onChange={({ target }) => setText(target.value)}
                                        />
                                    </div>

                                    <div className='ticketDetailPageModule'>
                                        <div className='ticketDetailPage'>
                                            Page
                                            <input
                                                className='ticketDetailPageInput'
                                                type="number"
                                                min='0'
                                                value={page}
                                                name="Page"
                                                disabled={disabled}
                                                onChange={({ target }) => setPage(target.value)}
                                            />
                                        </div>

                                        <div className='ticketDetailModule'>
                                            Module
                                            <select
                                                className= 'ticketDetailModuleInput'
                                                type="text"
                                                value={module}
                                                name="Module"
                                                disabled={disabled}
                                                onChange={({ target }) => setModule(target.value)}
                                            >
                                                {arrModule.map((option, index) => (
                                                    <option key={index*24} value={option.value}>
                                                        {option.text}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='ticketDetailModule'>
                                            Status
                                            <select
                                                className= 'ticketDetailModuleInput'
                                                type="text"
                                                value={status}
                                                name="Status"
                                                disabled={disabled}
                                                onChange={({ target }) => setStatus(target.value)}
                                            >
                                                <option value='added'>added</option>
                                                <option value='in progress'>in progress</option>
                                                <option value='closed'>closed</option>
                                            </select>
                                        </div>

                                        <div className='ticketDetailModule'>
                                            Editor
                                            <input
                                                className= 'ticketDetailModuleInput'
                                                type="text"
                                                value={editor}
                                                name="Title"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button className='createTicketButton' type="submit" style={{ display: disabled ? "none" : "block" }}>Update Ticket</button>

                                <div className='ticketDetailModule' style={{ display: disabled ? "none" : "flex" }}>
                                    Change Editor
                                    <select
                                        className= 'ticketEditorModule'
                                        type="text"
                                        value={editorChange}
                                        name="Editor"
                                        disabled={disabled}
                                        onChange={({ target }) => setEditor(target.value)}
                                    >
                                        <option value='please choose'>please choose</option>
                                        {arrEditor.map((option, index) => (
                                            <option key={index*92} value={option.email}>
                                                {option.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </form>



                        <form className='attachmentContainerForm' onSubmit={handleAttachmentUpload}>
                            <Notification message={errorMessageAttachment} />
                            <div className='attachmentsView'>
                                Attachments
                                <div className='attachmentsList'>
                                    {arrAttachments.map((link, index) => (
                                        <a key= {index*index*2} target="_blank" href={link}>Attachment {index+1}</a>
                                    ))}
                                </div>
                                <div className='createTicketUpload'>
                                    new attachment
                                    <input
                                        className='createTicketUploadInput'
                                        type="file"
                                        name="Attachment"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>
                                <button className='attachmentUploadButton' type="submit">Upload attachment</button>
                            </div>
                        </form>

                        <div className='commentsContainer'>
                            {arrComments.map((comment, index) => (
                                <div className='commentsView'>
                                    <p key={index*index}>{comment.email} at <Moment format="DD.MM.YYYY HH.mm">{comment.commentDate}</Moment></p>
                                    <p key={index*index*index}>{comment.comment}</p>
                                </div>
                            ))}

                            <div className='newComment'>
                                <Notification message={errorMessageComment} />
                                <form className='newCommentForm' onSubmit={handleCreateComment}>
                                        <textarea
                                            type="text"
                                            className='newCommentInput'
                                            value={newComment}
                                            name="newComment"
                                            onChange={({ target }) => setNewComment(target.value)}
                                        />
                                    <button className='createCommentButton' type="submit">Create Comment</button>
                                </form>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default TicketDetail
import React, { useState, useRef, useEffect } from 'react'
import './modal.css'



const Modal = (props) => {
    const [showModal, setShowModal] = useState(false)
    const [category, setCategory] = useState('')

    const description = useRef(null)
    const amount = useRef(null)

    const modalHandler = () => { // toggles the modal
        setShowModal(!showModal)
    }

    const formSubmitHandler = (e) => {  // submits expense to firestore
        const expenseForm = document.getElementById('expense-form')
        props.submitExpenseFuncs(category, description.current.value, amount.current.value)
        modalHandler()

        expenseForm.reset()
        e.preventDefault()
    }

    const handleChange = (e) => { // handles the change category
        setCategory(e.target.value)
    }

    console.log(props);

    const modalMain = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalMain.current && !modalMain.current.contains(event.target)) {
                setShowModal(false)
                console.log(`outside`);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.showPopup])



    return (
        <div> <button className='btn primary modal-add-btn   ' onClick={modalHandler}>+ Add</button>
            <div  className={`modal ${showModal ? 'display-block' : 'display-none'}`} >
                <section ref={modalMain} className="modal-main">
                    <div>
                        <form className='add-transaction-form' onSubmit={formSubmitHandler} id='expense-form'>
                            <label htmlFor="description">Description </label>
                            <input ref={description} type="text" id='description' placeholder='Enter Description' />

                            <label htmlFor="category">Category </label>
                            <select name="category" id="category" onChange={handleChange}>
                                <option key={`g`} >Please Select Category</option>
                                {props.userObj.categories && props.userObj.categories.map((category, index) => {

                                    return <option key={`g${index}`} value={category}>{category}</option>

                                })}
                            </select>
                            <label htmlFor="amount">Amount </label>
                            <input ref={amount} type="number" id='amount' placeholder='Enter Amount' />

                            <button className='transaction-submit-btn btn primary'>Add</button>
                        </form>
                    </div>
                    <button onClick={modalHandler} className='close-btn' >
                        X
                    </button>
                </section>
            </div>

        </div>
    )
}

export default Modal;
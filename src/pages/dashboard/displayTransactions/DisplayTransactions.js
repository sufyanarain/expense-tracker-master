import React from 'react'
import moment from 'moment';
import { BsTrash } from "react-icons/bs";

const DisplayTransactions = (props) => {
    
    

    return (
        <div className='display-transaction-div'>
            <table className='transaction-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.userObj.expenses && props.userObj.expenses.map((transaction, index) => {
                            console.log(transaction);
                            return (
                                <tr className='transaction-tr' key={index}>
                                    <td className='td td-id'>{transaction.id}</td>
                                    <td className='td td-description'>{transaction.description}</td>
                                    <td className='td td-category'>{transaction.category}</td>
                                    <td className='td td-amount'>{transaction.amount} <span>Rs</span></td>
                                    <td className='td td-date'>{moment(transaction.createdAt.toDate()).format('YYYY-MM-DD HH:mm')}</td>
                                    <td onClick={() => props.expenseOptionHandler(transaction,index)} className='expense-delete'><BsTrash/></td>
                                    
                                </tr>
                            )
                        })
                    }
                </tbody>



            </table>

        </div>
    )
}

export default DisplayTransactions
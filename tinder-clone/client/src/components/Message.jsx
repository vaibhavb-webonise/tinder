import React from 'react'

function Message({ message }) {
    console.log('okokokokok ', message)

    const getExactTime = (date) => {
        const timeString = date.toString().split('T')[1].split('+')[0]
        return timeString
    }

    const getExactDate = (dateStamp) => {
        const dateObj = new Date(dateStamp).toString().split(' ');
        const [day, month, dateString, year, time] = dateObj
        console.log('jijijiji ',dateObj);
        const date = `${dateString} ${month}  ${time}`
        return date
    }
    return (
        <>
            <div className="message">
                <div className="avatar_wrapper_message">
                    <img className="user-avatar" src={message?.avatar} />
                </div>
                <div className="message-text">
                    {message?.message}
                    <div className="message-timeline">{getExactDate(message?.timestamp)}</div>
                </div>

            </div>
        </>
    )
}

export default Message

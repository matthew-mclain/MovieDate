// ManageDateModal.js
import React from 'react';
import AddDateModal from './AddDateModal';

function ManageDateModal({ show, onHide, movieId, date_obj, following }) {
    let dateId = '';
    let initialDate = '';
    let initialTime = '';
    let initialTheater = '';
    let initialInvitedUsers = [];

    if (date_obj) {
        dateId = date_obj.date_id;
        initialDate = date_obj.date;
        initialTime = date_obj.time;
        initialTheater = date_obj.theater;
        initialInvitedUsers = date_obj.invited_users;
    }

    return (
        <AddDateModal
            show={show}
            onHide={onHide}
            dateId = {dateId}
            movieId={movieId} 
            title="Manage Date"
            userButtonTitle="Manage Users"
            submitButtonTitle="Update"
            dateValue={initialDate} 
            timeValue={initialTime} 
            theaterValue={initialTheater} 
            invitedUsersValue={initialInvitedUsers} 
            following={following} 
        />
    );
}

export default ManageDateModal;
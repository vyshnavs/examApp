import React from 'react';
import UserProfile from '../../components/userpage/UserProfile';
import UserExams from '../../components/userpage/userExams';
const UserPage = () => {
    return (
        <div>
        <UserProfile/>
        <UserExams/>
            
            {/* Additional user-specific content can be added here */}
        </div>
    );
};

export default UserPage;
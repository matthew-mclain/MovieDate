import React from 'react';

function SignUp() {
    return (
        <div>
        <h1>Sign Up</h1>
        <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
            <button type="submit">Sign Up</button>
        </form>
        </div>
    );
}

export default SignUp;
import React from 'react';

function SignIn() {
    return (
        <div>
        <h1>Sign In</h1>
        <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
            <button type="submit">Sign In</button>
        </form>
        </div>
    );
}

export default SignIn;
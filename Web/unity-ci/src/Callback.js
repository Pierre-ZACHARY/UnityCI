// Callback.js
import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios, {post} from 'axios';
import {Octokit} from 'octokit';
import {createOAuthUserAuth} from '@octokit/auth-oauth-user';

const Callback = () => {
    const navigate = useNavigate();
    const clientId = '5ff277c3ed80e122d347'; // Replace with the Client ID from your GitHub OAuth App
    const clientSecret = '90a0181c49f2449ec65fc6ed5cd831d5fef82fd4'; // Replace with the Client ID from your GitHub OAuth App


    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        async function getToken() {
            fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code
                })
            }).then(res => console.log(res))
        }
        getToken();
    }, [clientId, navigate]);

    return (
        <div>
            Logging in...
        </div>
    );
};

export default Callback;

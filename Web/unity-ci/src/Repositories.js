// Repositories.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Repositories = () => {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        const accessToken = localStorage.getItem('githubAccessToken');

        if (accessToken) {
            // Use the access token to fetch the user's repositories
            axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `token ${accessToken}`,
                },
            }).then(response => {
                setRepositories(response.data);
            }).catch(error => {
                console.error('Error fetching repositories from GitHub:', error);
            });
        }
    }, []);

    return (
        <div>
            <h2>Your GitHub Repositories:</h2>
            <ul>
                {repositories.map(repo => (
                    <li key={repo.id}>{repo.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Repositories;

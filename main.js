const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

// Feaching GitHub users API
async function getUserDetails(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        // Check if the response indicates API rate limit exceeded
        if (response.status === 403 && data.message.includes("API rate limit exceeded")) {
            console.error('API rate limit exceeded. Please check your rate limit.');
            // Show a user-friendly message
            main.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    API rate limit exceeded. Please check your rate limit.
                    <a href="${data.documentation_url}" target="_blank">Learn more</a>
                </div>
            `;
            return;
        }
        // If it's not a rate limit error, create the user card
        createUserCard(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

const createUserCard = (user) => {
    const parentCardElement = document.createElement('div');
    parentCardElement.classList.add('card', 'col-md-3', 'm-2');
    parentCardElement.innerHTML = `
        <a href="https://github.com/${user.login}" target="_blank"><img class="card-img-round" src="${user.avatar_url}" alt="${user.login}"></a>
        <div class="card-body">
            <h1 class="card-title">${user.name || user.login}</h1>
            <p class="card-text">${user.bio || 'No bio available'}</p>
            <div class="card-detail d-flex align-items-center justify-content-between">
                <p> <span class="text">Followers: </span> <span>${user.followers}</span></p>
                <p> <span class="text">Following: </span> <span>${user.following}</span></p>
                <p> <span class="text">Repo: </span> <span>${user.public_repos}</span></p>
            </div>
            <div class="card-detail d-flex align-items-center justify-content-between">
                <p> <span class="text">Twitter: </span> <span>${user.twitter_username || 'Not available'}</span></p>
                <p> <span class="text">Location: </span> <span>${user.location || 'Not available'}</span></p>
            </div>
        </div>`;
    main.innerHTML = '';
    main.appendChild(parentCardElement);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = search.value.trim();
    if (username) {
        getUserDetails(username);
    }
});
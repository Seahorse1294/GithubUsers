const APIURL = 'https://api.github.com/users/'

const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')


async function getUsers(username){
    try{

        const user = await axios.get(APIURL + username)
        

        console.log(user.data)
        
        createUserCard(user.data)
        getRepos(username)

    } catch(err) {
        if(err.response.status == 404){
            createErrorCard('User not found!')
        }
    }
}

async function getRepos(username){
    try{
        const {data} = await axios.get(APIURL + username + '/repos?sort=created')
        addRepos(data)

    }catch(err) {
        if(err){
            createErrorCard('Problem fetching repos.')
        }
    }
}

function createUserCard(user){
    const cardHTML = `
    <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio}</p>
                <ul>
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repositories</strong></li>
                </ul>
            </div>
        </div>
    `
    main.innerHTML = cardHTML
}

function addRepos(repos){
    const reposEl = document.getElementById('repos')
    repos
        .slice(0,5)
        .forEach(repo => {
        const repoEl = document.createElement('a')
        repoEl.classList.add('repo')
        repoEl.href = repo.html_url
        repoEl.target = '_blank'
        repoEl.innerText = repo.name

        reposEl.appendChild(repoEl)
    })
}

function createErrorCard(message){
    const cardHTML = `
    <div class="card">
            <div>
                <h1>${message}</h1>
            </div>
        </div>
    `
    main.innerHTML = cardHTML
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const user = search.value

    if(user){
        getUsers(user)
        getRepos(user)
        search.value = ''
    }
})
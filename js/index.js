document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(data => createLibrary(data))

    fetch('http://localhost:3000/users')
    .then(resp => resp.json())
    .then(data => createUserList(data))
});

let library = []
let users = []
let liked = false

function createLibrary(data) {
    data.forEach(function(book) {
        library.push(book)
        putTheBookOnTheShelf(book)
    })
}

function createUserList(data) {
    users.push(data)
}


function putTheBookOnTheShelf(book) {
    let bookAuthor = book['author']
    let bookId = book['id']
    let bookImg = book['img_url']
    let bookSubtitle = book['subtitle']
    let bookTitle = book['title']
    let bookDescription = book['description']
    let bookUsersInfo = book['users']
    let usersForThisBook = []
    bookUsersInfo.forEach(book => usersForThisBook.push(book['username']))
    
    let ulList = document.querySelector('ul#list')
    let showOffPanel = document.querySelector('div#show-panel')

    let li = document.createElement('li')
    li.innerText = bookTitle
    li.id = bookId
    
    li.addEventListener('click', showOffBook)
    function showOffBook() {
        //clear
        showOffPanel.innerText = ''
        //image
        let img = document.createElement('img')
        img.src = bookImg
        showOffPanel.appendChild(img)
        //title
        let h3t = document.createElement('h3')
        h3t.innerText = bookTitle
        showOffPanel.appendChild(h3t)
        //subtitle
        let h3s = document.createElement('h3')
        h3s.innerText = bookSubtitle
        showOffPanel.appendChild(h3s)
        //author
        let h3a = document.createElement('h3')
        h3a.innerText = bookAuthor
        showOffPanel.appendChild(h3a)
        //description
        let h5 = document.createElement('h5')
        h5.innerText = bookDescription
        showOffPanel.appendChild(h5)
        //usernames
        usersForThisBook.forEach(function(user) {
            let li = document.createElement('li')
            li.innerText = user
            showOffPanel.appendChild(li)
        })
        //added break space
        showOffPanel.appendChild(document.createElement('br'))
        //like button
        let button = document.createElement('button')
        button.innerText = 'Like'
        button.addEventListener('click', doOneLike)
        function doOneLike() {
            if (!liked){    
                let currentUser = users[0][0]      
                bookUsersInfo.push(currentUser) 
                fetch(`http://localhost:3000/books/${bookId}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        users: bookUsersInfo
                    })
                })
                //this is inside the like button, I am trying to have the page NOT refresh
                //but the new user Likes have not been updated
                //add a new function that goes into the library?
                location.reload()
                changeTheButtonText()
                liked = true
                setTimeout(showOffBook(library[bookId - 1]), 2000)
            } else {
                   
                bookUsersInfo.pop()
                fetch(`http://localhost:3000/books/${bookId}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        users: bookUsersInfo
                    })
                })
                location.reload()
                changeTheButtonText()
                liked = false
                setTimeout(showOffBook(library[bookId - 1]), 2000)
            }
        }
        function changeTheButtonText() {
            let newBtn = document.querySelector('button')
            if(!liked) {
                newBtn.innerText = 'Unlike'
            } else {
                newBtn.innerText = 'Like'
            }

        }
        showOffPanel.appendChild(button)
    }
    ulList.appendChild(li)
}


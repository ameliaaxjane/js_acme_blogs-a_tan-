//function 1 
function createElemWithText(tagName = "p", textContent = "", className = "") {
    const element = document.createElement(tagName);
    element.textContent = textContent;
    if (className) element.className = className;
    return element;
}
//function 2
function createSelectOptions(users) {
    if (!users) return undefined;  
    return users.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

//function 3 
function toggleCommentSection(postId) {
    if (!postId) return undefined; 
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) return null; 
    section.classList.toggle('hide'); 
    return section; 
}
//function 4
function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (button) {
        button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    }
    return button;
}
//function 5
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}
//function 6
function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener("click", event => toggleComments(event, postId));
        }
    });
    return buttons;
}
//function 7
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener("click", event => toggleComments(event, postId));
        }
    });
    return buttons;
}
//function 8
function createComments(comments) {
    if (!comments) return undefined; 

    const fragment = document.createDocumentFragment(); 

    comments.forEach((comment) => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const bodyParagraph = createElemWithText('p', comment.body);
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

        article.appendChild(h3);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);

        fragment.appendChild(article);
    });

    return fragment;
}
//function 9
function populateSelectMenu(users) {
    if (!users) return undefined;
    const selectMenu = document.getElementById("selectMenu");
    if (!selectMenu) return null;
    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.append(option));
    return selectMenu;
}
//function 10
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
//function 11
async function getUserPosts(userId) {
    if (!userId) return undefined; 
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = await response.json();
        console.log(`Fetched posts for userId ${userId}:`, posts);
        return posts;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }
}

//function 12
async function getUser(userId) {
    if (!userId) return undefined;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return await response.json();
}
//function 13
async function getPostComments(postId) {
    if (!postId) return undefined;
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    return await response.json();
}
//function 14
async function displayComments(postId) {
    if (!postId) return undefined;

    const comments = await getPostComments(postId);

    const section = document.createElement('section');
    section.classList.add('comments', 'hide');
    section.dataset.postId = postId;

    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = document.createElement('h3');
        const body = document.createElement('p');
        const email = document.createElement('p');

        h3.textContent = comment.name;
        body.textContent = comment.body;
        email.textContent = `From: ${comment.email}`;

        article.appendChild(h3);
        article.appendChild(body);
        article.appendChild(email);
        section.appendChild(article);
    });

    return section;
}
//function 15
async function createPosts(posts) {
    if (!posts || posts.length === 0) {
        return undefined;
    }

    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement('article');

        const h2 = document.createElement('h2');
        h2.textContent = post.title;
        article.appendChild(h2);

        const bodyParagraph = document.createElement('p');
        bodyParagraph.textContent = post.body;
        article.appendChild(bodyParagraph);

        const postIdParagraph = document.createElement('p');
        postIdParagraph.textContent = `Post ID: ${post.id}`;
        article.appendChild(postIdParagraph);

        const author = await getUser(post.userId);

        const authorParagraph = document.createElement('p');
        authorParagraph.textContent = `Author: ${author.name} with ${author.company.name}`;
        article.appendChild(authorParagraph);

        const companyCatchPhraseParagraph = document.createElement('p');
        companyCatchPhraseParagraph.textContent = author.company.catchPhrase; 
        article.appendChild(companyCatchPhraseParagraph);

        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;
        article.appendChild(button);

        const section = await displayComments(post.id);
        article.appendChild(section);

        fragment.appendChild(article);
    }

    return fragment;
}
//function 16
async function displayPosts(posts) {
    const mainElement = document.querySelector('main');
    if (!mainElement) {
        console.error('No <main> element found.');
        return;
    }

    const element = posts && posts.length > 0 
        ? await createPosts(posts) 
        : createElemWithText('p', 'Select an Employee to display their posts.', 'default-text'); 
    
    mainElement.appendChild(element); 
    return element; 
}
//function 17
function toggleComments(event, postId) {
    if (!event || !postId) return undefined;  
    
    event.target.listener = true; 
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    
    return [section, button];
}
//function 18
async function refreshPosts(data){
      if(!data) return;
    
        let mainElement = document.querySelector("main");
        let removedButtons = removeButtonListeners();
        mainElement = deleteChildElements(mainElement);
        let displayedPosts = await displayPosts(data)
        let addedButtons = addButtonListeners();
        return [removedButtons, mainElement, displayedPosts, addedButtons];
     
    }
 //function 19   
 async function selectMenuChangeEventHandler(event) {
    if (event?.type !== "change") {
        return;
    }

    let userId = event.target?.value;
    if (userId === "Employees" || userId === undefined) {
        userId = 1;
    }

    let selectMenu = event.target;
    if (selectMenu !== undefined) {
        selectMenu.disabled = true;
    }

    try {
        let posts = await getUserPosts(userId);
        let refreshPostsArray = await refreshPosts(posts);

        if (selectMenu !== undefined) {
            selectMenu.disabled = false;
        }

        return [userId, posts, refreshPostsArray];
    } catch (error) {
        console.error("Error in selectMenuChangeEventHandler:", error);
        
        if (selectMenu !== undefined) {
            selectMenu.disabled = false;
        }

        return undefined;
    }
}


//function 20
async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}
//function 21
function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);


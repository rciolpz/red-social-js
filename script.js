let lastScrollTop = 0;
const logo = document.querySelector(".logo");

window.addEventListener("scroll", function () {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        logo.classList.add("hidden");
    } else {
        logo.classList.remove("hidden");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

const urlBase = "https://jsonplaceholder.typicode.com/posts";
let posts = [];

function getData() {
    fetch(urlBase)
        .then((res) => res.json())
        .then((data) => {
            posts = data;
            renderPostList();
        })
        .catch((error) => console.error("error al llamar a la API", error));
}
getData();
function renderPostList() {
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    posts.forEach((post) => {
        const listItem = document.createElement("li");
        listItem.classList.add("postItem");
        listItem.innerHTML = `
        <strong class="titlePost">${post.title}</strong>
        <p>${post.body}</p>

        <button onclick="editPost(${post.id})">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">

        <label for="editTitle">Title: </label>
        <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
        
        <label for="editForm"> Comment: </label>
        <textarea id="editBody-${post.id}" required>${post.body}</textarea>

        <button onclick="updatePost(${post.id})">Update</button>

        </div>
        `;
        postList.appendChild(listItem);
    });
}

function postData() {
    const postTitleInput = document.getElementById("postTitle");
    const postBodyInput = document.getElementById("postBody");
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() === "" || postBody.trim() === "") {
        alert("Fields are Required");
        return;
    }
    fetch(urlBase, {
        method: "POST",
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            posts.unshift(data);
            renderPostList();
            postTitleInput.value = "";
            postBodyInput.value = "";
        })
        .catch((error) =>
            console.error("error al querer crear posteo: ", error)
        );
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display =
        editForm.style.display == "none" ? "block" : "none";
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            const index = posts.findIndex((post) => post.id === data.id);
            if (index != -1) {
                posts[index] = data;
            } else {
                alert("Error Updating the Post");
            }
            renderPostList();
        })
        .catch((error) =>
            console.error("error al querer actualizar un post: ", error)
        );
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: "DELETE",
    })
        .then((res) => {
            if (res.ok) {
                posts = posts.filter((post) => post.id != id);
                renderPostList();
            } else {
                alert("Error Deleting THE Post");
            }
        })
        .catch((error) => console.error("Hubo un error", error));
}

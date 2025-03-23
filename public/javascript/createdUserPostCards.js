async function createUserPostCard(userPosts) {
    const fragment = document.createDocumentFragment(); // reflow

    userPosts.forEach((post) => {
        // <article>
        const article = document.createElement("article");

        // <figure> and <img>
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = "https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg";
        img.alt = "X Post Logo";
        figure.appendChild(img);

        // div
        const bodyDiv = document.createElement("div");
        bodyDiv.classList.add("x-post-body");

        // <h2> 
        const title = document.createElement("h2");
        title.textContent = post.user_name;

        // <p> 
        const content = document.createElement("p");
        content.textContent = post.post_text;

        // <a>
        const readMore = document.createElement("a");
        readMore.href = `/api/user/insertpost`;
        readMore.classList.add("x-post-read-more");
        readMore.innerHTML = `${formatThaiDate(post.post_created_at)}<br>Add Post`;
        readMore.target = "_blank";  
        readMore.rel = "noopener noreferrer";

        // SVG
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("class", "x-post-icon");
        svgIcon.setAttribute("viewBox", "0 0 20 20");
        svgIcon.setAttribute("fill", "currentColor");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill-rule", "evenodd");
        path.setAttribute("d", "M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z");
        path.setAttribute("clip-rule", "evenodd");

        svgIcon.appendChild(path);
        readMore.appendChild(svgIcon);

        // Build structure
        bodyDiv.append(title, content, readMore);
        article.append(figure, bodyDiv);
        fragment.appendChild(article);
    });

    return fragment;
}

// Format date to Thai format
function formatThaiDate(isoString) {
    const monthsThai = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    
    const date = new Date(isoString);
    const day = date.getUTCDate();
    const month = monthsThai[date.getUTCMonth()];
    
    return `${day} ${month}`;
}

async function initUserPosts(userPosts) {
    const xpostContainer = document.querySelector(".x-post-articles");
    xpostContainer.innerHTML = ""; // Clear existing posts
    const postCards = await createUserPostCard(userPosts);
    xpostContainer.appendChild(postCards);
}

export { initUserPosts };

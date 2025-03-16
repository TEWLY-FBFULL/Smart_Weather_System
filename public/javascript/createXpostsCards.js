async function createXpostsCard(xpostData) {
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
    title.textContent = xpostData.tweet_username;

    // <p> 
    const content = document.createElement("p");
    content.textContent = xpostData.tweet;

    // Check if the tweet_id is missing
    if (!xpostData.tweet_id) {
        console.warn(`tweet_id หายไปสำหรับ ${xpostData.tweet_username}`);
        return null;
    }

    // <a>
    const readMore = document.createElement("a");
    readMore.href = `https://x.com/${xpostData.tweet_username}/status/${xpostData.tweet_id}`;
    readMore.classList.add("x-post-read-more");
    readMore.textContent = "Read more";
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

    // <path> to <svg>
    svgIcon.appendChild(path);
    readMore.appendChild(svgIcon);

    // div
    bodyDiv.appendChild(title);
    bodyDiv.appendChild(content);
    bodyDiv.appendChild(readMore);

    // All child to <article>
    article.appendChild(figure);
    article.appendChild(bodyDiv);

    return article;
}

// Check the screen size and return the number of posts to display
function getVisiblePosts(xPosts) {
    const width = window.innerWidth;

    if (width > 768) return xPosts; // Show all posts
    if (width > 500) return xPosts.slice(0, 4); // Show 4 posts
    if (width > 320) return xPosts.slice(0, 3); // Show 3 posts
    return xPosts.slice(0, 2); // Show 2 posts
}

// Add posts to the page
async function displayXPosts(xPosts) {
    const container = document.querySelector(".x-post-articles");

    if (!container) {
        console.warn("Container .x-post-articles ไม่พบ!");
        return;
    }

    container.innerHTML = ""; // Clear the container

    const visiblePosts = getVisiblePosts(xPosts);

    for (const post of visiblePosts) {
        const postElement = await createXpostsCard(post);
        container.appendChild(postElement);
    }
}

// Debounce function
function debounce(func, delay = 200) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Create Xposts cards
async function initXPosts(xPosts) {
    displayXPosts(xPosts);
    window.addEventListener("resize", debounce(() => displayXPosts(xPosts), 300));
}

export { initXPosts };


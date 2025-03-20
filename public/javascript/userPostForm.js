document.addEventListener("DOMContentLoaded", async () => {
    setupSearch("postSearchInput", "postSuggestionsdiv", "postSuggestions");

    function setupSearch(inputId, suggestionDivId, suggestionListId) {
        const searchInput = document.getElementById(inputId);
        const suggestionsdiv = document.getElementById(suggestionDivId);
        const suggestionsList = document.getElementById(suggestionListId);
        let selectedCity = "กรุงเทพมหานคร"; 

        searchInput.value = selectedCity;

        searchInput.addEventListener("input", async function () {
            const query = this.value.trim();
            if (query.length === 0) {
                suggestionsList.innerHTML = "";
                suggestionsdiv.style.display = "none";
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/api/user/search?q=${query}`);
                const cities = await response.json();
                renderSuggestions(cities, suggestionsList, searchInput, suggestionsdiv);
            } catch (error) {
                console.error("เกิดข้อผิดพลาด:", error);
                suggestionsdiv.style.display = "none";
            }
        });

        function renderSuggestions(cities, list, input, div) {
            list.innerHTML = "";
            cities.forEach(city => {
                const li = document.createElement("li");
                li.textContent = city;
                li.addEventListener("click", () => {
                    input.value = city;
                    selectedCity = city;
                    list.innerHTML = "";
                    div.style.display = "none";
                });
                list.appendChild(li);
            });
            div.style.display = cities.length > 0 ? "block" : "none";
        }

        document.addEventListener("click", (event) => {
            if (!suggestionsdiv.contains(event.target) && event.target !== searchInput) {
                suggestionsdiv.style.display = "none";
            }
        });

        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                selectedCity = searchInput.value.trim() || "กรุงเทพมหานคร";
                suggestionsdiv.style.display = "none";
            }
        });
    }
});

// Form Submission
document.getElementById("userPostsForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = document.getElementById("postSearchInput").value.trim();
    const postText = document.getElementById("postText").value.trim();

    if (!city || !postText) {
        Swal.fire("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/user/postWeather", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city, message: postText }),
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire("สำเร็จ!", result.message, "success");
            document.getElementById("userPostsForm").reset();
            document.getElementById("postSearchInput").value = "กรุงเทพมหานคร";
        } else {
            Swal.fire("เกิดข้อผิดพลาด", result.error, "error");
        }
    } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งโพสต์ได้", "error");
    }
});


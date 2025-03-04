// Login Form
const passwordField = document.getElementById('login-password');
const togglePasswordIcon = document.getElementById('login-toggle-password');

togglePasswordIcon.addEventListener('click', function () {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        togglePasswordIcon.classList.remove('fa-eye-slash');
        togglePasswordIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        togglePasswordIcon.classList.remove('fa-eye');
        togglePasswordIcon.classList.add('fa-eye-slash');
    }
});
// Login Form

// Register Form
const registerPasswordField = document.getElementById('register-password');
const registerTogglePasswordIcon = document.getElementById('register-toggle-password');
const registerConfirmPasswordField = document.getElementById('register-confirm-password');
const registerConfirmTogglePasswordIcon = document.getElementById('register-toggle-confirm-password');

registerTogglePasswordIcon.addEventListener('click', function () {
    if (registerPasswordField.type === 'password') {
        registerPasswordField.type = 'text';
        registerTogglePasswordIcon.classList.remove('fa-eye-slash');
        registerTogglePasswordIcon.classList.add('fa-eye');
    } else {
        registerPasswordField.type = 'password';
        registerTogglePasswordIcon.classList.remove('fa-eye');
        registerTogglePasswordIcon.classList.add('fa-eye-slash');
    }
});

registerConfirmTogglePasswordIcon.addEventListener('click', function () {
    if (registerConfirmPasswordField.type === 'password') {
        registerConfirmPasswordField.type = 'text';
        registerConfirmTogglePasswordIcon.classList.remove('fa-eye-slash');
        registerConfirmTogglePasswordIcon.classList.add('fa-eye');
    } else {
        registerConfirmPasswordField.type = 'password';
        registerConfirmTogglePasswordIcon.classList.remove('fa-eye');
        registerConfirmTogglePasswordIcon.classList.add('fa-eye-slash');
    }
});
// Register Form

// Position to Animation
document.getElementById("scroll-link").addEventListener("click", function (e) {
  e.preventDefault();
  const targetId = e.currentTarget.getAttribute("href").substring(1); 
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top; 
      const offsetPosition = elementPosition + window.pageYOffset - 180; // set position to scroll
      window.scrollTo({
          top: offsetPosition,
          behavior: "smooth", 
      });
  }
});

document.getElementById("login-goto-reg").addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").substring(1); 
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top; 
        const offsetPosition = elementPosition + window.pageYOffset - 180; // set position to scroll
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth", 
        });
    }
});

document.getElementById("login-goto-forgot").addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").substring(1); 
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top; 
        const offsetPosition = elementPosition + window.pageYOffset - 180; // set position to scroll
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth", 
        });
    }
});

document.getElementById("reg-goto-login").addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").substring(1); 
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top; 
        const offsetPosition = elementPosition + window.pageYOffset - 80; // set position to scroll
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth", 
        });
    }
});

document.getElementById("forgot-goto-login").addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").substring(1); 
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top; 
        const offsetPosition = elementPosition + window.pageYOffset - 80; // set position to scroll
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth", 
        });
    }
});

document.getElementById("forgot-goto-reg").addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").substring(1); 
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top; 
        const offsetPosition = elementPosition + window.pageYOffset - 80; // set position to scroll
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth", 
        });
    }
});

const canvas = document.getElementById("snowCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let snowflakes = [];

        function createSnowflakes() {
            for (let i = 0; i < 100; i++) {
                snowflakes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * 2 + 1,
                    opacity: Math.random()
                });
            }
        }

        function drawSnowflakes() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffa99c";
            ctx.beginPath();

            for (let flake of snowflakes) {
                ctx.globalAlpha = flake.opacity;
                ctx.moveTo(flake.x, flake.y);
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            }

            ctx.fill();
            moveSnowflakes();
        }

        function moveSnowflakes() {
            for (let flake of snowflakes) {
                flake.y += flake.speed;
                if (flake.y > canvas.height) {
                    flake.y = 0;
                    flake.x = Math.random() * canvas.width;
                }
            }
        }

        function updateSnowfall() {
            drawSnowflakes();
            requestAnimationFrame(updateSnowfall);
        }

        createSnowflakes();
        updateSnowfall();

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            snowflakes = [];
            createSnowflakes();
        });


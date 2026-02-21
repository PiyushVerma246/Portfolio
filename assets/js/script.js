$(document).ready(function () {
    // Boot sequence handler
    const bootLoader = $('.boot-loader');
    const outputs = $('.terminal-body p');

    // Check if this is first visit
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
    if (hasSeenLoader) {
        bootLoader.hide();
    } else {
        // Add completion status to each output line
        function updateOutputStatus(index) {
            const statusTexts = ['OK', 'DONE', 'OK', 'RECEIVED', 'SUCCESS', 'Piyush Verma', ''];
            if (index < outputs.length - 1) {
                setTimeout(() => {
                    $(outputs[index]).append(` ${statusTexts[index]}`);
                }, (index + 1) * 500 + 1000);
            }
        }

        // Initialize boot sequence
        outputs.each((index, element) => {
            updateOutputStatus(index);
        });

        // Hide boot loader after sequence completion
        setTimeout(() => {
            bootLoader.fadeOut(1000);
            // Mark that user has seen the loader
            sessionStorage.setItem('hasSeenLoader', 'true');
        }, 5000);
    }

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        // $('section').each(function () {
        //     let height = $(this).height();
        //     let offset = $(this).offset().top - 200;
        //     let top = $(window).scrollTop();
        //     let id = $(this).attr('id');

        //     if (top > offset && top < offset + height) {
        //         $('.navbar ul li a').removeClass('active');
        //         $('.navbar').find(`[href="#${id}"]`).addClass('active');
        //     }
        // });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear');

        // Close menu on link click if it's open
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');
    });

    // FormSubmit.co handles the form submission natively via HTML action.
    // We intercept it to use AJAX for a better UX (no redirect).
    $("#contact-form").submit(function (event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        // Show loading state if desired (optional)
        const submitBtn = $(form).find('button[type="submit"]');
        const originalBtnText = submitBtn.html();
        submitBtn.html('Sending... <i class="fa fa-spinner fa-spin"></i>').prop('disabled', true);

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert("Thank you! Your message has been sent successfully.");
                form.reset();
            } else {
                alert("Oops! There was a problem submitting your form. Please try again.");
            }
        }).catch(error => {
            alert("Oops! There was a problem submitting your form. Please try again.");
        }).finally(() => {
            submitBtn.html(originalBtnText).prop('disabled', false);
        });
    });

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Piyush Verma";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "UI/UX Designing", "Ai Agents development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        // Support remote URLs and project-relative paths.
        const safeSrc = skill.icon || '';
        const fallbackSvg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>\n  <rect width='100%' height='100%' fill='%23012670' rx='8'/>\n  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%23fff'>No Image</text>\n</svg>`);

        skillHTML += `
                <div class="bar">
                    <div class="info">
                        <img src="${safeSrc}" alt="${skill.name}" draggable="false" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${fallbackSvg}'" />
                        <span>${skill.name}</span>
                    </div>
                </div>`;
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    if (!projectsContainer) return;

    let projectHTML = "";
    projects.forEach((project, index) => {
        let viewBtn = project.links.view ? `<a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>` : "";
        let codeBtn = project.links.code ? `<a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>` : "";
        let hideClass = index >= 6 ? "home-hide" : "";

        projectHTML += `
        <div class="grid-item ${project.category} ${hideClass} box tilt">
      <img draggable="false" src="assets/images/projects/${project.image}" alt="project" />
      <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            ${viewBtn}
            ${codeBtn}
          </div>
        </div>
      </div>
    </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- isotope filter products -->
    var $grid = $('#work .box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        filter: ':not(.home-hide)'
    });

    // filter items on button click
    $('.button-group').on('click', 'button', function () {
        $('.button-group').find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');

        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    if (typeof srtop !== 'undefined') {
        srtop.reveal('.work .box', { interval: 200 });
    }
}

fetchData().then(data => {
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}




/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: false
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });
/* SCROLL PROJECTS */
srtop.reveal('.certificate .card', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });


srtop.reveal('.certificate-section #certificates-container', { delay: 400 });

/* SCROLL PARTICIPATIONS (homepage + all-participations page) */
srtop.reveal('.certificate-section #participations-container', { delay: 300 });
srtop.reveal('.certificate-section #participations-full-container', { delay: 300 });
srtop.reveal('.certificate-section .certificate-card', { interval: 200 });







const isMainPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/");




fetch('certificates.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('certificates-container');
        const displayData = isMainPage ? data.slice(0, 8) : data;

        displayData.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'certificate-card';

            card.innerHTML = `
        <img src="${cert.image}" alt="${cert.title}" class="certificate-image" />
        <h3>${cert.title}</h3>
        <p><strong>Issuer:</strong> ${cert.issuer}</p>
        <p><strong>Date:</strong> ${cert.date}</p>
      `;

            // Open modal on image click
            card.querySelector('img').addEventListener('click', () => {
                openModal(cert.image, cert.title);
            });

            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error loading certificates:', error);
    });

// Events rendering (loads images from events.json)
fetch('events.json')
    .then(r => r.ok ? r.json() : Promise.reject('Could not fetch events.json'))
    .then(list => {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;
        if (!Array.isArray(list) || list.length === 0) {
            eventsContainer.innerHTML = '<p class="muted">No events available. Add entries to <code>events.json</code>.</p>';
            return;
        }
        eventsContainer.innerHTML = '';
        list.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'event-card tilt';

            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" draggable="false"/>
                <div class="content">
                    <h3>${item.title}</h3>
                    <div class="date">${item.date}</div>
                    <p>${item.description}</p>
                    <div class="btn-wrap">
                        <button class="terminal-btn view-event-btn" data-index="${index}">View <i class="fas fa-terminal"></i></button>
                    </div>
                </div>
            `;

            eventsContainer.appendChild(card);
        });

        // Add event listeners for View buttons
        document.querySelectorAll('.view-event-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                openEventModal(list[index]);
            });
        });

        // init tilt if available
        if (window.VanillaTilt) VanillaTilt.init(document.querySelectorAll('#events-container .tilt'), { max: 8 });

        // reveal animations
        srtop.reveal('.events .event-card', { interval: 150 });
    })
    .catch(err => {
        console.error('Failed to load events:', err);
    });

// Modal Logic
function openModal(imageSrc, title) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');

    modal.style.display = 'flex';
    modalImg.src = imageSrc;
    modalCaption.textContent = title;
}

function closeModal() {
    document.getElementById('image-modal').style.display = 'none';
}

function openEventModal(eventData) {
    const modal = document.getElementById('event-modal');
    const gallery = document.getElementById('event-gallery');
    const title = document.getElementById('event-title');
    const date = document.getElementById('event-date');
    const role = document.getElementById('event-role');
    const desc = document.getElementById('event-desc-full');
    const gPhotos = document.getElementById('event-google-photos');
    const instagram = document.getElementById('event-instagram');
    const linkedin = document.getElementById('event-linkedin');

    // Clear and fill gallery
    gallery.innerHTML = '';
    if (eventData.images && eventData.images.length > 0) {
        eventData.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = eventData.title;
            gallery.appendChild(img);
        });
    } else {
        const img = document.createElement('img');
        img.src = eventData.image;
        img.alt = eventData.title;
        gallery.appendChild(img);
    }

    title.textContent = eventData.title;
    date.innerHTML = `<i class="fas fa-calendar-alt"></i> ${eventData.date}`;
    role.innerHTML = `<i class="fas fa-user-tag"></i> Role: ${eventData.role || 'Contributor'}`;
    desc.textContent = eventData.description;

    // Links
    gPhotos.href = eventData.googlePhotos || '#';
    instagram.href = eventData.instagram || '#';
    linkedin.href = eventData.linkedin || '#';

    // Show/hide links based on availability
    gPhotos.style.display = eventData.googlePhotos && eventData.googlePhotos !== '#' ? 'inline-block' : 'none';
    instagram.style.display = eventData.instagram && eventData.instagram !== '#' ? 'inline-block' : 'none';
    linkedin.style.display = eventData.linkedin && eventData.linkedin !== '#' ? 'inline-block' : 'none';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeEventModal() {
    document.getElementById('event-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}


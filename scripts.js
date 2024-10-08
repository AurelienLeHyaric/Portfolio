document.addEventListener("DOMContentLoaded", () => {
   const sections = document.querySelectorAll(".section")
   const navLinks = document.querySelectorAll("nav a")
   const modal = document.getElementById("project-modal")
   const closeButton = document.querySelector(".close-button")
   const darkModeToggle = document.getElementById("dark-mode-toggle")
   let currentImageIndex = 0
   let modalImages = []

   function initialize() {
      setupNavigation()
      loadProjects()
      setupModal()
      setupHamburgerMenu()
      checkDarkMode()
      loadSvgAndApplyMode() // Charge et applique le mode sur le SVG
   }

   // Gestion de la navigation dynamique entre les sections
   function setupNavigation() {
      navLinks.forEach((link) => {
         link.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href").substring(1)
            showSection(targetId)
         })
      })
      showSection("accueil")
   }

   // Affiche la section correspondante
   function showSection(id) {
      sections.forEach((section) => {
         section.classList.remove("active")
         if (section.id === id) {
            section.classList.add("active")
         }
      })

      navLinks.forEach((link) => {
         link.classList.remove("active")
         if (link.getAttribute("href").substring(1) === id) {
            link.classList.add("active")
         }
      })
   }

   // Chargement des projets à partir du fichier json
   function loadProjects() {
      fetch("data.json")
         .then((response) => response.json())
         .then((projects) => {
            const projectsContainer = document.getElementById("projects-container")
            projectsContainer.innerHTML = ""
            projects.forEach((project) => {
               const projectElement = createProjectElement(project)
               projectsContainer.appendChild(projectElement)
            })
         })
         .catch((error) => console.error("Error loading projects:", error))
   }

   // Affichage des projets récupérés
   function createProjectElement(project) {
      const projectElement = document.createElement("div")
      projectElement.classList.add("project")

      const technologies = project.technologies.map((tech) => `<li>${tech}</li>`).join("")
      projectElement.innerHTML = `
           <h3>${project.title}</h3>
           <img src="${project.cover_image}" alt="${project.title}">
           <ul class="technologies">${technologies}</ul>
       `

      projectElement.addEventListener("click", () => {
         openModal(project)
      })

      return projectElement
   }

   // Gestionnaire d'événements de la modale
   function setupModal() {
      document.getElementById("next-image").addEventListener("click", () => {
         currentImageIndex = (currentImageIndex + 1) % modalImages.length
         updateCarousel()
      })

      document.getElementById("prev-image").addEventListener("click", () => {
         currentImageIndex = (currentImageIndex - 1 + modalImages.length) % modalImages.length
         updateCarousel()
      })

      closeButton.addEventListener("click", () => {
         closeModal()
      })

      window.addEventListener("click", (event) => {
         if (event.target === modal) {
            closeModal()
         }
      })
   }

   // Ouvre la modale en fonction du projet
   function openModal(project) {
      document.getElementById("modal-title").innerText = project.title
      modalImages = project.modal_images
      currentImageIndex = 0
      updateCarousel()

      document.getElementById("modal-info").innerText = project.project_info
      document.getElementById("modal-technologies").innerText = project.technologies.join(", ")
      document.getElementById("modal-year").innerText = project.year
      document.getElementById("modal-type").innerText = project.type
      document.getElementById("modal-github-link").href = project.github_link
      modal.classList.remove("hide")
      modal.classList.add("show")
      modal.style.display = "block"

      if (modalImages.length > 1) {
         document.getElementById("prev-image").style.display = "block"
         document.getElementById("next-image").style.display = "block"
      } else {
         document.getElementById("prev-image").style.display = "none"
         document.getElementById("next-image").style.display = "none"
      }
   }

   // Ferme la modale
   function closeModal() {
      modal.classList.remove("show")
      modal.classList.add("hide")
      setTimeout(() => {
         modal.style.display = "none"
      }, 100)
   }

   // Mise à jour de l'image du carrousel
   function updateCarousel() {
      const modalImagesContainer = document.getElementById("modal-images")
      modalImagesContainer.innerHTML = `<img src="${modalImages[currentImageIndex]}" alt="Project Image">`
   }

   // Configuration du menu hamburger
   function setupHamburgerMenu() {
      const hamburger = document.querySelector(".hamburger")
      const nav = document.querySelector("nav")

      hamburger.addEventListener("click", () => {
         hamburger.classList.toggle("active")
         nav.classList.toggle("active")
      })

      navLinks.forEach((link) => {
         link.addEventListener("click", () => {
            hamburger.classList.remove("active")
            nav.classList.remove("active")
         })
      })
   }

   // Fonction pour basculer le mode sombre
   function toggleDarkMode() {
      document.body.classList.toggle("dark-mode")

      if (document.body.classList.contains("dark-mode")) {
         localStorage.setItem("dark-mode", "enabled")
         darkModeToggle.textContent = "☀️"
      } else {
         localStorage.setItem("dark-mode", null)
         darkModeToggle.textContent = "🌙"
      }
   }

   // Vérifie et applique le mode sombre au chargement
   function checkDarkMode() {
      if (localStorage.getItem("dark-mode") === "enabled") {
         document.body.classList.add("dark-mode")
         darkModeToggle.textContent = "☀️"
      }
   }

   // Fonction pour charger le SVG et appliquer le mode
   function loadSvgAndApplyMode() {
      const objectElement = document.getElementById("welcome-svg")
      objectElement.addEventListener("load", () => {
         // Récupère le document SVG intégré
         const svgDocument = objectElement.contentDocument
         const svgElement = svgDocument.querySelector("svg")

         // Applique le mode actuel (clair ou sombre)
         if (document.body.classList.contains("dark-mode")) {
            svgElement.classList.remove("svg-light")
            svgElement.classList.add("svg-dark")
         } else {
            svgElement.classList.remove("svg-dark")
            svgElement.classList.add("svg-light")
         }
      })
   }

   // Mise à jour du mode SVG en fonction du mode clair/sombre
   function updateSvgMode() {
      const objectElement = document.getElementById("welcome-svg")
      if (objectElement) {
         const svgDocument = objectElement.contentDocument
         if (svgDocument) {
            const svgElement = svgDocument.querySelector("svg")
            if (document.body.classList.contains("dark-mode")) {
               svgElement.classList.remove("svg-light")
               svgElement.classList.add("svg-dark")
            } else {
               svgElement.classList.remove("svg-dark")
               svgElement.classList.add("svg-light")
            }
         }
      }
   }

   // Ajoute un écouteur pour le bouton de bascule du mode sombre
   darkModeToggle.addEventListener("click", () => {
      toggleDarkMode()
      updateSvgMode()
   })

   // Initialisation du site
   initialize()
})

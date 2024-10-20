document.addEventListener("DOMContentLoaded", () => {
   const sections = document.querySelectorAll(".section")
   const navLinks = document.querySelectorAll("nav a")
   const modal = document.getElementById("project-modal")
   const closeButton = document.querySelector(".close-button")
   let currentImageIndex = 0
   let modalImages = []
   let currentSectionIndex = 0
   let isTransitioning = false

   function initialize() {
      setupNavigation()
      loadProjects()
      changeSectionByIndex(currentSectionIndex)
      setupModal()
      setupHamburgerMenu()
   }

   // Changer la section active par son index
   function changeSectionByIndex(index) {
      if (index < 0 || index >= sections.length) return // Éviter de dépasser les sections

      // Changer la section active
      sections.forEach((section, i) => {
         section.classList.remove("active")
         if (i === index) {
            section.classList.add("active")
         }
      })

      // Mettre à jour les liens de navigation
      navLinks.forEach((link) => {
         link.classList.remove("active")
         if (link.getAttribute("href").substring(1) === sections[index].id) {
            link.classList.add("active")
         }
      })

      currentSectionIndex = index
      isTransitioning = false // Permettre de nouveau la transition après le changement de section
      window.scrollTo(0, 0) // Scroll vers le haut de la page après le changement de section
   }

   // Vérifier si la modale est ouverte
   function isModalOpen() {
      return modal.classList.contains("show")
   }

   // Vérifier si on est en haut de page (header compris)
   function isTopOfPage() {
      return window.scrollY === 0
   }

   // Vérifier si le footer est entièrement visible avant d'autoriser le changement de section
   function isFooterVisible() {
      const footer = document.querySelector("footer")
      const footerRect = footer.getBoundingClientRect()
      return footerRect.top < window.innerHeight && footerRect.bottom >= 20
   }

   // Vérifier si le footer est entièrement visible
   function isBottomOfPage() {
      return isFooterVisible()
   }

   // Gérer le défilement avec la molette de la souris
   window.addEventListener("wheel", (e) => {
      if (isModalOpen()) return // Empêche le changement de section si la modale est ouverte

      if (isTransitioning) return

      if (e.deltaY > 0 && isBottomOfPage()) {
         if (currentSectionIndex < sections.length - 1) {
            isTransitioning = true
            changeSectionByIndex(currentSectionIndex + 1) // Aller à la section suivante
         }
      } else if (e.deltaY < 0 && isTopOfPage()) {
         if (currentSectionIndex > 0) {
            isTransitioning = true
            changeSectionByIndex(currentSectionIndex - 1) // Aller à la section précédente
         }
      }
   })

   // Gestion de la navigation dynamique entre les sections
   function setupNavigation() {
      navLinks.forEach((link) => {
         link.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href").substring(1)
            navigateToSection(targetId) // Changer de section par ID
         })
      })
      changeSectionByIndex(0) // Afficher la première section au démarrage
   }

   // Nouvelle fonction pour la navigation par clic sur un lien
   function navigateToSection(id) {
      const targetSectionIndex = Array.from(sections).findIndex((section) => section.id === id)
      if (targetSectionIndex !== -1) {
         changeSectionByIndex(targetSectionIndex)
      }
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

      // On applique le loading lazy partout sauf sur les cover
      const loadingAttribute = project.cover_image.endsWith("cover.webp") ? "" : 'loading="lazy"'

      const technologies = project.technologies.map((tech) => `<li>${tech}</li>`).join("")
      projectElement.innerHTML = `
        <h3>${project.title}</h3>
        <img src="${project.cover_image}" alt="${project.title}" ${loadingAttribute}>
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

      // Gérer le défilement dans la modale pour faire défiler les images du carrousel
      modal.addEventListener("wheel", (e) => {
         e.preventDefault() // Empêche le défilement de la page en arrière-plan
         if (e.deltaY > 0) {
            // Défilement vers le bas (image suivante)
            currentImageIndex = (currentImageIndex + 1) % modalImages.length
            updateCarousel()
         } else if (e.deltaY < 0) {
            // Défilement vers le haut (image précédente)
            currentImageIndex = (currentImageIndex - 1 + modalImages.length) % modalImages.length
            updateCarousel()
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

      // Charger toutes les images .webp du projet immédiatement
      modalImages.forEach((imageUrl) => {
         if (imageUrl.endsWith(".webp")) {
            const img = new Image()
            img.src = imageUrl // Force le chargement de l'image
         }
      })
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
   initialize()
})

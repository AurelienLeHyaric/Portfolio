document.addEventListener("DOMContentLoaded", () => {
   const sections = document.querySelectorAll(".section")
   const navLinks = document.querySelectorAll("nav a")

   // Fonction pour afficher la section correspondante à l'ID donné
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

   // Ajouter un écouteur d'événements pour chaque lien de navigation
   navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
         e.preventDefault()
         const targetId = this.getAttribute("href").substring(1)
         showSection(targetId)
      })
   })

   showSection("accueil")

   // Charger et afficher les projets depuis un fichier JSON
   fetch("data.json")
      .then((response) => response.json())
      .then((projects) => {
         const projectsContainer = document.getElementById("projects-container")
         projectsContainer.innerHTML = ""
         projects.forEach((project) => {
            const projectElement = document.createElement("div")
            projectElement.classList.add("project")

            const technologies = project.technologies.map((tech) => `<li>${tech}</li>`).join("")

            projectElement.innerHTML = `
                  <h3>${project.title}</h3>
                  <img src="${project.cover_image}" alt="${project.title}">
                  <ul class="technologies">${technologies}</ul>
                `
            projectsContainer.appendChild(projectElement)
         })
      })
      .catch((error) => console.error("Error loading projects:", error))
})

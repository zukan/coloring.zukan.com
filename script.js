document.addEventListener("DOMContentLoaded", () => {
  const footerLogo = document.querySelector(".pt-12"); // The footer logo container

  // Create a container for our nurie grid
  const nurieContainer = document.createElement("div");
  nurieContainer.classList.add("w-full", "py-8");

  // Create heading for the recommended nurie section
  const heading = document.createElement("h2");
  heading.classList.add("text-2xl", "font-bold", "mb-4", "text-center");
  heading.textContent = "ピックアップ";
  nurieContainer.appendChild(heading);

  // Create loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("text-center", "py-8");
  loadingIndicator.innerHTML = `
    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent">
    </div>
    <p class="mt-2 text-gray-600">読み込み中...</p>
  `;
  nurieContainer.appendChild(loadingIndicator);

  // Insert before the footer logo if main element exists
  const mainEl = document.querySelector("main");
  if (mainEl) {
    mainEl.insertBefore(nurieContainer, footerLogo);
  }

  // Fetch nurie data
  fetchNurieData().then(data => {
    // Remove loading indicator
    loadingIndicator.remove();

    // Display the nurie grid
    displayNurieGrid(nurieContainer, data.entities);
  }).catch(error => {
    // On error, remove the entire container so no heading is shown
    console.error("Error fetching nurie data:", error);
    nurieContainer.remove();
  });
});

async function fetchNurieData() {
  try {
    const response = await fetch("https://api-coloring.zukan.com/v1/nuries?site=com.zukan.coloring&page_size=16&t=25032");
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch nurie data:", error);
    throw error;
  }
}

function displayNurieGrid(container, nuries) {
  // Limit to max 16 items
  const displayNuries = nuries.slice(0, 16);

  // Create a responsive grid
  const gridElement = document.createElement("div");
  gridElement.classList.add("grid", "grid-cols-2", "sm:grid-cols-3", "md:grid-cols-4", "gap-4", "w-full");

  // Add each nurie to the grid
  displayNuries.forEach(nurie => {
    const nurieCard = createNurieCard(nurie);
    gridElement.appendChild(nurieCard);
  });

  container.appendChild(gridElement);
}

function createNurieCard(nurie) {
  const card = document.createElement("div");
  card.classList.add("rounded-lg", "overflow-hidden", "shadow-md", "bg-white", "transition-transform", "duration-300", "hover:shadow-lg", "hover:-translate-y-1");

  // Get the image URL from the API response
  const imageUrl = nurie.media.image.thumbnail_url;

  card.innerHTML = `
    <div class="aspect-square relative">
      <img 
        src="${imageUrl}" 
        alt="${nurie.name}" 
        class="w-full h-full object-cover"
        loading="lazy"
        alt="${nurie.name}"
        title="${nurie.name}"
      />
    </div>
  `;

  return card;
}

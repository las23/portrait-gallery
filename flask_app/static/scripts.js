// Check if debug mode is enabled via query string
const isDebugMode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true';
};

// Initialize debug mode
const debugMode = isDebugMode();

// Define global variables for external access
let portraitData = [];
let isDataLoaded = false;
let currentFilter = 'all';
let gridViewActive = false;

// Global filter function that can be called from inline scripts
window.filterPortraitsByCompany = function(company) {
    // If just returning filtered data (no UI update)
    if (arguments.length === 1 && typeof filterPortraitsByCompanyInternal === 'function') {
        return filterPortraitsByCompanyInternal(company);
    }
    
    // Otherwise trigger the UI filtering
    if (typeof filterPortraitsByCompanyInternal === 'function') {
        filterPortraitsByCompanyInternal(company, true);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const configuration = {
        portraits: {
            baseWidth: 200,
            baseHeight: 280,
            margin: 50, // Base margin between portraits
            marginVariation: 0.6 // Random margin variation factor (± percentage of margin)
        },
        layers: [
            { name: 'front', count: 10, minSize: 250, maxSize: 275, zIndex: 30, minSpeed: 1, maxSpeed: 3 },
            { name: 'middle', count: 15, minSize: 200, maxSize: 250, zIndex: 20, minSpeed: 2, maxSpeed: 4 },
            { name: 'back', count: 20, minSize: 150, maxSize: 200, zIndex: 10, minSpeed: 3, maxSpeed: 5 }
        ],
        portraitsPerLane: 6, // Number of portraits to initialize per lane
        speedVariation: 0.4 // Speed variation factor (± percentage of base speed)
    };

    // Store all portrait elements
    let portraits = [];
    
    // Set to track portrait IDs currently in use
    let usedPortraitIds = new Set();
    
    // Animation variables
    let lastTime = 0;
    let animationId = null;
    
    // Inactivity timer
    let inactivityTimer = null;
    const inactivityTimeout = 20000; // 20 seconds
    
    // Function to fetch portrait data from the API
    const fetchPortraitData = async () => {
        try {
            const response = await fetch('/api/portraits');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            portraitData = data;
            isDataLoaded = true;
            
            // Once data is loaded, initialize the portraits
            initializePortraits();
            
            // Populate the company dropdown
            populateCompanyDropdown();
            
            // Initialize the search functionality
            initializeSearch();
            
            // If debug mode, log the data
            if (debugMode) {
                console.log('Portrait data loaded:', portraitData);
            }
        } catch (error) {
            console.error('Error fetching portrait data:', error);
        }
    };
    
    // Start fetching data
    fetchPortraitData();
    
    // Function to filter portraits by company name
    const filterPortraitsByCompanyInternal = (company, triggerUIUpdate = false) => {
        // If just returning filtered data (no UI update)
        if (!triggerUIUpdate) {
            if (typeof company === 'string' && company !== 'all') {
                return portraitData.filter(portrait => portrait.company === company);
            } else if (typeof company === 'string' && company === 'all') {
                return portraitData;
            }
            return [];
        }
        
        // Otherwise, this is the UI filtering function
        console.log('Filtering portraits by company:', company);
        
        // Reset any existing inactivity timer
        resetInactivityTimer();
        
        // Update current filter
        currentFilter = company;
        
        // Update dropdown selection
        document.querySelectorAll('.dropdown-item').forEach(item => {
            if (item.getAttribute('data-company') === company) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Update filter display
        const filterValue = document.querySelector('.filter-value');
        if (filterValue) {
            filterValue.textContent = company === 'all' ? 'All Companies' : company;
        }
        
        // Show/hide reset button
        const resetButton = document.querySelector('.reset-filter');
        if (resetButton) {
            if (company === 'all') {
                resetButton.style.display = 'none';
                document.querySelector('.active-filter').classList.remove('visible');
                
                // Hide grid view if visible
                hideGridView();
            } else {
                resetButton.style.display = 'block';
                document.querySelector('.active-filter').classList.add('visible');
                
                // Accelerate current portraits out of view
                acceleratePortraitsOut();
                
                // Show grid view with portraits of selected company
                showGridView(company);
            }
        }
    };
    
    // Make filterPortraitsByCompanyInternal available for the global function
    window.filterPortraitsByCompanyInternal = filterPortraitsByCompanyInternal;
    
    // Function to filter portraits by search text
    const filterPortraitsBySearch = (searchText) => {
        if (!searchText) {
            return portraitData;
        }
        searchText = searchText.toLowerCase();
        return portraitData.filter(portrait => 
            portrait.name.toLowerCase().includes(searchText) || 
            portrait.company.toLowerCase().includes(searchText) || 
            portrait.bio.toLowerCase().includes(searchText)
        );
    };
    
    // Find portrait data by ID
    const findPortraitDataById = (id) => {
        return portraitData.find(portrait => portrait.id === id);
    };
    
    // Get window dimensions
    const getWindowDimensions = () => {
        // Calculate available width for portraits (total width minus profile panel width)
        const profilePanelWidth = 270; // Use the fixed width of 270px to match CSS
        
        return {
            width: window.innerWidth - profilePanelWidth,
            height: window.innerHeight
        };
    };
    
    // Generate a unique speed for each lane within a layer
    const generateLaneSpeeds = (layer) => {
        const laneSpeeds = {};
        const baseSpeed = layer.baseSpeed;
        const variation = configuration.speedVariation;
        
        for (let i = 0; i < layer.lanes; i++) {
            // Generate a speed between baseSpeed*(1-variation) and baseSpeed*(1+variation)
            const randomFactor = 1 + (Math.random() * variation * 2 - variation);
            laneSpeeds[i] = baseSpeed * randomFactor;
        }
        
        return laneSpeeds;
    };
    
    // Calculate portrait height based on width and random aspect ratio
    const calculatePortraitHeight = (baseWidth, baseMargin, variation) => {
        // Random aspect ratio between 0.7 and 1.3
        const aspectRatio = 0.7 + Math.random() * 0.6;
        const height = baseWidth * aspectRatio;
        
        // Generate random margin between baseMargin*(1-variation) and baseMargin*(1+variation)
        const randomMargin = baseMargin * (1 + (Math.random() * variation * 2 - variation));
        return height;
    };
    
    // Get unique company names from portrait data
    const getUniqueCompanies = () => {
        const companies = portraitData.map(portrait => portrait.company);
        // Remove duplicates using Set
        return [...new Set(companies)].sort();
    };
    
    // Populate company dropdown
    const populateCompanyDropdown = () => {
        const dropdownContent = document.querySelector('.dropdown-content');
        if (!dropdownContent) return;
        
        const uniqueCompanies = getUniqueCompanies();
        
        // Clear existing items (except "All Companies")
        const allCompaniesItem = dropdownContent.querySelector('[data-company="all"]');
        dropdownContent.innerHTML = '';
        
        if (allCompaniesItem) {
            dropdownContent.appendChild(allCompaniesItem);
        } else {
            // If "All Companies" option doesn't exist, create it
            const allItem = document.createElement('div');
            allItem.className = 'dropdown-item selected';
            allItem.setAttribute('data-company', 'all');
            allItem.textContent = 'All Companies';
            allItem.addEventListener('click', () => {
                window.filterPortraitsByCompany('all');
            });
            dropdownContent.appendChild(allItem);
        }
        
        // Add company options
        uniqueCompanies.forEach(company => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.setAttribute('data-company', company);
            item.textContent = company;
            item.addEventListener('click', () => {
                window.filterPortraitsByCompany(company);
            });
            dropdownContent.appendChild(item);
        });
    };
    
    // Initialize portrait elements
    const initializePortraits = () => {
        const container = document.getElementById('container');
        const dimensions = getWindowDimensions();
        
        // Clear any existing portraits
        portraits = [];
        const existingPortraits = document.querySelectorAll('.portrait');
        existingPortraits.forEach(portrait => portrait.remove());
        
        // Reset used portrait IDs when reinitializing
        usedPortraitIds = new Set();
        
        // Track portrait positions by layer and lane
        const lanePositions = {};
        // Store speeds for each lane in each layer
        const laneSpeeds = {};
        
        // Loop through each layer
        configuration.layers.forEach(layer => {
            // Number of lanes for this layer
            const lanes = Math.ceil(Math.sqrt(layer.count));
            const portraitsPerLane = Math.ceil(layer.count / lanes);
            
            for (let laneIndex = 0; laneIndex < lanes; laneIndex++) {
                // Initialize this lane within the layer if not already done
                if (!lanePositions[layer.name]) {
                    lanePositions[layer.name] = {};
                    laneSpeeds[layer.name] = {};
                }
                
                // Set initial position for this lane
                lanePositions[layer.name][laneIndex] = 0;
                
                // Random speed for this lane (relative to layer's base speed)
                const speedVariation = 1 - configuration.speedVariation + Math.random() * configuration.speedVariation * 2;
                const laneSpeed = Math.random() * (layer.maxSpeed - layer.minSpeed) + layer.minSpeed;
                laneSpeeds[layer.name][laneIndex] = laneSpeed;
                
                // Create portraits for this lane
                for (let i = 0; i < portraitsPerLane; i++) {
                    // Skip if we've reached the total count for this layer
                    if (laneIndex * portraitsPerLane + i >= layer.count) {
                        break;
                    }
                    
                    // Determine portrait size (scaled based on layer)
                    const portraitSize = Math.random() * (layer.maxSize - layer.minSize) + layer.minSize;
                    const aspectRatio = 0.7 + Math.random() * 0.6; // Random aspect ratio between 0.7 and 1.3
                    const portraitWidth = portraitSize;
                    const portraitHeight = portraitSize * aspectRatio;
                    
                    // Calculate lane width and horizontal position
                    const laneWidth = dimensions.width / lanes;
                    const xPos = laneIndex * laneWidth + (laneWidth - portraitWidth) * Math.random();
                    
                    // Calculate vertical position with random spacing
                    const baseSpacing = dimensions.height / portraitsPerLane;
                    const marginVariation = 1 - configuration.portraits.marginVariation + Math.random() * configuration.portraits.marginVariation * 2;
                    const randomSpacing = baseSpacing * marginVariation;
                    
                    // Initial Y position 
                    // Start portraits at the bottom of the screen
                    const yPos = dimensions.height + i * randomSpacing;
                    lanePositions[layer.name][laneIndex] += portraitHeight + randomSpacing;
                    
                    // Get random portrait data ensuring no duplicates
                    let portraitIndex, data;
                    let attempts = 0;
                    const maxAttempts = 50; // Prevent infinite loop if we have too few portraits
                    
                    do {
                        portraitIndex = Math.floor(Math.random() * portraitData.length);
                        data = portraitData[portraitIndex];
                        attempts++;
                        // If we've tried too many times, just use any portrait
                        if (attempts >= maxAttempts) break;
                    } while (usedPortraitIds.has(data.id));
                    
                    usedPortraitIds.add(data.id);
                    
                    // Create portrait element
                    const portrait = document.createElement('div');
                    portrait.className = 'portrait';
                    portrait.style.width = `${portraitWidth}px`;
                    portrait.style.height = `${portraitHeight}px`;
                    portrait.style.left = `${xPos}px`;
                    portrait.style.top = `${yPos}px`;
                    portrait.style.zIndex = layer.zIndex;
                    portrait.setAttribute('data-id', data.id);
                    
                    // Portrait image
                    const img = document.createElement('img');
                    img.src = data.image;
                    img.alt = data.name;
                    portrait.appendChild(img);
                    
                    // Portrait info
                    const info = document.createElement('div');
                    info.className = 'portrait-info';
                    
                    const name = document.createElement('div');
                    name.className = 'portrait-name';
                    name.textContent = data.name;
                    
                    const company = document.createElement('div');
                    company.className = 'portrait-company';
                    company.textContent = data.company;
                    
                    info.appendChild(name);
                    info.appendChild(company);
                    portrait.appendChild(info);
                    
                    // Add debug info if debug mode is enabled
                    if (debugMode) {
                        const debugInfo = document.createElement('div');
                        debugInfo.className = 'portrait-debug-info';
                        
                        debugInfo.innerHTML = `
                            <div>Layer: ${layer.name}</div>
                            <div>Size: ${Math.round(portraitWidth)}px</div>
                            <div>Speed: ${laneSpeed.toFixed(2)}px/s</div>
                            <div>Lane: ${laneIndex}</div>
                        `;
                        portrait.appendChild(debugInfo);
                    }
                    
                    // Add click event
                    portrait.addEventListener('click', () => {
                        showProfile(data);
                    });
                    
                    // Add to container
                    container.appendChild(portrait);
                    
                    // Store portrait data
                    portraits.push({
                        element: portrait,
                        id: data.id,
                        x: xPos,
                        y: yPos,
                        width: portraitWidth,
                        height: portraitHeight,
                        speed: laneSpeed,
                        layer: layer.name,
                        lane: laneIndex,
                        spacing: randomSpacing
                    });
                }
            }
        });
        
        // Continue animation loop
        animationId = requestAnimationFrame(animate);
    };

    // Helper to get lowest position in a lane
    const getLowestPositionInLane = (layerName, laneIndex) => {
        let lowestPosition = window.innerHeight; // Start with the bottom of the screen
        
        portraits.forEach(p => {
            if (p.layer === layerName && p.lane === laneIndex) {
                // Consider the bottom edge of the portrait (y + height) plus its spacing
                const bottomPosition = p.y + p.height + p.spacing;
                if (bottomPosition > lowestPosition) {
                    lowestPosition = bottomPosition;
                }
            }
        });
        
        return lowestPosition;
    };

    // Animate portraits
    const animate = (currentTime) => {
        if (!lastTime) {
            lastTime = currentTime;
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        
        const dimensions = getWindowDimensions();
        
        // Track portraits that need to be reset
        const portraitsToReset = [];
        // Used portrait IDs in the current view (excluding ones about to be reset)
        const currentlyUsedIds = new Set(usedPortraitIds);
        
        // First update positions of all portraits
        portraits.forEach(portrait => {
            // Update position - slow down movement for 20-30 second visibility
            // Using a much smaller multiplier to ensure portraits stay visible longer
            portrait.y -= portrait.speed * 10 * deltaTime; // Speed adjusted for better visibility (20-30 seconds on screen)
            
            // Check if portrait has moved out of viewport
            if (portrait.y < -portrait.height) {
                // Mark for reset
                portraitsToReset.push(portrait);
                
                // Remove from currently used IDs since we'll replace it
                const portraitId = parseInt(portrait.element.getAttribute('data-id'));
                currentlyUsedIds.delete(portraitId);
            } else {
                // Update element position immediately
                portrait.element.style.top = `${portrait.y}px`;
            }
        });
        
        // Reset portraits that went off-screen
        portraitsToReset.forEach(portrait => {
            // Get the lowest position in the same lane to ensure no overlap
            const lowestPosition = getLowestPositionInLane(portrait.layer, portrait.lane);
            
            // Remove old portrait ID from used set
            const oldPortraitId = parseInt(portrait.element.getAttribute('data-id'));
            usedPortraitIds.delete(oldPortraitId);
            
            // Get random portrait data ensuring no duplicates
            let portraitIndex, data;
            let attempts = 0;
            const maxAttempts = 50; // Prevent infinite loop if we have too few portraits
            
            do {
                portraitIndex = Math.floor(Math.random() * portraitData.length);
                data = portraitData[portraitIndex];
                attempts++;
                // If we've tried too many times, just use any portrait
                if (attempts >= maxAttempts) break;
            } while (currentlyUsedIds.has(data.id));
            
            // Add the new portrait ID to both sets
            usedPortraitIds.add(data.id);
            currentlyUsedIds.add(data.id);
            
            // Update portrait content with new data
            portrait.element.setAttribute('data-id', data.id);
            const img = portrait.element.querySelector('img');
            if (img) {
                img.src = data.image;
                img.alt = data.name;
            }
            
            const nameElement = portrait.element.querySelector('.portrait-name');
            if (nameElement) {
                nameElement.textContent = data.name;
            }
            
            const companyElement = portrait.element.querySelector('.portrait-company');
            if (companyElement) {
                companyElement.textContent = data.company;
            }
            
            // Remove old click event listeners and add new one with the correct data
            const oldElement = portrait.element;
            const newElement = oldElement.cloneNode(true);
            oldElement.parentNode.replaceChild(newElement, oldElement);
            portrait.element = newElement;
            
            // Add new click event with the correct data
            portrait.element.addEventListener('click', () => {
                showProfile(data);
            });
            
            // Apply filter if one is active
            if (currentFilter !== 'all' && data.company !== currentFilter) {
                portrait.element.classList.add('filtered-out');
            } else {
                portrait.element.classList.remove('filtered-out');
            }
            
            // Calculate new spacing
            const randomSpacing = Math.random() * 100 + 50; // Random spacing between 50-150px
            
            // Reset position below the viewport for continuous flow
            portrait.y = dimensions.height + randomSpacing;
            portrait.spacing = randomSpacing;
            
            // Calculate random horizontal position within lane to avoid portraits all in straight lines
            const laneWidth = dimensions.width / Math.ceil(Math.sqrt(configuration.layers.find(l => l.name === portrait.layer).count));
            const randomXPos = portrait.lane * laneWidth + Math.random() * (laneWidth - portrait.width);
            portrait.x = randomXPos;
            
            // Update element position
            portrait.element.style.top = `${portrait.y}px`;
            portrait.element.style.left = `${randomXPos}px`;
        });
        
        // Continue animation loop
        animationId = requestAnimationFrame(animate);
    };

    // Show profile panel
    const showProfile = (data) => {
        // Update profile content only, no need to show/hide the panel as it's always visible
        document.querySelector('.profile-image').style.backgroundImage = `url(${data.image})`;
        document.querySelector('.profile-name').textContent = data.name;
        document.querySelector('.profile-company').textContent = data.company;
        document.querySelector('.profile-bio').textContent = data.bio;
    };

    // Hide profile panel - kept for API compatibility but no functionality needed
    const hideProfile = () => {
        // No action needed as panel is always visible
    };
    
    // Accelerate portraits out of the viewport
    const acceleratePortraitsOut = () => {
        portraits.forEach(portrait => {
            // Add accelerate class for smooth transition
            portrait.element.classList.add('accelerate');
            
            // Set negative target Y to accelerate portrait out of viewport
            const targetY = -portrait.height - 200 - Math.random() * 300;
            portrait.element.style.top = `${targetY}px`;
        });
    };
    
    // Show grid view with portraits of selected company
    const showGridView = (company) => {
        console.log('Showing grid view for company:', company);
        // Get portraits for the selected company
        const filteredPortraits = filterPortraitsByCompanyInternal(company);
        
        // Mark grid view as active
        gridViewActive = true;
        
        // Clear existing portraits in grid
        const gridPortraitsContainer = document.querySelector('.grid-portraits');
        if (gridPortraitsContainer) {
            gridPortraitsContainer.innerHTML = '';
        
            // Update grid title
            const gridTitle = document.querySelector('.grid-title');
            if (gridTitle) {
                gridTitle.textContent = `${company} Portraits`;
            }
            
            // Add portraits to grid
            filteredPortraits.forEach(portrait => {
                const portraitElement = document.createElement('div');
                portraitElement.className = 'grid-portrait';
                portraitElement.setAttribute('data-id', portrait.id);
                
                // Create portrait image
                const image = document.createElement('img');
                image.src = portrait.image;
                image.alt = portrait.name;
                
                // Create portrait info
                const info = document.createElement('div');
                info.className = 'grid-portrait-info';
                
                const name = document.createElement('h3');
                name.textContent = portrait.name;
                
                info.appendChild(name);
                
                // Add click event to show profile
                portraitElement.addEventListener('click', () => {
                    showProfile(portrait);
                });
                
                // Add elements to portrait
                portraitElement.appendChild(image);
                portraitElement.appendChild(info);
                
                // Add portrait to grid
                gridPortraitsContainer.appendChild(portraitElement);
            });
            
            // Show grid container
            document.getElementById('grid-container').classList.add('visible');
            
            // Start inactivity timer
            resetInactivityTimer();
        }
    }
    
    // Hide grid view and return to flowing portraits
    const hideGridView = () => {
        // Don't do anything if grid view is not active
        if (!gridViewActive) return;
        
        const gridContainer = document.getElementById('grid-container');
        gridContainer.classList.remove('visible');
        gridViewActive = false;
        
        // Clear inactivity timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
        
        // Reset filter to "all" for flowing portraits
        currentFilter = 'all';
        document.querySelectorAll('.dropdown-item').forEach(item => {
            if (item.getAttribute('data-company') === 'all') {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Reset filter display
        document.querySelector('.filter-value').textContent = 'All Companies';
        document.querySelector('.reset-filter').style.display = 'none';
        document.querySelector('.active-filter').classList.remove('visible');
        
        // Accelerate current portraits out of view
        acceleratePortraitsOut();
        
        // Reinitialize flowing portraits
        setTimeout(() => {
            // Remove acceleration class from portraits
            portraits.forEach(portrait => {
                portrait.element.classList.remove('accelerate');
            });
            
            // Reinitialize portraits
            initializePortraits();
        }, 500);
    };
    
    // Reset inactivity timer for grid view
    const resetInactivityTimer = () => {
        // Only set timer if grid view is active
        if (!gridViewActive) return;
        
        // Clear existing timer if any
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        // Update timer message countdown if it exists
        updateTimerMessage();
        
        // Set new timer to return to flowing portraits after inactivity
        inactivityTimer = setTimeout(() => {
            hideGridView();
        }, inactivityTimeout);
    };
    
    // Helper function to update the timer message
    const updateTimerMessage = () => {
        const timerMessage = document.querySelector('.inactivity-message');
        if (timerMessage) {
            // Reset the countdown animation
            timerMessage.style.animation = 'none';
            timerMessage.offsetHeight; // Trigger reflow
            timerMessage.style.animation = '';
            
            // Show the message briefly
            timerMessage.classList.add('show');
            setTimeout(() => {
                timerMessage.classList.remove('show');
            }, 3000);
        }
    };
    
    // Initialize search functionality
    const initializeSearch = () => {
        // Populate dropdown with companies
        populateCompanyDropdown();
        
        // Set up search button
        const searchButton = document.querySelector('.search-button');
        searchButton.addEventListener('click', () => {
            document.querySelector('.dropdown-content').classList.toggle('show');
        });
        
        // Set up reset filter button
        const resetFilter = document.querySelector('.reset-filter');
        resetFilter.addEventListener('click', () => {
            window.filterPortraitsByCompany('all');
        });
        
        // Set up all companies option
        const allCompaniesItem = document.querySelector('[data-company="all"]');
        allCompaniesItem.addEventListener('click', () => {
            window.filterPortraitsByCompany('all');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.matches('.search-button') && !event.target.closest('.dropdown-content')) {
                document.querySelector('.dropdown-content').classList.remove('show');
            }
        });
        
        // Set up grid close button
        const gridClose = document.querySelector('.grid-close');
        gridClose.addEventListener('click', () => {
            hideGridView();
        });
        
        // Add event listeners to detect user activity in grid view
        const gridContainer = document.getElementById('grid-container');
        ['click', 'mousemove', 'touchstart', 'scroll'].forEach(eventType => {
            gridContainer.addEventListener(eventType, () => {
                resetInactivityTimer();
            });
        });
    };

    // Handle window resize
    window.addEventListener('resize', () => {
        // Stop current animation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // If grid view is active, adjust its size
        if (gridViewActive) {
            const gridContainer = document.getElementById('grid-container');
            gridContainer.style.width = `calc(100% - 270px)`;
        } else {
            // Reinitialize portraits
            initializePortraits();
            
            // Restart animation
            lastTime = 0;
            animationId = requestAnimationFrame(animate);
        }
    });
});

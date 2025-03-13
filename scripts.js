// Check if debug mode is enabled via query string
const isDebugMode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true';
};

// Initialize debug mode
const debugMode = isDebugMode();

document.addEventListener('DOMContentLoaded', () => {
    // Portrait data (placeholder images from placeholder services with people)
    const portraitData = [
        { id: 1, image: 'https://randomuser.me/api/portraits/women/1.jpg', name: 'Karla Hermansen', company: 'TechCorp', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
        { id: 2, image: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'Martin Jensen', company: 'DigitalWave', bio: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { id: 3, image: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Sofia Nielsen', company: 'CreativeLab', bio: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
        { id: 4, image: 'https://randomuser.me/api/portraits/men/2.jpg', name: 'Emil Petersen', company: 'InnoTech', bio: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
        { id: 5, image: 'https://randomuser.me/api/portraits/women/3.jpg', name: 'Anna Christensen', company: 'SmartSystems', bio: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.' },
        { id: 6, image: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Oliver Hansen', company: 'TechCorp', bio: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.' },
        { id: 7, image: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Laura Andersen', company: 'DigitalWave', bio: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?' },
        { id: 8, image: 'https://randomuser.me/api/portraits/men/4.jpg', name: 'William Pedersen', company: 'CreativeLab', bio: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.' },
        { id: 9, image: 'https://randomuser.me/api/portraits/women/5.jpg', name: 'Isabella Larsen', company: 'InnoTech', bio: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.' },
        { id: 10, image: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'Noah Sørensen', company: 'SmartSystems', bio: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.' },
        { id: 11, image: 'https://randomuser.me/api/portraits/women/6.jpg', name: 'Emma Rasmussen', company: 'TechCorp', bio: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.' },
        { id: 12, image: 'https://randomuser.me/api/portraits/men/6.jpg', name: 'Sebastian Thomsen', company: 'DigitalWave', bio: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.' },
        { id: 13, image: 'https://randomuser.me/api/portraits/women/7.jpg', name: 'Victoria Jørgensen', company: 'CreativeLab', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { id: 14, image: 'https://randomuser.me/api/portraits/men/7.jpg', name: 'Lucas Poulsen', company: 'InnoTech', bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
        { id: 15, image: 'https://randomuser.me/api/portraits/women/8.jpg', name: 'Karla Hermansen', company: 'Cortrium', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
        { id: 16, image: 'https://randomuser.me/api/portraits/men/8.jpg', name: 'Frederik Møller', company: 'SmartSystems', bio: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
        { id: 17, image: 'https://randomuser.me/api/portraits/women/9.jpg', name: 'Josefine Olsen', company: 'TechCorp', bio: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { id: 18, image: 'https://randomuser.me/api/portraits/men/9.jpg', name: 'Malthe Knudsen', company: 'DigitalWave', bio: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.' },
        { id: 19, image: 'https://randomuser.me/api/portraits/women/10.jpg', name: 'Clara Madsen', company: 'CreativeLab', bio: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
        { id: 20, image: 'https://randomuser.me/api/portraits/men/10.jpg', name: 'Oscar Jakobsen', company: 'InnoTech', bio: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.' },
        { id: 21, image: 'https://randomuser.me/api/portraits/women/11.jpg', name: 'Sara Mortensen', company: 'NexusLink', bio: 'Proin eget tortor risus. Curabitur aliquet quam id dui posuere blandit.' },
        { id: 22, image: 'https://randomuser.me/api/portraits/men/11.jpg', name: 'Tobias Eriksen', company: 'DigitalWave', bio: 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Nulla porttitor accumsan tincidunt.' },
        { id: 23, image: 'https://randomuser.me/api/portraits/women/12.jpg', name: 'Frida Bech', company: 'CreativeLab', bio: 'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.' },
        { id: 24, image: 'https://randomuser.me/api/portraits/men/12.jpg', name: 'Kasper Winther', company: 'TechCorp', bio: 'Pellentesque in ipsum id orci porta dapibus. Donec rutrum congue leo eget malesuada.' },
        { id: 25, image: 'https://randomuser.me/api/portraits/women/13.jpg', name: 'Maja Kjær', company: 'SmartSystems', bio: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Donec sollicitudin molestie malesuada.' },
        { id: 26, image: 'https://randomuser.me/api/portraits/men/13.jpg', name: 'Mathias Berg', company: 'InnoTech', bio: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.' },
        { id: 27, image: 'https://randomuser.me/api/portraits/women/14.jpg', name: 'Amalie Holm', company: 'NexusLink', bio: 'Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla quis lorem ut libero malesuada feugiat.' },
        { id: 28, image: 'https://randomuser.me/api/portraits/men/14.jpg', name: 'August Mikkelsen', company: 'Cortrium', bio: 'Nulla porttitor accumsan tincidunt. Cras ultricies ligula sed magna dictum porta.' },
        { id: 29, image: 'https://randomuser.me/api/portraits/women/15.jpg', name: 'Lea Laursen', company: 'DigitalWave', bio: 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vivamus suscipit tortor eget felis porttitor volutpat.' },
        { id: 30, image: 'https://randomuser.me/api/portraits/men/15.jpg', name: 'Magnus Bruun', company: 'TechCorp', bio: 'Vivamus suscipit tortor eget felis porttitor volutpat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.' },
        { id: 31, image: 'https://randomuser.me/api/portraits/women/16.jpg', name: 'Freja Fischer', company: 'CreativeLab', bio: 'Sed porttitor lectus nibh. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.' },
        { id: 32, image: 'https://randomuser.me/api/portraits/men/16.jpg', name: 'Valdemar Lund', company: 'InnoTech', bio: 'Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.' },
        { id: 33, image: 'https://randomuser.me/api/portraits/women/17.jpg', name: 'Ellen Nørgaard', company: 'SmartSystems', bio: 'Donec sollicitudin molestie malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.' },
        { id: 34, image: 'https://randomuser.me/api/portraits/men/17.jpg', name: 'Villads Bech', company: 'NexusLink', bio: 'Curabitur aliquet quam id dui posuere blandit. Nulla quis lorem ut libero malesuada feugiat.' },
        { id: 35, image: 'https://randomuser.me/api/portraits/women/18.jpg', name: 'Filippa Dahl', company: 'Cortrium', bio: 'Donec rutrum congue leo eget malesuada. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.' },
        { id: 36, image: 'https://randomuser.me/api/portraits/men/18.jpg', name: 'Gustav Bertelsen', company: 'TechCorp', bio: 'Pellentesque in ipsum id orci porta dapibus. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.' },
        { id: 37, image: 'https://randomuser.me/api/portraits/women/19.jpg', name: 'Mille Møller', company: 'DigitalWave', bio: 'Nulla porttitor accumsan tincidunt. Nulla quis lorem ut libero malesuada feugiat.' },
        { id: 38, image: 'https://randomuser.me/api/portraits/men/19.jpg', name: 'Oskar Vestergaard', company: 'CreativeLab', bio: 'Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.' },
        { id: 39, image: 'https://randomuser.me/api/portraits/women/20.jpg', name: 'Ida Jensen', company: 'InnoTech', bio: 'Cras ultricies ligula sed magna dictum porta. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.' },
        { id: 40, image: 'https://randomuser.me/api/portraits/men/20.jpg', name: 'Mikkel Dalgaard', company: 'SmartSystems', bio: 'Proin eget tortor risus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.' },
        { id: 41, image: 'https://randomuser.me/api/portraits/women/21.jpg', name: 'Caroline Østergaard', company: 'NexusLink', bio: 'Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim.' },
        { id: 42, image: 'https://randomuser.me/api/portraits/men/21.jpg', name: 'Jonathan Iversen', company: 'Cortrium', bio: 'Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur aliquet quam id dui posuere blandit.' },
        { id: 43, image: 'https://randomuser.me/api/portraits/women/22.jpg', name: 'Mathilde Davidsen', company: 'TechCorp', bio: 'Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.' },
        { id: 44, image: 'https://randomuser.me/api/portraits/men/22.jpg', name: 'Felix Bjerregaard', company: 'DigitalWave', bio: 'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.' },
        { id: 45, image: 'https://randomuser.me/api/portraits/women/23.jpg', name: 'Cecilie Tang', company: 'CreativeLab', bio: 'Pellentesque in ipsum id orci porta dapibus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.' },
        { id: 46, image: 'https://randomuser.me/api/portraits/men/23.jpg', name: 'Anton Nissen', company: 'InnoTech', bio: 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Donec rutrum congue leo eget malesuada.' },
        { id: 47, image: 'https://randomuser.me/api/portraits/women/24.jpg', name: 'Alma Svendsen', company: 'SmartSystems', bio: 'Quisque velit nisi, pretium ut lacinia in, elementum id enim. Sed porttitor lectus nibh.' },
        { id: 48, image: 'https://randomuser.me/api/portraits/men/24.jpg', name: 'Storm Klausen', company: 'NexusLink', bio: 'Nulla quis lorem ut libero malesuada feugiat. Cras ultricies ligula sed magna dictum porta.' },
        { id: 49, image: 'https://randomuser.me/api/portraits/women/25.jpg', name: 'Liva Johnsen', company: 'Cortrium', bio: 'Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus.' },
        { id: 50, image: 'https://randomuser.me/api/portraits/men/25.jpg', name: 'Alfred Riis', company: 'TechCorp', bio: 'Vivamus suscipit tortor eget felis porttitor volutpat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.' }
    ];

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
    
    // Current filter state
    let currentFilter = 'all';
    
    // Set to track portrait IDs currently in use
    let usedPortraitIds = new Set();
    
    // Animation variables
    let lastTime = 0;
    let animationId = null;
    
    // Inactivity timer
    let inactivityTimer = null;
    const inactivityTimeout = 20000; // 20 seconds
    
    // Grid view state
    let gridViewActive = false;
    
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
        return baseHeight + randomMargin;
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
        const uniqueCompanies = getUniqueCompanies();
        
        // Clear existing items (except "All Companies")
        const allCompaniesItem = dropdownContent.querySelector('[data-company="all"]');
        dropdownContent.innerHTML = '';
        dropdownContent.appendChild(allCompaniesItem);
        
        // Add company options
        uniqueCompanies.forEach(company => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.setAttribute('data-company', company);
            item.textContent = company;
            item.addEventListener('click', () => {
                filterPortraitsByCompany(company);
            });
            dropdownContent.appendChild(item);
        });
    };
    
    // Filter portraits by company
    const filterPortraitsByCompany = (company) => {
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
        filterValue.textContent = company === 'all' ? 'All Companies' : company;
        
        // Show/hide reset button
        const resetButton = document.querySelector('.reset-filter');
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
    };
    
    // Find portrait data by ID
    const findPortraitDataById = (id) => {
        return portraitData.find(portrait => portrait.id === id);
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
        // Get the grid container and clear any existing portraits
        const gridContainer = document.getElementById('grid-container');
        const gridPortraits = document.querySelector('.grid-portraits');
        gridPortraits.innerHTML = '';
        
        // Update grid title
        document.querySelector('.grid-title').textContent = `${company} Portraits`;
        
        // Filter portrait data by company and sort alphabetically by name
        const filteredPortraits = portraitData
            .filter(portrait => portrait.company === company)
            .sort((a, b) => a.name.localeCompare(b.name));
        
        // Create a portrait element for each filtered portrait
        filteredPortraits.forEach(portrait => {
            const gridPortrait = document.createElement('div');
            gridPortrait.className = 'grid-portrait';
            gridPortrait.setAttribute('data-id', portrait.id);
            
            const img = document.createElement('img');
            img.src = portrait.image;
            img.alt = portrait.name;
            gridPortrait.appendChild(img);
            
            // Add portrait info (name and company)
            const info = document.createElement('div');
            info.className = 'grid-portrait-info';
            
            const name = document.createElement('div');
            name.className = 'grid-portrait-name';
            name.textContent = portrait.name;
            
            const companyEl = document.createElement('div');
            companyEl.className = 'grid-portrait-company';
            companyEl.textContent = portrait.company;
            
            info.appendChild(name);
            info.appendChild(companyEl);
            gridPortrait.appendChild(info);
            
            // Add debug info if debug mode is enabled
            if (debugMode) {
                // Find this portrait in the flowing portraits to get its layer, size and speed
                const flowPortrait = portraits.find(p => p.element.getAttribute('data-id') == portrait.id);
                
                if (flowPortrait) {
                    const debugInfo = document.createElement('div');
                    debugInfo.className = 'grid-portrait-debug-info';
                    
                    debugInfo.innerHTML = `
                        <div>Layer: ${flowPortrait.layer}</div>
                        <div>Size: ${Math.round(flowPortrait.width)}px</div>
                        <div>Speed: ${flowPortrait.speed.toFixed(2)}px/s</div>
                        <div>Lane: ${flowPortrait.lane}</div>
                    `;
                    gridPortrait.appendChild(debugInfo);
                }
            }
            
            // Add click event
            gridPortrait.addEventListener('click', () => {
                showProfile(portrait);
                // Reset inactivity timer when a portrait is clicked
                resetInactivityTimer();
            });
            
            gridPortraits.appendChild(gridPortrait);
        });
        
        // Show the grid container with fade-in effect
        setTimeout(() => {
            gridContainer.classList.add('active');
            gridViewActive = true;
            
            // Set up mouse movement listener for grid container to reset inactivity timer
            gridContainer.addEventListener('mousemove', resetInactivityTimer);
            gridContainer.addEventListener('click', resetInactivityTimer);
            
            // Add inactivity timer message to inform users
            const timerMessage = document.createElement('div');
            timerMessage.className = 'inactivity-message';
            timerMessage.innerHTML = '<span>Auto-closing in 20s</span>';
            gridContainer.appendChild(timerMessage);
        }, 800); // Delay showing grid to let portraits animate out
        
        // Set up inactivity timer
        resetInactivityTimer();
    };
    
    // Hide grid view and return to flowing portraits
    const hideGridView = () => {
        // Don't do anything if grid view is not active
        if (!gridViewActive) return;
        
        const gridContainer = document.getElementById('grid-container');
        gridContainer.classList.remove('active');
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
            filterPortraitsByCompany('all');
        });
        
        // Set up all companies option
        const allCompaniesItem = document.querySelector('[data-company="all"]');
        allCompaniesItem.addEventListener('click', () => {
            filterPortraitsByCompany('all');
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

    // Initialize portraits and start animation on page load
    initializePortraits();
    initializeSearch();
    animationId = requestAnimationFrame(animate);
});

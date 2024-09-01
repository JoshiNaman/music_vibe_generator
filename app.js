// Note: Replace 'YOUR_UNSPLASH_ACCESS_KEY' with an actual Unsplash API key
const UNSPLASH_ACCESS_KEY = 'J0WujVMsXkgtRqIeLcgAnz1oaJ4ScwMOAXzp3LPuPbI';

const artistNameInput = document.getElementById('artist-name');
const generateBtn = document.getElementById('generate-btn');
const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');
const printLeft = document.querySelector('.print-left');
const printRight = document.querySelector('.print-right');

generateBtn.addEventListener('click', generateDesign);

// Array of predefined artists
const predefinedArtists = ['Billie Eilish', 'Coldplay', 'Dua Lipa', 'Kodaline', 'Ed Sheeran', 'Taylor Swift'];

// Function to filter artists based on input
function filterArtists(input) {
    return predefinedArtists.filter(artist => 
        artist.toLowerCase().includes(input.toLowerCase())
    );
}

// Event listener for input changes
artistNameInput.addEventListener('input', function() {
    const inputValue = this.value;
    const filteredArtists = filterArtists(inputValue);
    
    // Clear existing options
    const datalist = document.getElementById('artist-list');
    datalist.innerHTML = '';
    
    // Add filtered options
    filteredArtists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist;
        datalist.appendChild(option);
    });
});

async function generateDesign() {
    const artistName = artistNameInput.value;
    let query = `${artistName} album cover`;
    if (!artistName) {
        alert('Please enter an artist name');
        return;
    }

    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${artistName}&count=2&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();

        if (data.length >= 2) {
            updateImages(data[0].urls.regular, data[1].urls.regular);
        } else {
            alert('Couldn\'t find enough images. Please try a different artist name.');
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        alert('An error occurred while fetching images. Please try again.');
    }
}

function updateImages(url1, url2) {
    image1.src = url1;
    image2.src = url2;
    printLeft.style.backgroundImage = `url(${url1})`;
    printRight.style.backgroundImage = `url(${url2})`;
}

function createTextFilledImage(text, width = 800, height = 1000, fontSize = 20, fontFamily = 'Arial', textColor = 'black', backgroundColor = 'white') {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Fill background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    // Set text properties
    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = textColor;
    context.textBaseline = 'top';

    // Calculate text metrics
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    // Fill the canvas with text
    for (let y = 0; y < height; y += textHeight * 1.5) {
        for (let x = 0; x < width; x += textWidth) {
            context.fillText(text, x, y);
        }
    }

    // Convert canvas to PNG
    return canvas.toDataURL('image/png');
}

// Function to create and download the image
function createAndDownloadImage() {
    const text = document.getElementById('textInput').value || 'Default Text';
    const dataUrl = createTextFilledImage(text);

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.download = 'text-filled-image.png';
    link.href = dataUrl;
    link.click();
}

// Function to display the image on the page
function displayImage() {
    const text = document.getElementById('textInput').value || 'Default Text';
    const dataUrl = createTextFilledImage(text);

    const img = document.getElementById('generatedImage') || document.createElement('img');
    img.id = 'generatedImage';
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';

    const container = document.getElementById('imageContainer');
    container.innerHTML = '';
    container.appendChild(img);
}

// Add this to your HTML:
// <input type="text" id="textInput" placeholder="Enter text">
// <button onclick="createAndDownloadImage()">Create and Download Image</button>
// <button onclick="displayImage()">Display Image</button>
// <div id="imageContainer"></div>
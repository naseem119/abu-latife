// the images directory
const imgDirectory = '../images/traffic_signs_practical/';

// get the images container
const gallery_box = document.getElementById('gallery-container');

// image name string
let imgNames = 'ps';

// for each image in the directory
for (let i = 1; i < 139; i++) {
    const imageElement = document.createElement('a');
    imageElement.href = imgDirectory + imgNames + i + '.jpg';
    imageElement.setAttribute('data-lightbox', 'gal1');
    const img = document.createElement('img');
    img.setAttribute('src', imageElement.href);
    imageElement.appendChild(img);
    gallery_box.appendChild(imageElement)
}
// js script to automate updating README.md 
require('dotenv').config(); 
const Mustache = require('mustache'); 
const fs = require('fs'); 
const fetch = require('node-fetch'); 

const MUSTACHE_MAIN_TEMPLATE_DIR = './maintemplate.mustache'; 

let DATA = { 
    refreshDate: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
}

async function getApod() {
    await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.APOD_KEY}`)
    .then(res => res.json())
    .then(res => {
        DATA.apodTitle = res.title; 
        DATA.apodDate = res.date; 
        DATA.apodUrl = res.hdurl; 
        DATA.apodDescription = res.explanation; 
    })
}

async function generateReadMe() {
    await fs.readFile(MUSTACHE_MAIN_TEMPLATE_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA); 
        fs.writeFileSync('README.md', output); 
    })
}

async function action() {
    await getApod(); 

    await generateReadMe(); 
}

action(); 


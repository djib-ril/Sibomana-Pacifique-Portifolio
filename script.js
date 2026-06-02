// DOM Elements - Panels & Themes
const form = document.querySelector(".form");
const openPanel = document.querySelector("#panel");
const close = document.querySelector("#close");
const overlay = document.querySelector(".overlay");
const themeBtn = document.querySelector(".sun");

// DOM Elements - Authentication & Administration
const loginForm = document.querySelector('#login'); 
const loginFormTwo = document.querySelector('#login-form'); // Retained if used elsewhere
const myForm = document.querySelector("#myform");
const portifolio = document.querySelector("#portifolio_content");
const adminPanel = document.querySelector('#admin-panel');

// DOM Elements - Forms (Fixed duplicate issue)
const nameInput = document.querySelector('#new-name');
const bioInput = document.querySelector('#new-bio');
const updateForm = document.querySelector('#update-form');

// Toggle Form Visibility Panels
openPanel.addEventListener('click', function(){
    form.style.visibility = "visible";
    overlay.style.visibility = "visible";
});

close.addEventListener('click', function (){
    form.style.visibility = "hidden";
    overlay.style.visibility = "hidden";
});

overlay.addEventListener('click', function (){
    form.style.visibility = "hidden";
    overlay.style.visibility = "hidden";
});

// Theme Switching
themeBtn.addEventListener('click', function(){
    document.body.classList.toggle("light-theme");
    const icon = themeBtn.querySelector("ion-icon");

    if(document.body.classList.contains("light-theme")){
        icon.setAttribute("name","moon-outline");
    } else {
        icon.setAttribute("name","sunny-outline");
    }
});

// Supabase Initialization
const SUPABASE_URL = 'https://preogrthiekiblazdvah.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ww_zrQjtB5Y3BnTm0TWTvQ_RaVYg-9T';

// Note: Ensure the Supabase CDN script is loaded in your HTML before this file runs
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase connection initialized!");

// Login Form Submit Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        alert("Login successful!");
        showAdminPanel(); 
    }
});

// UI View Controller Function
function showAdminPanel() {
    myForm.style.visibility = 'hidden'; 
    adminPanel.style.display = 'block'; 
    portifolio.style.display = "none";
    overlay.style.visibility = "hidden";
    
    // Call the function if defined elsewhere in your file
    if (typeof fetchCurrentData === "function") {
        fetchCurrentData(); 
    }
}

// Update Profile Form Submit Handler (Fixed supabase object call)
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const updatedName = nameInput.value;
    const updatedBio = bioInput.value;

    const { data, error } = await supabaseClient
        .from('profile')
        .upsert({ name: updatedName, bio: updatedBio })
        .eq('id', 1); 

    if (error) {
        alert("Error updating profile: " + error.message);
    } else {
        alert("Changes saved successfully!");
    }
});


// Automatically run this function whenever anyone opens the website
window.addEventListener('DOMContentLoaded', loadPortfolioData);

async function loadPortfolioData() {
    const { data, error } = await supabaseClient
        .from('profile')
        .select('name, bio')
        .order('id', { ascending: false }) // <-- Sorts table so the highest ID (newest) is first
        .limit(1); // <-- Only downloads that single newest row

    if (error) {
        console.error("Error loading portfolio data:", error.message);
        document.querySelector('#portfolio-name').textContent = "Error loading data";
        return;
    }

    if (data && data.length > 0) {
        const profile = data[0]; // This is now safely your newest entry!
        
        document.querySelector('#portfolio-name').textContent = profile.name;
        document.querySelector('#portfolio-bio').textContent = profile.bio;
        
        document.querySelector('#new-name').value = profile.name;
        document.querySelector('#new-bio').value = profile.bio;
    } else {
        document.querySelector('#portfolio-name').textContent = "No Profile Found";
    }
}
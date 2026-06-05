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

// DOM Elements - Forms
const nameInput = document.querySelector('#new-name');
const bioInput = document.querySelector('#new-bio');
const updateForm = document.querySelector('#update-form');

const body = document.querySelector("body");

// Toggle Form Visibility Panels
if (openPanel) {
    openPanel.addEventListener('click', function(){
        form.style.visibility = "visible";
        overlay.style.visibility = "visible";
    });
}

if (close) {
    close.addEventListener('click', function (){
        form.style.visibility = "hidden";
        overlay.style.visibility = "hidden";
    });
}

if (overlay) {
    overlay.addEventListener('click', function (){
        form.style.visibility = "hidden";
        overlay.style.visibility = "hidden";
    });
}

// Theme Switching
if (themeBtn) {
    themeBtn.addEventListener('click', function(){
        document.body.classList.toggle("light-theme");
        const icon = themeBtn.querySelector("ion-icon");

        if(document.body.classList.contains("light-theme")){
            icon.setAttribute("name","moon-outline");
        } else {
            icon.setAttribute("name","sunny-outline");
        }
    });
}

// Supabase Initialization
const SUPABASE_URL = 'https://preogrthiekiblazdvah.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ww_zrQjtB5Y3BnTm0TWTvQ_RaVYg-9T';

// Note: Ensure the Supabase CDN script is loaded in your HTML before this file runs
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase connection initialized!");

// Login Form Submit Handler
if (loginForm) {
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
}

// UI View Controller Function
function showAdminPanel() {
    if (myForm) myForm.style.visibility = 'hidden'; 
    if (adminPanel) adminPanel.style.display = 'block'; 
    if (portifolio) portifolio.style.display = "none";
    if (overlay) overlay.style.visibility = "hidden";

    if (typeof fetchCurrentData === "function") {
        fetchCurrentData(); 
    }
}

// Update Profile Form Submit Handler (Using Upsert to target row 1)
if (updateForm) {
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const updatedName = nameInput.value;
        const updatedBio = bioInput.value;

        const { data, error } = await supabaseClient
            .from('profile')
            .upsert({ id: 1, name: updatedName, bio: updatedBio }); 

        if (error) {
            alert("Error updating profile: " + error.message);
        } else {
            alert("Changes saved successfully!");
        }
    });
}

// Automatically run this function whenever anyone opens the website
window.addEventListener('DOMContentLoaded', loadPortfolioData);

// Fetch Portfolio Data Function
async function loadPortfolioData() {
    const { data, error } = await supabaseClient
        .from('profile')
        .select('name, bio')
        .eq('id', 1); // Safely targets row 1 directly

    if (error) {
        console.error("Error loading portfolio data:", error.message);
        const nameElement = document.querySelector('#portfolio-name');
        if (nameElement) nameElement.textContent = "Error loading data";
        return;
    }

    if (data && data.length > 0) {
        const profile = data[0]; 
        
        const nameElement = document.querySelector('#portfolio-name');
        const bioElement = document.querySelector('#portfolio-bio');
        
        if (nameElement) nameElement.textContent = profile.name;
        if (bioElement) bioElement.textContent = profile.bio;
        
        if (nameInput) nameInput.value = profile.name;
        if (bioInput) bioInput.value = profile.bio;
    } else {
        const nameElement = document.querySelector('#portfolio-name');
        if (nameElement) nameElement.textContent = "No Profile Found";
    }
}

// Logout Action Handler (Protected with Safety Check)
const logOut = document.querySelector("#logout-btn");

if (logOut) {
    logOut.addEventListener('click', function (){
        if (adminPanel) adminPanel.style.display = 'none'; 
        if (portifolio) portifolio.style.display = "block";
    });
}

// Updating the password of the admin (Protected with Safety Checks)
const passwordForm = document.querySelector('#password-form');
const newPasswordInput = document.querySelector('#new-password');

if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const newPassword = newPasswordInput.value;

        // Use Supabase's built-in auth update function
        const { data, error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) {
            alert("Failed to update password: " + error.message);
        } else {
            alert("Password updated successfully! Next time, use your new password.");
            passwordForm.reset(); 
        }
    });
}
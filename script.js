//const form = document.querySelector(".form");
//const openPanel = document.querySelector("#panel");
//const close = document.querySelector("#close");
//const overlay = document.querySelector(".overlay")

//openPanel.addEventListener('click', function(){
 //   form.style.visibility = "visible";
  //  overlay.style.visibility = "visible";
//})

//close.addEventListener('click', function (){
//    form.style.visibility = "hidden";
 //   overlay.style.visibility = "hidden";
//})

const form = document.querySelector(".form");
const openPanel = document.querySelector("#panel");
const close = document.querySelector("#close");

const overlay = document.querySelector(".overlay");
const themeBtn = document.querySelector(".sun");

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

themeBtn.addEventListener('click', function(){
    document.body.classList.toggle("light-theme");

    const icon = themeBtn.querySelector("ion-icon");

    if(document.body.classList.contains("light-theme")){
        icon.setAttribute("name","moon-outline");
    }else{
        icon.setAttribute("name","sunny-outline");
    }
});

// Replace these with your actual Supabase details
const SUPABASE_URL = 'https://preogrthiekiblazdvah.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Ww_zrQjtB5Y3BnTm0TWTvQ_RaVYg-9T'

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log("Supabase connection initialized!")


// Select your form from the HTML
const loginForm = document.querySelector('#login'); 
const loginFormTwo = document.querySelector('#login-form'); 
const myForm = document.querySelector("#myform");
const portifolio = document.querySelector("#portifolio_content");
const adminPanel = document.querySelector('#admin-panel');
const nameInput = document.querySelector('#new-name');
const bioInput = document.querySelector('#new-bio');

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
        // Here we will eventually show the "Manage Data" section
        showAdminPanel(); 
    }
});

//Kwinjira muri page ya dongo nahishe hano

// Function to toggle the UI visibility
function showAdminPanel() {
    myForm.style.visibility = 'hidden';   // Hide login form
    adminPanel.style.display = 'block'; // Show admin panel
    portifolio.style.display = "none";
    overlay.style.visibility = "hidden"
    
    // Optional: Fetch current data to pre-fill the inputs (we will build this next)
    fetchCurrentData(); 
}

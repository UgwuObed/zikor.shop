<template>
  <div class="landing-page">
    <div class="header">
      <div class="zikor-logo">
        <img src="../assets/zikor-logo.png" alt="Logo" style="width: 50px; height: 60px;">
      </div>
      <div class="hamburger-menu" v-if="isMobile">
        <template v-if="!showMenu">
          <button @click="toggleMenu">☰</button>
        </template>
        </div>
        </div>

     <div v-if="showMenu" class="navigation">
      <ul class="menu-list">
    <li class="menu-item close-menu">
      <button @click="toggleMenu">
        <img src="../assets/close-icon.png" alt="Close Menu">
      </button>
    </li>
        <li class="menu-item" style="font-weight: bold;">Chat Zikor</li>
        <br>
        <li class="menu-item" style="font-weight: bold;">Shop</li>
        <li class="menu-item"><img src="../assets/upload-icon.png" alt="Upload"> Upload</li>
        <li class="menu-item"><img src="../assets/user-icon.png" alt="User"> Zikor</li>
        <li class="menu-item"><img src="../assets/money-icon.png" alt="Money"> Payment</li>
        <li class="menu-item"><img src="../assets/handshake-icon.png" alt="Handshake"> Negotiate</li>
        <br>
        <li class="menu-item" style="font-weight: bold;">Pricing</li>
        <br>
        <li class="menu-item" style="font-weight: bold;">More</li>
        <li class="menu-item"><img src="../assets/info-icon.png" alt="Info"> About Zikor</li>
        <li class="menu-item"><img src="../assets/newspaper-icon.png" alt="Newspaper"> Blog</li>
        <li class="menu-item"><img src="../assets/question-icon.png" alt="Question"> FAQ</li>

    <div class="buttons">
    <router-link to="/sign-up">
     <button class="signup-button">Sign Up</button>
   </router-link>

   <router-link to="/login">
    <button class="login-button">Login</button>
    </router-link>
  </div>
      </ul>

    </div>

<div class="advantage-container">
    <div class="advantage-item" :class="{ 'active': currentIndex === index }" v-for="(advantage, index) in visibleAdvantages" :key="index">
            <p>{{ advantage }}</p>
     
    </div>
  </div>

    <div class="content">
      <div class="centered-text">
        <h1>Start Selling with</h1>
        <h2>a whole new groove!<br>🚀💼</h2>
        <p>
          Zikor brings you a <span class="highlight-animation" :class="{ typing_out: isTypingOut, typing_in: isTypingIn }">cutting-edge</span> chat technology commerce platform, transforming the way you do business.
        </p>
      </div>
    <div class="button-container">

    <router-link to="/sign-up">
     <button class="button button1">Start Now</button>
   </router-link>
            
            <button class="button button2">About</button>
        </div>
    </div>
     <div class="trusted-section">
    <h2>Trusted by</h2>
    <div class="logos-container">
       <div class="logo"><img src="../assets/logo-1.png" alt="Logo 1"></div>
        <div class="logo"><img src="../assets/logo-2.png" alt="Logo 2"></div>
        <div class="logo"><img src="../assets/logo-3.png" alt="Logo 3"></div>
        <div class="logo"><img src="../assets/logo-4.png" alt="Logo 4"></div>
        <div class="logo"><img src="../assets/logo-5.png" alt="Logo 5"></div>
        <div class="logo"><img src="../assets/logo-6.png" alt="Logo 6"></div>
    </div>
  </div>
  <div class="big-image">
  <img src="../assets/zikbig.png" alt="Additional Image">
 </div>

 <div class="why-choose-section">
  <h2>Why Choose Zikor</h2>
  <div class="why-choose-grid">
    <div class="why-choose-item">
      <div class="why-choose-card">
        <h3>Smart Selling, Simplified</h3>
        <p>Experience a seamless and efficient way to sell your products with Zikor’s smart tools.</p>
      </div>
    </div>
    <div class="why-choose-item">
      <div class="why-choose-card">
        <h3>Negotiate Like a Pro 🤝💰</h3>
        <p>Leverage powerful negotiation features to get the best deals for your business.</p>
      </div>
    </div>
    <div class="why-choose-item">
      <div class="why-choose-card">
        <h3>Secure and Swift Transactions 💳✨</h3>
        <p>Enjoy fast and secure payments with our robust transaction system.</p>
      </div>
    </div>
  </div>
</div>


<div class="advantage-section">
  <h2>The Zikor Advantage</h2>
  <div class="advantage-container">
      <img src="../assets/vid.png" alt="Additional Image">
  </div> <br>
</div>
<div class="about-card">
  <div class="about-logo">
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2 4.5C2 3.67157 2.67157 3 3.5 3H20.5C21.3284 3 22 3.67157 22 4.5V19.5C22 20.3284 21.3284 21 20.5 21H3.5C2.67157 21 2 20.3284 2 19.5V4.5ZM5 6V8H19V6H5ZM5 10V12H19V10H5ZM5 14V16H15V14H5Z" fill="#FFCF00"/>
    </svg>
  </div>
  <div class="about-content">
    <h3 class="about-title">About Zikor</h3>
    <p class="about-description">Discover the story behind Zikor – our mission, values, and the team dedicated to revolutionizing online commerce.</p>
  </div>
</div>

<div class="faq-card">
  <div class="faq-logo">
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 5.58 2 10.5C2 13.41 3.64 16.07 6.22 17.68L5.08 21.33C5.02 21.54 5.11 21.75 5.3 21.86C5.38 21.91 5.47 21.93 5.55 21.93C5.68 21.93 5.81 21.89 5.91 21.79L10.3 17.77C10.87 17.92 11.43 18 12 18C17.52 18 22 14.42 22 9.5C22 4.58 17.52 2 12 2ZM12 16C11.46 16 10.92 15.91 10.41 15.73L9.92 15.54L7.57 17.28L8.22 15.02L7.66 14.67C5.86 13.55 5 11.98 5 10.5C5 7.42 8.58 5 12 5C15.42 5 19 7.42 19 10.5C19 13.58 15.42 16 12 16ZM11 9H13V10.59L14.59 12L13 13.41V15H11V12.59L12.59 11L11 9Z" fill="#FFCF00"/>
    </svg>
  </div>
  <div class="faq-content">
    <h3 class="faq-title">FAQ</h3>
    <p class="faq-description">Find answers to common questions and get the assistance you need with Zikor's FAQ section.</p>
  </div>
</div>

 <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <p class="footer-text">
          Join the community of sellers who've embraced a new way to connect with buyers and close deals effortlessly.
        </p>
        <router-link to="/sign-up">
        <button class="get-started-button">Get Started</button>
        </router-link>
        <div class="app-icons">
         <img src="@/assets/app-store.png" alt="Play Store Icon" class="app-icon">
          <img src="@/assets/google-play.png" alt="App Store Icon" class="app-icon">
          <span class="coming-soon-text">App Coming Soon</span>
        </div>
      </div>
      <div class="footer-right">
    <div class="quick-links">
      <h4 class="quick-links-title">Quick Links</h4>
      <ul>
        <li><a href="#" class="link">Blog</a></li>
        <li><a href="#" class="link">About Zikor</a></li>
        <li><a href="#" class="link">FAQ</a></li>
        <li><a href="#" class="link">Contact Us</a></li>
      </ul>
    </div>
        <div class="social-media">
          <h4 class="social-media-title">Connect with Us:</h4>
          <div class="social-media-icons">
            <img src="@/assets/x.png" alt="Social Media Icon">
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="copyright">Copyright © 2024 Zikor. All rights reserved.</p>
      <nav class="footer-nav">
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Cookie Policy</a>
      </nav>
    </div>
  </footer>


</div>
</template>

<script>
export default {
  data() {
    return {
      isMobile: false,
      highlightText: "cutting-edge",
      isTypingOut: false,
      isTypingIn: false,
      currentIndex: 0,
      advantages: [
        "🚀 Innovation at Your Fingertips: Experience a new era in online selling.",
        "🌐 Anytime, Anywhere: Manage your shop and connect with buyers on-the-go.",
        "🛍️ Your Shop, Your Rules: Tailor your storefront, and let the chatbot handle the rest."
      ],

      showMenu: false
    };
  },
  mounted() {
    this.isMobile = window.innerWidth <= 600;
    this.startTypingAnimation();
    window.addEventListener('resize', this.updateIsMobile);
    
    setInterval(() => {
      this.showNextAdvantage();
    }, 5000);
  },
  methods: {
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 600;
    },
    startTypingAnimation() {
      this.typeText();
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    typeText() {
      // Animation logic
    },
    showNextAdvantage() {
      if (!this.advantages || this.advantages.length === 0) {
        return;
      }

      if (this.currentIndex < this.advantages.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    }
  },
  computed: {
    visibleAdvantages() {
      return [this.advantages[this.currentIndex]];
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateIsMobile);
  }
};
</script>





  
<style scoped>

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(151, 150, 150, 0.2);
}

.zikor-logo {
    height: 40px;
    margin-left: -6%;
}


.hamburger-menu button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.content {
  margin-top: 100px; 
}

.centered-text {
  text-align: center; 
}

.highlight-animation {
  background-color: #5E17EB;
  color: white;
}

.typing_out,
.typing_in {
  
  animation: typing 0.30s ease-in-out forwards;
}

.button-container {
  align-items: center;

}

.button {
  margin-bottom: 10px; 
  padding: 10px 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 200px;
}

.button1 {
  background-color: #5E17EB;
  color: white;
}

.button2 {
  background-color: white;
  color: #000000;
  border: 2px solid #5E17EB;
}

.trusted-section {
  text-align: center;
}

.logos-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  overflow: hidden; 
}

.logo {
  width: 160px; 
  height: 90px;
}

.logo img {
  max-width: 180%; 
}

.logo {
  animation: moveLogo 5s linear infinite; 
}

@keyframes moveLogo {
  0% {
    transform: translateX(-100%); 
  }
  100% {
    transform: translateX(100%); 
  }
}


.why-choose-section {
  text-align: center;
  padding: 20px;
}

.why-choose-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;
  margin-top: 20px;
}

.why-choose-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.why-choose-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 100%;
}

.why-choose-card h3 {
  margin-top: 0;
  color: #333;
}

.why-choose-card p {
  margin-bottom: 0;
  color: #555;
}


.zikor-advantage img {
  height: 300px;  
}

.advantage-section {
  text-align: center;
}

.advantage ul {
  display: inline-block;
  list-style-type: none;
  padding-left: 0;
}

.advantage li {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.advantage li.show {
  opacity: 1;
}

.advantage-section .zikor-advantage ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  padding: 0;
}

.advantage-section .zikor-advantage ul li {
  width: 300px; 
  margin-right: 20px;
  list-style-type: none;
}

.blog-card, .about-card, .faq-card {
  background-color: rgba(255, 199, 0, 0.15); 
  padding: 20px;
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
  border-radius: 10px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  margin-bottom: 20px; 
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}


.blog-card:hover, .about-card:hover, .faq-card:hover {
  transform: translateY(-5px); 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); 
}


.blog-title, .about-title, .faq-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333; 
  margin-bottom: 10px;
}

.blog-description, .about-description, .faq-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #555; 
  margin-bottom: 0;
}

/* Optional Icon or Logo Styles */
.blog-logo, .about-logo, .faq-logo {
  width: 50px;
  height: 50px;
  margin-bottom: 10px; 
  border-radius: 50%; 
}

@media (min-width: 768px) {
  .blog-card, .about-card, .faq-card {
    flex-direction: row; 
    align-items: center;
  }

  .blog-logo, .about-logo, .faq-logo {
    margin-right: 20px; 
    margin-bottom: 0; 
  }

  .blog-content, .about-content, .faq-content {
    flex: 1; 
  }
}


.footer {
  background-color: #5E17EB;
  color: white;
  padding: 50px 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.footer-left {
  max-width: 50%;
}

.footer-text {
  margin-bottom: 20px;
}

.get-started-button {
  background-color: white;
  color: #5E17EB;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.app-icons {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.coming-soon-text {
  font-style: italic;
}

.footer-right {
  max-width: 50%;
}

.quick-links-title,
.social-media-title {
  margin-bottom: 10px;
}



.footer-bottom {
  margin-top: 50px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-nav a {
  color: white;
  text-decoration: none;
  margin-right: 10px;
}

.footer-nav a:hover {
  text-decoration: underline;
}

.quick-links ul {
  list-style-type: none;
  padding: 0;
}

.quick-links ul li {
  margin-bottom: 10px;
}

.quick-links ul li a {
  color: white;
  text-decoration: none;
}

.quick-links ul li a:hover {
  text-decoration: underline;
}


@media only screen and (max-width: 600px) {

.landing-page {
  max-width: 1000px; 
  margin: 0 auto; 
  overflow-x: hidden;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.zikor-logo {
    align-self: flex-start; 
}

  .zikor-logo img {
    height: 35px;
    margin-top: 0;
  }

  .hamburger-menu {
    padding: -100px; 
  }

  .hamburger-menu button {
    font-size: 25px; 
  }

.content {
  margin-top: 10px; 
  align-items: center;
}

.centered-text {
  text-align: center; 
  font-family: 'Poppins-ExtraLight';
  font-size: 22px; 
  color: #000000;
  line-height: 2.2; 
 }

.centered-text h2 {
  font-size: 25px;
  color: #000000;
  font-family: 'Poppins-Bold';
  margin-top: -48px; 
  text-align: center;
}

.centered-text p {
  font-size: 14px;
  font-family: 'Poppins';
  line-height: 1.5; 
  margin: 0 auto; 
  max-width: 90%;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  margin-bottom: 10px; 
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 200px;
}

.button1 {
  background-color: #5E17EB;
  color: white;
}

.button2 {
  background-color: white;
  color: #000000;
  border: 1px solid #5E17EB;
}

.trusted-section {
  text-align: center;
}

.trusted-section h2{
    color: #000000;
    font-size: 14px;
    font-family: 'Poppins';
}

.logos-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  overflow: hidden; 
}

.logo {
  width: 100px; 
}

.logo img {
  max-width: 100%; 
}

.logo {
  animation: moveLogo 5s linear infinite; 
}

@keyframes moveLogo {
  0% {
    transform: translateX(-100%); 
  }
  100% {
    transform: translateX(100%); 
  }
}

.big-image {
  align-items: center;
  justify-content: center;

}

.big-image img {
align-items: center;
}


.why-choose-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;
}


.why-choose-item ul {
  white-space: nowrap;
}

.zikor-advantage img {
  height: 300px;  
}

.advantage-section {
  text-align: center;
}

.advantage ul {
  display: inline-block;
  list-style-type: none;
  padding-left: 0;
}

.advantage li {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  list-style-type: none;
}

.advantage li.show {
  opacity: 1;
}

.advantage-section .zikor-advantage ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  padding: 0;
}



.why-choose-item-text {
    white-space: nowrap;
}

.blog-card {
  background-color: rgba(255, 199, 0, 0.15); 
  padding: 20px;
  display: flex;
  align-items: center;
}

.blog-logo {
  width: 50px; 
  height: 50px;
  right: 80px;
  margin-top: -130px;
}

.blog-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.blog-description {
  font-size: 1rem;
  line-height: 1.4;
}

.about-card {
  background-color: rgba(255, 199, 0, 0.15);
  padding: 20px;
  display: flex;
  align-items: center;
}

.about-logo {
  width: 50px; 
  height: 50px;
  margin-right: 20px;
}

.about-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.about-description {
  font-size: 1rem;
  line-height: 1.4;
}

.faq-card {
  background-color: rgba(255, 199, 0, 0.15);  
  display: flex;
  align-items: center;
}

.faq-logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

.faq-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.faq-description {
  font-size: 1rem;
  line-height: 1.4;
}

.advantage-item p{
  background-color: rgba(255, 129, 0, 0.18); 
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.footer {
  background-color: #5E17EB;
  color: white;
  padding: 50px 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.footer-left {
  max-width: 50%;
}

.footer-text {
  margin-bottom: 20px;
}

.get-started-button {
  background-color: white;
  color: #5E17EB;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.app-icons {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.coming-soon-text {
  font-style: italic;
}

.footer-right {
  max-width: 50%;
}

.quick-links-title,
.social-media-title {
  margin-bottom: 10px;

}


.footer-bottom {
  margin-top: 50px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-nav a {
  color: white;
  text-decoration: none;
  margin-right: 10px;
}

.footer-nav a:hover {
  text-decoration: underline;
}

.quick-links ul {
  list-style-type: none;
  padding: 0;
}

.quick-links ul li {
  margin-bottom: 10px;
}

.quick-links ul li a {
  color: white;
  text-decoration: none;
}

.quick-links ul li a:hover {
  text-decoration: underline;
}

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color:  #FAF9FF;
  z-index: 999;
  display: flex;
  transition: opacity 8.8s ease-in-out;
}

.navigation.hidden {
  opacity: 0;
  pointer-events: none;
}

.menu-list {
  list-style: none;
  padding: 20px;
}

.menu-item {
  font-size: 18px;
  text-align: left;
  cursor: pointer;
  transition: background-color 1.3s ease-in-out;
  display: flex; 
  align-items: center;
}

.menu-item button,
.menu-item img {
  padding: 5px;
  width: 30px;
}

.menu-item:hover {
  background-color: rgba(255, 129, 0, 0.18); 
}

.close-menu {
  position: absolute;
  top: 10px;
  right: 10px;
}

.close-menu button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.close-menu img {
  width: 20px; 
}

.close-menu button:hover img {
  filter: brightness(0.8); 
}


.buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end; 
  margin-left: 60px; 
  text-align: center;
}

.signup-button, .login-button {
  margin-top: 10px;
  padding: 15px 80px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

}

.signup-button {
  background-color: #5E17EB;
  color: #fff;
}

.login-button {
  background-color: #fff;
  border: 1px solid #5E17EB;
  padding: 15px 88px;
  color: #000;
}

.login-button:hover {
  background-color: #5E17EB;
  color: #fff;
}


}
</style>
  
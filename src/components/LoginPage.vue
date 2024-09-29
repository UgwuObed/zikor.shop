<template>
  <div class="login-workflow">
   <div v-if="isLoading" class="loading-overlay">
    <img src="../assets/loading.gif" alt="Loading">
  </div>
    <div v-if="currentStep === 'login'" class="login-form">
      <div class="zikor-logo">
        <img src="../assets/zikor-logo.png" alt="Logo">
      </div>
      <h2>Login</h2>
      <p>Welcome Back.</p>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" @blur="checkEmail">
        <p v-if="emailTouched && !email" class="error-message">Please provide your email</p>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" @blur="checkPassword">
        <p v-if="passwordTouched && !password" class="error-message">Please enter your password</p>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button @click="submitLogin">Login</button>
      <p>Don't have an account? <a href="#" @click="signUp">Sign Up</a></p>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import { BASE_URL } from '../config';

export default {
  data() {
    return {
      // Login form data
      email: '',
      password: '',

      // Step management
      currentStep: 'login',

      // Validation flags for input fields
      emailTouched: false,
      passwordTouched: false,

      // Error message
      errorMessage: '',

      isLoading: false,
    };
  },
  methods: {
    routeExists(route) {
      return this.$router.options.routes.some(r => r.path === route);
    },

    signUp() {
      this.$router.push('/sign-up');
    },

    validateLogin() {
      return this.email && this.password;
    },

    submitLogin() {
  this.isLoading = true;

  if (this.validateLogin()) {
    const formData = {
      email: this.email,
      password: this.password,
    };

    axios.post(`${BASE_URL}/api/login`, formData)
      .then(response => {
        this.handleLoginSuccess(response.data);
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Login failed:', error);

        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'An error occurred while processing your request. Please try again later.';
        }

        this.isLoading = false;
      });
  } else {
    this.errorMessage = 'Please fill in all fields.';
    this.isLoading = false;
  }
},

handleLoginSuccess(data) {
  // Store the token in localStorage
  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('isAuthenticated', true);

  // Navigate to the account page directly
  this.$router.push('/home');
},
    checkEmail() {
      this.emailTouched = true;
    },

    checkPassword() {
      this.passwordTouched = true;
    },
  },
};
</script>




<style scoped>

@media only screen and (max-width: 600px) {
.login-form {
  text-align: center;
  margin: 0 auto;
  max-width: 400px; 
  overflow-x: hidden;
  font-family: 'Poppins';
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
  margin-left: 10px;
}

label {
  display: block; 
}

.error-message {
  color: red;
  margin-top: 5px;
}

input[type="email"],
input[type="password"] {
  width: 90%;
  height: 40px; 
  border: 1px solid #5E17EB;
  background-color: white;
  border-radius: 5px;
  outline: none;
  font-size: 16px !important; 
  -webkit-user-select: text !important;
}

  button {
    padding: 20px 40px;
    background-color: #5E17EB;
    color: white;
    border: none;
    border-radius: 5px;
    width: 50%;
    height: 35px;
    align-item: center;
    line-height: 2px;
    font-family: 'Poppins-Bold';
    font-size: 13px;
  }

  .zikor-logo {
    align-self: flex-start; 
    margin-right: 290px;
    }

  .zikor-logo img {
    height: 35px;
    margin-top: 0;
  }

.error-message {
  color: red;
  margin-top: 5px;
 }

 .location p{
 font-size: 14px;
 }

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-overlay {
  max-width: 100%;
  max-height: 100%;
}

}
</style>

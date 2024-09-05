<template>
  <div class="signup-workflow">
  <div v-if="isLoading" class="loading-overlay">
    <img src="../assets/loading.gif" alt="Loading">
  </div>
    <div v-if="currentStep === 'signup'" class="signup-form">
        <div class="zikor-logo">
      <img src="../assets/zikor-logo.png" alt="Logo">
    </div>
    <h2>Sign Up</h2>
    <p>Let's kickstart your journey by creating your account.</p>
    <div class="form-group">
      <label for="first-name">First Name</label>
      <input type="text" id="first-name" v-model="first_name" @blur="checkFirstName">
    <p v-if="firstNameTouched && !first_name" class="error-message">First name cannot be empty</p>
    </div>
    <div class="form-group">
      <label for="last-name">Last Name</label>
      <input type="text" id="last-name" v-model="last_name" @blur="checkLastName">
      <p v-if="lastNameTouched && !last_name" class="error-message">Last name connot be empty</p>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" @blur="checkEmail">
      <p v-if="emailTouched && !email" class="error-message">Please provied email</p>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" @blur="checkPassword">
      <p v-if="passwordTouched && !password" class="error-message">Please enter your password</p>
    </div>
    <div class="form-group">
  <label for="password_confirmation">Confirm Password</label>
  <input type="password" id="password_confirmation" v-model="password_confirmation">
  <p v-if="passwordConfirmationTouched && !password_confirmation" class="error-message">Please confirm your password</p>
</div>
      <button @click="submitSignup">Sign Up</button>
      <p>Already have an account? <router-link to="/login">Sign In</router-link></p>
    </div>

    <div v-if="currentStep === 'business-setup'" class="setup-business-page">
 <div class="back-button" @click="goBack">
        <!-- SVG icon code -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="back-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>
      
    <h2>Set Up Business Page</h2>
    <p>Create your business page now to seize new opportunities.</p>
    <div class="form-group">
      <label for="business-name">Business Name</label>
      <input type="text" id="business-name" v-model="business_name" @blur="checkBusinessName">
      <p v-if="businessNameTouched && !business_name" class="error-message">Please enter your business name</p>
    </div>
    <div class="form-group">
      <label for="phone">Phone - Preferable WhatsApp</label>
      <input type="tel" id="phone" v-model="phone" @blur="checkPhone">
      <p v-if="phoneTouched && !phone" class="error-message">Please enter your phone number</p>
    </div>
    <div class="location">
    <h4>Business Location</h4>
    <p>Make sure your location is set correctly to improve your sales around you.</p>
    </div>
    <div class="form-group">
      <label for="country">Country</label>
      <input type="text" id="country" v-model="country" @blur="checkCountry">
      <p v-if="countryTouched && !country" class="error-message">Please enter country</p>
    </div>
    <div class="form-group">
      <label for="state">State</label>
      <input type="text" id="state" v-model="state" @blur="checkState">
      <p v-if="stateTouched && !state" class="error-message">Please enter state</p>
    </div>
    <div class="form-group">
      <label for="city">City</label>
      <input type="text" id="city" v-model="city" @blur="checkCity">
      <p v-if="cityTouched && !city" class="error-message">Please enter your city</p>
    </div>
        <div class="form-group">
        <label>Is your business registered with CAC?</label>
        <div class="radio-group">
          <label>
            <input type="radio" value="true" v-model="is_cac_registered">
            Yes
          </label>
          <label>
            <input type="radio" value="false" v-model="is_cac_registered">
            No
          </label>
        </div>
      </div>
        <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
      <button @click="submitForms">Continue</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '../config';

export default {
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '', 
      business_name: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      is_cac_registered: '',
      currentStep: 'signup',
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    goBack() {
      this.currentStep = 'signup';
    },
    routeExists(route) {
      return this.$router.options.routes.some(r => r.path === route);
    },
    logout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/login');
    },
  
    validateSignup() {
      return (
        this.first_name &&
        this.last_name &&
        this.email &&
        this.password
      );
    },
    submitSignup() {
      if (this.validateSignup()) {
        this.currentStep = 'business-setup';
      }
    },
    prepareFormData() {
      return {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        business_name: this.business_name,
        phone: this.phone,
        country: this.country,
        state: this.state,
        city: this.city,
        is_cac_registered: this.is_cac_registered === 'true',
      };
    },
    validateBusinessSetup() {
      return (
        this.business_name &&
        this.phone &&
        this.country &&
        this.state &&
        this.city
      );
    },
    submitForms() {
      this.isLoading = true;
      this.errorMessage = '';

      if (this.validateSignup() && this.validateBusinessSetup()) {
        const formData = this.prepareFormData();

        axios.post(`${BASE_URL}/api/register`, formData)
          .then(response => {
            const { token } = response.data;

            
            localStorage.setItem('accessToken', token);

            this.$router.push('/account');
            this.isLoading = false;
          })
          .catch(error => {
            console.error('Registration failed:', error);


            if (error.response && error.response.data && error.response.data.errors) {
              console.log('Error response:', error.response.data); 
              const errors = error.response.data.errors;
              this.errorMessage = errors[Object.keys(errors)[0]][0];
            } else {
              this.errorMessage = 'An error occurred while processing your request. Please try again later.';
            }
            this.isLoading = false;
          });
      }
    },
  },
};
</script>

<style scoped>

@media only screen and (max-width: 600px) {
.signup-form {
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

.zikor-logo {

    align-self: flex-start; 
    margin-right: 290px;
   }

  .zikor-logo img {
    height: 65px;
    margin-top: 0;
    margin-right: 290px;
  }

.error-message {
  color: red;
  margin-top: 5px;
}

.setup-business-page {
  text-align: center;
  margin: 0 auto;
  max-width: 400px; 
  overflow-x: hidden;
  font-family: 'Poppins';
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"] {
  width: 90%;
  height: 38px; 
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

.error-message {
  color: red;
  margin-top: 5px;
 }

 .location p{
 font-size: 14px;
 }

.back-button {
  display: inline-flex; 
  align-items: center; 
  text-decoration: none; 
  color: #5E17EB; 
  font-weight: bold;
}

.back-icon {
  width: 24px;
  height: 24px;
  margin-right: 340px;
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
.radio-group {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.radio-group label {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 14px;
}

.radio-group input {
  margin-right: 9px;
  color: #5E17EB; 
}

.radio-group input[type="radio"]:checked + label::before {
  border-color: #5E17EB; 
  background-color: #5E17EB; 
}
.loading-overlay {
  max-width: 100%;
  max-height: 100%;
}

}
</style>

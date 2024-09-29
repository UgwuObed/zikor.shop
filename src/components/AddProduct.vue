<template>
  <div class="add-product">
    <form @submit.prevent="uploadProduct" v-if="currentStep === 'step1'">
      <h3>Add Product</h3>
      <div class="form-group">
        <input type="text" id="product-name" v-model="name" placeholder="Product Name">
        <!-- Error message for name -->
        <div class="error-message error-red" v-if="errorMessage && !name">Please enter a product name.</div>
      </div>

      <div class="form-group">
        <input type="number" id="product-price" v-model="main_price" placeholder="Product Price(No comma)">
        <!-- Error message for main_price -->
        <div class="error-message error-red" v-if="errorMessage && !main_price">Please enter a product price.</div>
      </div>

       <div class="form-group">
        <input type="number" id="discount-price" v-model="discount_price" placeholder="Discount Price(No comma)(Optional)">
        <div class="error-message error-red" v-if="validateDiscountPrice">
         Discount should be lower than the main price.
        </div>
      </div>


      <div class="discount-note">
        <span class="note-label">Note:</span>
        <br>
        <span class="note-text">
          Set a discount price to help our bot negotiate and 
          increase your chances of closing deals faster!
        </span>

      </div>

      <div class="form-group">
        <input type="number" id="quantity" v-model="quantity" placeholder="Quantity (Optional)">
      </div>

      <div class="form-group">
        <select id="category" v-model="selectedCategory">
            <option disabled value="">Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
            </option>
        </select>
        <!-- Error message for selectedCategory -->
        <div class="error-message error-red" v-if="errorMessage && !selectedCategory">Please select a category.</div>
      </div>

      <!-- Display general error message -->
      <div class="error-message error-red" v-if="errorMessage">{{ errorMessage }}</div>

      <button type="button" :disabled="validateDiscountPrice" @click="nextStep">Next</button>
    </form>

    <div v-else-if="currentStep === 'step2'">
      <h3>Add Image</h3>
      <p v-if="!image">Click to add an image</p>
      <p v-if="image">Image selected</p>
            <!-- Error message for image -->
        <div class="error-message error-red" v-if="errorMessage && !image">Please select an image.</div>
      <div class="image-upload">
        <label for="product-image" class="image-upload-label" @click="$refs.fileInput.click">
          <input type="file" id="image" ref="fileInput" @change="handleImageChange" class="image-upload-input">
          <div class="image-upload-icon"></div> 
        </label>
      </div>

      <div class="form-group">
        <label for="product-description">Product Description (Optional)</label>
        <textarea id="product-description" v-model="description" class="description-input"></textarea>
      </div>

      <button @click="uploadProduct" class="upload-button" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Upload</span>
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '../config';
import router from '../router';

export default {
  data() {
    return {
      currentStep: 'step1',
      name: '',
      main_price: '',
      discount_price: '',
      quantity: '',
      selectedCategory: '',
      categories: [],
      image: null,
      description: '',
      errorMessage: '',
      loading: false, 
    };
  },

  computed: {
    validateDiscountPrice() {
      return parseFloat(this.discount_price) >= parseFloat(this.main_price) && this.discount_price !== '';
    },
  },

  methods: {
    async nextStep() {
      this.currentStep = 'step2';
    },
    prevStep() {
      this.currentStep = 'step1';
    },
    async fetchCategories() {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
        };

        try {
          const response = await axios.get(`${BASE_URL}/api/categories`, { headers });
          this.categories = response.data.categories;
        } catch (error) {
          console.error('Error fetching categories:', error);
          this.errorMessage = 'Failed to fetch categories. Please try again later.';
        }
      } else {
        console.error('Access token not found in localStorage.');
        this.errorMessage = 'Access token not found. Please log in again.';
      }
    },
    handleImageChange(event) {
      this.image = event.target.files[0];
      this.$refs.fileInput.click();
    },
    async uploadProduct() {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        };

        if (!this.name || !this.main_price || !this.quantity || !this.selectedCategory || !this.image) {
          this.errorMessage = 'Please fill in all required fields.';
          return;
        }

        this.loading = true; 

        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('main_price', this.main_price);
        formData.append('discount_price', this.discount_price);
        formData.append('quantity', this.quantity);
        formData.append('category_id', this.selectedCategory);
        formData.append('description', this.description);
        formData.append('image', this.image);

        try {
          const response = await axios.post(`${BASE_URL}/api/products`, formData, { headers });
          console.log('Product uploaded successfully:', response.data);

          router.push({ name: 'ProductUploaded' });

          this.resetForm();
        } catch (error) {
          console.error('Error uploading product:', error);
          this.errorMessage = 'Failed to upload product. Please try again later.';
        } finally {
          this.loading = false;
        }
      } else {
        console.error('Access token not found in localStorage.');
        this.errorMessage = 'Access token not found. Please log in again.';
      }
    },
    resetForm() {
      this.currentStep = 'step1';
      this.name = '';
      this.main_price = '';
      this.discount_price = '';
      this.quantity = '';
      this.selectedCategory = '';
      this.image = null;
      this.description = '';
      this.errorMessage = '';
    },
  },
  created() {
    this.fetchCategories();
  },
};
</script>

<style scoped>

@media only screen and (max-width: 600px) {
.add-product {
  margin: 0 auto;
  max-width: 400px; 
  overflow-x: hidden;
  font-family: 'Poppins';
}

.form-group {
  margin-bottom: 40px;
}

input[type="text"],
input[type="number"],
textarea {
  width: 90%;
  padding: 10px;
  border: 1px solid #5E17EB;
  background-color: white;
  border-radius: 5px;
  height: 25px;
  outline: none;
  font-size: 16px !important; 
  -webkit-user-select: text !important;
}

select {
  width: 95%;
  padding: 10px;
  border: 1px solid #5E17EB;
  background-color: white;
  border-radius: 5px;
  height: 45px;
  outline: none;
  color: black;
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
    font-family: 'Poppins';
    font-size: 16px;
}

.discount-note {
  margin-bottom: 20px; 
  margin-top: -30px;
  background-color: #ffe6e6;
  width: 90%; 
  padding: 10px; 
  border-radius: 5px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  margin-left: 10px;
}

.note-label {
  color: red;
  font-weight: bold; 
  margin-right: 290px;
}

.note-text {
  margin-left: 10px;
  text-align: left; 
  font-size: 14px;
}

.image-upload {
  position: relative;
  display: inline-block;
}

.image-upload-label {
  display: block;
  width: 120px; 
  height: 120px; 
  border: 2px dashed #5E17EB; 
  border-radius: 8px; 
  text-align: center; 
  cursor: pointer; 
}

.image-upload-input {
  display: none; 
}

.image-upload-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: 2px solid #5E17EB;
  border-radius: 50%; 
}

.image-upload-icon::after {
  content: '+';
  font-size: 24px;
  line-height: 40px; 
}


.description-input {
  width: 90%; 
  height: 150px; 
  padding: 10px; 
  border: 1px solid #5E17EB;
  border-radius: 8px;  
  resize: none; 
  margin-bottom: 10px; 
}

.upload-button {
  padding: 10px 20px;
  background-color: #5E17EB; 
  color: #fff; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
}

.error-red {
  color: red;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border-left-color: #FAF9FF;
  animation: spin 1s ease infinite;
  display: inline-block;
  vertical-align: middle;
  margin-top: -4px; 
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


 }
</style>

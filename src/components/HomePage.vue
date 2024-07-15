<template>
    <div class="sidebar">
       <div class="hamburger-menu" @click="toggleMenu">
        <p v-if="isMobile">☰</p>
      </div>
    </div>
  <div class="home-page">
  
    <!-- Main content area -->
    <div class="content">
      <div class="layer1">
        <div class="rectangle-content">
          <h4>Wallet Balance</h4>
          <h3>NGN 120,00.00</h3>
          <p>Improve sales by regularly updating your products</p>
          <button @click="upload">Add Product</button>

          <div class="inner-rectangle">
            <span>Products</span>
            <span>Total Sales</span>
            <span>Order</span>
            <div>1</div>
            <div>0</div>
            <div>0</div>
          </div>
        </div>
      </div> 
    </div>
  </div>
  <h1>Sales Overview</h1>
      <div class="chart-rectangle">
      <canvas id="salesChart"></canvas>
      </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      isMobile: false, 
      showMenu: false 
    };
  },
  mounted() {
    this.renderChart();
    const width = window.innerWidth;
    this.isMobile = width <= 600;
  },
  methods: {

  toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    renderChart() {
      const ctx = document.getElementById('salesChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Monthly Sales',
            data: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
            backgroundColor: '#5E17EB',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    upload() {
      this.$router.push('/add-product');
    }
  }
}
</script>

<style scoped>

.hamburger-menu {
  display: none; 
}

@media only screen and (max-width: 600px) {
  .home-page {
    display: flex;
    height: 45vh;
    width: 90%;
    margin-left: 23px;
    overflow-x: hidden;
    font-family: 'Poppins';
    border: 1px solid #5E17EB;
    border-radius: 5px;
    outline: none;
    position: relative; 
  }

  .hamburger-menu {
    display: block; 
    margin-right: 315px;
    margin-bottom: 20px;
    margin-top: -30px;
    font-size: 20px;
    font-weight: bold;
  }

  .content {
    flex: 1;
    position: relative;
  }

  .layer1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(94, 23, 235, 0.31);
  }

  .rectangle-content {
    position: absolute;
    top: 30%;
    left: 40%; 
    transform: translate(-50%, -50%);
    text-align: left;
  }

  .rectangle-content h4 {
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 2px; 
  }

  .rectangle-content h3 {
    font-size: 23px; 
    margin-top: 5px; 
  }

  .rectangle-content p {
    font-size: 14px; 
  }

  .rectangle-content button {
    position: absolute;
    top: 30px; 
    right: -80px; 
    background-color: #5E17EB;
    color: white;
    padding: 10px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .inner-rectangle {
    position: absolute;
    top: 100%;
    left: -10px;
    width: 145%;
    height: 65%;
    text-align: center;
    background-color: #5E17EB;
    border-radius: 5px;
    color: white;
  }

  .inner-rectangle span {
    display: inline-block;
    width: 33.33%;
    margin-top: 10%;
  }

  .inner-rectangle div {
    display: inline-block;
    width: 33.33%;
  }

h1 {
    font-size: 16px;
    font-weight: normal;
    font-family: 'Poppins';
    color: black;
   }
 
  .chart-rectangle {
    position: absolute;
    top: 65%;
    left: 5%;
    width: 91.5%;
    height: 280px; 
    background-color: rgba(94, 23, 235, 0.31);
    border-radius: 5px;
  }

  
  #salesChart {
    width: 100%;
    height: 100%;
  }
}
</style>



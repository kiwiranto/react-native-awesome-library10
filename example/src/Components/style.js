const styleCSS = `<style>

html {
    font-family: "Montserrat", Arial, sans-serif;
  }
  
  p {
    padding: 0%;
    margin: 0%;
  }
  
  /* HEADER WEB CONTENT */
  
  .app-header-cont {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 88px;
    overflow: hidden;
    background-color: transparent;
    transition: 0.5s;
    z-index: 999;
  }
  
  .scrolled {
    position: fixed;
    transition: 0.7s;
    background-color: #f8f8f8;
    box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
  }
  
  #myTopnav {
    margin-left: 5%;
  }
  
  .app-header-menu {
    display: flex;
    margin-top: 16px;
  }
  
  .app-header-menu a {
    color: #000;
    padding-right: 56px;
    text-decoration: none;
    font-size: 20px;
    font-family: Muli;
    font-weight: bold;
  }
  
  .app-header-menu a:hover {
    font-weight: 500;
    transition: 1s;
  }
  
  .app-header-mobile-icon-cont {
    display: none;
  }
  
  .app-header-icon-order {
    display: none;
  }
  
  .app-header-mobile-cont {
    display: none;
  }
  
  .app-header-logo-cont {
    display: flex;
    /* margin-left: 11.1%; */
  }
  
  .app-header-logo-cont a {
    width: 100%;
    display: block;
    color: #000;
    text-align: center;
    padding: 5px 5px;
    text-decoration: none;
    font-size: 20px;
    font-weight: bold;
  }
  
  .app-header-logo {
    width: 182px;
  }
  
  /* HEADER SIDE DRAWER */
  
  .app-side-drawer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #f8f8f8;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
  
  .app-side-drawer.open {
    transform: translateX(0);
  }
  
  .app-side-drawer-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
  }
  
  .app-side-drawer-logo {
    display: flex;
  }
  
  .app-side-drawer-close-icon {
    cursor: pointer;
  }
  
  .app-side-drawer-list {
    display: flex;
    flex-direction: column;
    margin-top: 76px;
  }
  
  .app-side-drawer-line {
    width: 90%;
    border: 0.5px solid #d6d6d6;
  }
  
  .app-side-drawer-list button {
    display: flex;
    background-color: transparent;
    border: transparent;
    padding: 10px 24px 10px 24px;
    font-family: Muli;
    font-size: 24px;
    cursor: pointer;
  }
  
  /* HEADER BUTTON BUY NOW */
  
  .app-header-button-buy-now {
    display: flex;
    width: 168px;
    height: 48px;
    justify-content: center;
    align-items: center;
    border: solid 1px #646464;
    border-radius: 24px;
  }
  
  .scrolled-button {
    border: solid 1px #ffffff;
    background-color: #ff4c47;
    transition: 1s;
  }
  
  .app-button-text {
    color: #000;
    transition: 0.5s;
  }
  
  .scrolled-buy {
    color: #fff;
  }
  
  .scrolled-buy:hover {
    color: #000;
  }
  
  .app-header-button-buy-now:hover {
    background-color: rgb(235, 235, 235);
    transition: 0.5s;
    color: #000;
  }
  
  .app-header-button-buy-now a {
    text-decoration: none;
    color: #000;
    font-size: 20px;
    font-family: Muli;
    font-weight: bold;
  }
  
  .app-header-icon {
    display: none;
  }
  
  .app-header-icon-hamburger {
    width: 24px;
    height: 24px;
  }
  
  .app-header-button-buy-cont {
    display: flex;
    cursor: pointer;
  }
  
  
  /* Button Component */
  
  .button {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background-color: black;
    border-radius: 3px;
    border-style: solid;
    border-width: 0.5px;
    color: rgb(207, 207, 207);
  }
  
  .button a {
    font-size: 14px;
    text-decoration: none;
  }
  
  .button:hover {
    background-color: rgb(46, 46, 46);
    transition: 0.5s;
  }
  
  /* Text Input */
  
  .app-text-input input {
    font-size: 13px;
    padding: 2%;
    padding-top: 4%;
    padding-bottom: 4%;
    border-style: solid;
    border-width: 0.5px;
    border-radius: 5px;
    border-color: #777;
  }
  
  /* GOOGLE MAPS */
  
  .app-google-maps-cont {
    display: flex;
    flex-direction: column;
  }
  
  .app-google-maps-input-holder {
    display: flex;
    width: 300px;
    height: 50px;
    position: absolute;
    justify-content: center;
    align-items: center;
    margin-top: 70px;
    z-index: 800;
    border-radius: 90px !important;
    /* border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px; */
    background-color: white;
    margin-left: 30px;
  }
  
  .app-google-maps {
    display: flex;
    flex-direction: column;
    height: 400px;
  }
  
  /* TUTORIAL COMPONENT */
  
  .app-tutorial-container {
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;
  }
  
  .app-tutorial-title {
    margin-bottom: 56px;
  }
  
  .app-tutorial-title p {
    font-size: 34px;
    font-family: Muli;
    font-weight: 300;
  }
  
  .title-tutorial {
    font-family: Muli;
    font-weight: bold;
    font-size: 34px;
  }
  
  .app-tutorial-detail-container {
    display: flex;
    justify-content: center;
  }
  
  .app-tutorial-detail-container .app-tutorial-detail {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .app-tutorial-detail img {
    width: 90px;
    height: 90px;
    margin-right: 16px;
  }
  
  .app-tutorial-detail-text {
    width: 246px;
    font-family: Muli;
  }
  
  .app-tutorial-detail-text h3 {
    font-size: 20px;
    font-weight: bold;
  }
  
  .app-tutorial-detail-text p {
    font-size: 16px;
    color: #646464;
  }
  
  .app-tutorial-line {
    width: 1px;
    height: 186px;
    background-color: #e6e6e6;
    margin-right: 16px;
    margin-left: 15px;
  }
  
  @media screen and (max-width: 768px) {
  
    .app-tutorial-title {
      margin-bottom: 32px;
    }
  
    .title-tutorial {
      font-family: Muli;
      font-weight: bold;
      font-size: 24px;
    }
  
    .app-tutorial-title p {
      font-size: 24px;
      font-weight: 300;
    }
  
    .app-tutorial-detail-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  
    .app-tutorial-line {
      display: none;
    }
  
    .app-tutorial-detail {
      margin: 0px 16px 32px 16px;
    }
  
    .app-tutorial-detail-text h3 {
      font-size: 18px;
    }
  
    .app-tutorial-detail-text p {
      font-size: 14px;
      color: #646464;
    }
  }
  
  /* FEATURE COMPONENT */
  
  .app-feature-container {
    display: flex;
    height: 684px;
    flex-direction: column;
    background-color: #f5f9fc;
  }
  
  .app-feature-title-container {
    display: flex;
    flex-direction: column;
    margin: 56px 0px 0px 160px;
  }
  
  .app-feature-ornament {
    width: 56px;
    height: 4px;
    background-color: #ff4c47;
  }
  
  .app-feature-title-container .app-feature-title {
    padding: 24px 0px 0px 0px;
    font-size: 34px;
    font-family: Muli;
    font-weight: 300;
  }
  
  .app-feature-title-container .app-feature-title span {
    font-weight: bold;
  }
  
  .app-feature-content {
    display: flex;
    flex-direction: column;
  }
  
  .app-feature-card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 56px;
  }
  
  .app-feature-card {
    width: 17.8%;
    height: 392px;
    display: flex;
    flex-direction: column;
    margin-right: 32px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
    font-family: Muli;
  }
  
  .app-feature-image {
    width: 100%;
    height: 40.8%;
  }
  
  .app-feature-card-detail a {
    text-decoration: none;
    color: #1a1a1a;
  }
  
  .app-feature-card-detail .app-feature-card-detail-text {
    height: 72px;
    font-size: 16px;
    text-align: left;
    color: #646464;
  }
  
  .app-feature-card-detail .app-feature-card-detail-button {
    display: flex;
    margin-top: 36px;
    padding-bottom: 30px;
    font-weight: bold;
  }
  
  .app-feature-card-detail-button img {
    margin-right: 113px;
    margin-left: 10px;
    width: 24px !important;
  }
  
  .app-feature-card .app-feature-card-detail {
    padding: 0px 16px 0px 16px;
  }
  
  .app-carousel-container {
    display: none;
  }
  .carousel .control-dots {
    display: none;
  }
  
  @media screen and (max-width: 768px) {
    .app-feature-container {
      display: flex;
      height: 582px;
      flex-direction: column;
      background-color: #f5f9fc;
    }
  
    .app-carousel-container {
      display: flex;
      flex-direction: column;
    }
    .app-feature-content {
      display: none;
    }
    .carousel .slide {
      background: transparent !important;
    }
    .app-feature-title-container {
      display: flex;
      flex-direction: column;
      margin: 56px 0px 0px 16px;
    }
    .app-feature-title-container .app-feature-title {
      padding: 8px 0px 24px 0px;
      font-size: 24px;
      font-family: Muli;
      font-weight: 300;
    }
    .app-feature-card-carousel {
      display: flex;
      justify-content: center;
    }
    .app-feature-card {
      width: 85%;
      height: 393px;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 16px;
  
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
      font-family: Muli;
    }
    .app-feature-container .carousel .control-dots {
      display: flex;
      position: relative !important;
      top: 0px;
      left: -25px;
      justify-content: center;
      z-index: 9 !important;
      bottom: 0;
      margin-top: 25px !important;
    }
    .app-feature-container .carousel .control-dots .dot {
      -webkit-transition: opacity 0.25s ease-in;
      -moz-transition: opacity 0.25s ease-in;
      -ms-transition: opacity 0.25s ease-in;
      -o-transition: opacity 0.25s ease-in;
      transition: opacity 0.25s ease-in;
      opacity: 0.7 !important;
      filter: alpha(opacity=30);
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 1) !important;
      background: #fff !important;
      border-radius: 50% !important;
      width: 8px;
      height: 8px;
      cursor: pointer;
      display: inline-block;
      margin: 0 5px !important;
    }
    .app-feature-container .carousel .control-dots .dot.selected {
      background-color: red !important ;
      width: 20px;
      border-radius: 10px !important;
    }
    .app-feature-container .carousel .control-dots .dot:hover {
      opacity: 1;
      filter: alpha(opacity=100);
    }
  }
  
  /* promo */
  .app-promo-container {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 90%;
    margin: 0 0 50px 70px;
  }
  .app-promo-container .app-strip {
    margin: 20px 0 10px 20px;
    border: 2px solid red;
    width: 30px;
  }
  
  .app-promo-container span {
    font-size: 20px;
    font-weight: bold;
    display: inline;
  }
  .app-promo-container .app-container-text-promo {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 0 0;
  }
  
  .app-promo-title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
  }
  
  .app-promo-title-next {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .app-promo-container .app-content-promo {
    background-color: black;
    border: 1px solid black;
    border-radius: 10px;
    width: 340px;
    height: 240px;
    margin: 10px 20px 10px 20px;
  }
  .app-promo-container .app-main-content {
    background-color: whitesmoke;
    border: 1px solid whitesmoke;
    border-radius: 10px;
    width: 310px;
    height: 100px;
    margin: 180px 0 0 15px;
  }
  .app-promo-container .app-content-promo .app-main-content .app-date-content {
    font-size: 12px;
    display: block;
    color: red;
    margin: 10px 0 0 10px;
  }
  .app-promo-container
    .app-content-promo
    .app-main-content
    .app-discount-content {
    font-size: 15px;
    display: block;
    font-weight: 600;
    margin: 10px 0 0 10px;
  }
  .app-promo-container .app-content-promo .app-main-content .app-desc-content {
    font-size: 12px;
    display: block;
    margin: 10px 0 0 10px;
  }
  .app-content-promo .text-next {
    display: flex;
    flex-direction: column;
  }
  .app-container-content {
    display: flex;
    justify-content: space-between;
  }
  .app-text-for-you {
    margin-left: 10px;
  }
  
  /* Product */
  .app-product-container {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 90%;
    margin: 0 0 50px 70px;
  }
  .app-product-container .app-strip {
    margin: 20px 0 10px 20px;
    border: 2px solid red;
    width: 30px;
  }
  
  .app-product-container span {
    font-size: 20px;
    font-weight: bold;
    display: inline;
  }
  .app-product-container .app-container-text-product {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 0 0;
  }
  
  .app-product-title-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 20px;
  }
  
  .app-product-title-next {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .app-product-container .app-content-product {
    background-color: rgba(9, 0, 0, 100);
    border: 1px solid black;
    border-radius: 10px;
    width: 500px;
    height: 200px;
    margin: 10px 20px 10px 20px;
    display: flex;
  }
  .app-product-container .app-content-left {
    width: 200px;
    height: auto;
    /* background-color: yellow; */
  }
  .app-product-container .app-style-card {
    background-color: red;
    width: 150px;
    height: 120px;
    margin: 20px 0 0 25px;
  }
  .app-product-container .app-style-quota {
    background-color: green;
    width: 70px;
    height: 70px;
    border-radius: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: -25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .app-product-container .app-content-right {
    width: 300px;
    height: auto;
    /* background-color: green; */
    margin-top: 20px;
  }
  .app-product-container
    .app-content-product
    .app-main-content
    .app-date-content {
    font-size: 12px;
    display: block;
    color: red;
    margin: 10px 0 0 10px;
  }
  .app-product-container
    .app-content-promo
    .app-main-content
    .app-discount-content {
    font-size: 15px;
    display: block;
    font-weight: 600;
    margin: 10px 0 0 10px;
  }
  .app-promo-container .app-content-promo .app-main-content .app-desc-content {
    font-size: 12px;
    display: block;
    margin: 10px 0 0 10px;
  }
  .app-content- .text-next {
    display: flex;
    flex-direction: column;
  }
  .app-container-content {
    display: flex;
    justify-content: space-between;
  }
  .app-text-for-you {
    margin-left: 10px;
  }
  .app-product-style-text-router {
    margin: 0;
    display: inline;
    color: white;
  }
  .app-product-style-text-premium {
    margin: 0;
    display: inline;
    font-weight: 600;
    margin-left: 10px;
    color: white;
  }
  .app-product-style-text-price {
    color: orange;
    font-size: 12px;
    margin-bottom: -12px;
  }
  .app-product-style-container-price-strike-through {
    display: flex;
    flex-direction: row;
  }
  .app-product-style-text-price-strike-through {
    text-decoration: line-through;
    font-size: 12px;
    margin-left: 20px;
    color: white;
  }
  .app-product-style-text-price-discount {
    font-size: 14px;
    color: white;
  }
  .app-product-container-button {
    display: flex;
    flex-direction: row;
  }
  .app-product-button-detail {
    background-color: black;
    color: white;
    border-color: white;
    border-width: 1px;
    border-radius: 10px;
    width: 100px;
    height: 50px;
  }
  .app-product-button-buy {
    background-color: red;
    color: white;
    border-color: red;
    border-width: 1px;
    border-radius: 10px;
    margin-left: 20px;
    width: 100px;
    height: 50px;
  }
  .app-map-input {
    width: 200px;
    height: 40px;
    z-index: 800;
    border: none;
    border-radius: 20px;
    margin: 5px;
  }
  .app-map-input:focus {
    outline: 1px solid transparent;
  }
  
  .pac-container {
    width: 300px !important;
    margin-left: -35px !important;
    border-bottom-left-radius: 10px !important;
    border-bottom-right-radius: 10px !important;
    border-top-right-radius: 5px !important;
    border-top-left-radius: 5px !important;
    border: white !important;
    box-shadow: none !important;
    margin-top: -40px;
  }
  .app-map-style-button {
    width: 70px;
    height: 40px;
    border-radius: 20px;
    background-color: rgb(223, 49, 49);
    border: 1px solid rgb(226, 60, 60);
    color: white;
    font-weight: 700;
    z-index: 999;
    margin: 5px;
  }
  .app-map-style-search {
    width: 20px;
    height: 20px;
    margin: 5px;
  }
  .app-google-maps-container-content {
    width: 100%;
    height: 200px;
    display: flex;
  }
  .app-google-maps-content-text {
    width: 500px;
    height: 100px;
    margin: 20px 0 20px 30px;
  }
  .app-google-maps-style-text-coverage {
    color: red;
    font-size: 23px;
    font-weight: 800;
    display: inline;
  }
  .app-google-maps-style-text-service {
    font-size: 23px;
    font-weight: 400;
    display: inline;
    margin-left: 5px;
  }
  .app-google-maps-style-text-desc {
    font-size: 12px;
    font-weight: 400;
  }
  
  /* About */
  @media screen and (max-width: 768px) {
    .app-about-all-container {
      margin-top: -10%;
      margin-bottom: 100px;
    }
    .app-about-container {
      display: flex;
      flex-direction: column;
    }
    .app-about-image {
      display: flex;
      /* background-image: url('../Assets/about-mobile.jpg') !important; */
      width: 100%;
      height: 9.4%;
      overflow: hidden !important;
      background-repeat: no-repeat;
      margin-top: 0%;
    }
    .app-about-image-web {
      display: none !important;
    }
    .app-about-image-mobile {
      width: 100% !important;
      height: auto !important;
      display: block !important;
      margin: auto !important;
    }
    .app-about-content {
      display: flex;
      position: absolute;
      flex-direction: column;
      margin: 7.1% 0 0 4.4% !important;
      padding-right: 0 !important;
      background-color: #ff4c47;
      margin-top: 285px !important;
      width: 91.5% !important;
      height: 316px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
      background-color: #ffffff;
      border-radius: 16px !important;
    }
    .app-about-ornament {
      width: 56px !important;
      height: 4px !important;
      margin-left: 24px !important;
      margin-top: 40px !important;
      margin-bottom: 8px !important;
    }
    .app-about-style-text-1 {
      width: 86.3% !important;
      height: 20.3% !important;
      font-family: Muli;
      font-size: 24px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33 !important;
      letter-spacing: normal;
      margin-left: 24px !important;
    }
    .app-about-style-desc-1 {
      width: 86.3% !important;
      height: 20.3% !important;
      margin-top: 24px !important;
      margin-left: 24px !important;
      font-family: Muli;
      font-size: 16px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5 !important;
      letter-spacing: normal;
    }
  }
  @media screen and (max-width: 993px) {
    .app-about-all-container {
      margin-bottom: 100px;
    }
    .app-about-image {
      display: flex;
      /* background-image: url('../Assets/molecules-banner-content-about-heksa-mobile.jpg'); */
      width: 100%;
      height: 377px;
      background-repeat: no-repeat;
      overflow: hidden !important;
      margin-top: 0%;
    }
    .app-about-image-web {
      display: none !important;
    }
    .app-about-image-mobile {
      width: 100% !important;
      height: auto !important;
      display: block !important;
      margin: auto !important;
    }
    .app-about-content {
      display: flex;
      flex-direction: column;
      margin: 7.1% 0 0 4.4% !important;
      padding-right: 0 !important;
      border-radius: 16px !important;
      background-color: #ff4c47;
      margin-top: 285px !important;
      position: absolute;
      width: 91.5% !important;
      height: 316px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
      background-color: #ffffff;
    }
    .app-about-ornament {
      width: 56px !important;
      height: 4px !important;
      margin-left: 24px !important;
      margin-top: 40px !important;
      margin-bottom: 8px !important;
    }
    .app-about-style-text-1 {
      width: 86.3% !important;
      height: 20.3% !important;
      font-family: Muli;
      font-size: 24px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33 !important;
      letter-spacing: normal;
      margin-left: 24px !important;
    }
    .app-about-style-desc-1 {
      width: 86.3% !important;
      height: 20.3% !important;
      margin-top: 24px !important;
      margin-left: 24px !important;
      font-family: Muli;
      font-size: 16px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5 !important;
      letter-spacing: normal;
    }
  }
  .app-about-container {
    display: flex;
  }
  .app-about-image-web {
    width: 100%;
    height: auto;
    display: block;
    margin: auto;
  }
  .app-about-image-mobile {
    display: none;
  }
  .app-about-image {
    width: 100%;
    height: 536px;
    background-repeat: no-repeat;
    overflow: hidden;
  }
  .app-about-content {
    width: 450px;
    height: 370px;
    margin-left: 51.1%;
    margin-top: -370px;
    padding-right: 72px;
    position: absolute;
  }
  .app-about-ornament {
    width: 56px;
    height: 4px;
    background-color: #ff4c47;
    margin-bottom: 24px;
  }
  .app-about-style-text-1 {
    width: 448px;
    height: 80px;
    font-family: Muli;
    font-size: 34px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.18;
    letter-spacing: normal;
    display: block;
    margin-bottom: 16px;
  }
  .app-about-style-desc-1 {
    width: 544px;
    height: 72px;
    font-family: Muli;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
  }
  .app-about-style-layanan {
    font-weight: bold;
  }
  
  /* Campaign*/
  @media screen and (max-width: 768px) {
    .app-campaign-content {
      display: flex;
      flex-direction: column;
      margin: -200px 0 0 4.4% !important;
      padding-right: 0 !important;
      background-color: #ff4c47;
      margin-top: 285px !important;
      position: absolute;
      width: 91.5% !important;
      height: 316px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
      background-color: #ffffff;
      border-radius: 16px;
    }
    .app-campaign-ornament {
      width: 56px !important;
      height: 4px !important;
      margin-left: 24px !important;
      margin-top: 40px !important;
      margin-bottom: 8px !important;
      border: 2px solid #ff4c47 !important;
    }
    .app-campaign-paket-internet-hemat {
      width: 86.3% !important;
      height: 20.3% !important;
      font-family: Muli;
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.6;
      letter-spacing: normal;
      margin-left: 24px !important;
    }
    .app-campaign-harga-spesial {
      width: 86.3% !important;
      height: 20.3% !important;
      margin-top: 8px !important;
      margin-left: 24px !important;
      font-family: Muli;
      font-size: 34px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5 !important;
      letter-spacing: normal;
      margin-bottom: 32px !important;
    }
    .app-campaign-button {
      width: 170px !important;
      height: 40px !important;
      border-radius: 20px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1) !important;
      margin-left: 24px !important;
      background-color: #ff4c47;
      font-family: Muli;
      font-size: 16px !important;
      font-weight: bold;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.2 !important;
      letter-spacing: normal !important;
      text-align: center;
      color: #ffffff;
      margin-top: 48px !important;
      margin-bottom: 56px !important;
      padding: 7px 16px 9px 16px !important;
    }
    .app-campaign-container {
      display: flex;
      /* background-image: url('../Assets/molecules-banner-content-internet-hemat-mobile.jpg') !important; */
      width: 100% !important;
      height: 11% !important;
      background-repeat: no-repeat;
      overflow: hidden;
    }
    .app-campaign-image-web {
      display: none !important;
    }
    .app-campaign-image-mobile {
      width: 100% !important;
      height: auto !important;
      display: block !important;
      margin: auto !important;
    }
    .app-campaign-all-container {
      margin-bottom: 0px;
    }
  }
  @media screen and (max-width: 993px) {
    .app-campaign-container {
      display: flex;
      /* background-image: url('../Assets/molecules-banner-content-internet-hemat-mobile.jpg') !important; */
      width: 100% !important;
      height: 376px !important;
      background-repeat: no-repeat;
      overflow: hidden !important;
    }
    .app-campaign-image-web {
      display: none !important;
    }
    .app-campaign-image-mobile {
      width: 100% !important;
      height: auto !important;
      display: block !important;
      margin: auto !important;
    }
    .app-campaign-content {
      display: flex;
      flex-direction: column;
      margin: 140px 0 0 4.4% !important;
      padding-right: 0 !important;
      border-radius: 16px !important;
      background-color: #ff4c47;
      position: absolute;
      width: 91.5% !important;
      height: 316px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
      background-color: #ffffff;
    }
    .app-campaign-ornament {
      width: 56px !important;
      height: 4px !important;
      margin-left: 24px !important;
      margin-top: 40px !important;
      margin-bottom: 8px !important;
      background-color: #ff4c47 !important;
      border: 2px solid #ff4c47 !important;
    }
    .app-campaign-paket-internet-hemat {
      width: 86.3% !important;
      height: 20.3% !important;
      font-family: Muli;
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.6;
      letter-spacing: normal;
      margin-left: 24px !important;
    }
    .app-campaign-harga-spesial {
      width: 86.3% !important;
      height: 20.3% !important;
      margin-top: 8px !important;
      margin-left: 24px !important;
      font-family: Muli;
      font-size: 34px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5 !important;
      letter-spacing: normal;
      margin-bottom: 32px !important;
    }
    .app-campaign-button {
      width: 200px !important;
      height: 100px !important;
      border-radius: 20px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1) !important;
      margin-left: 24px !important;
      background-color: #ff4c47;
      font-family: Muli;
      font-size: 16px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
      margin-top: 48px !important;
      margin-bottom: 56px !important;
      padding: 7px 16px 9px 16px !important;
    }
  }
  @media screen and (min-width: 1200px) {
    .app-campaign-content {
      margin-left: 11.1% !important;
    }
  }
  .app-campaign-all-container {
    margin-bottom: 0px;
  }
  .app-campaign-container {
    display: flex;
    width: 100%;
    height: 13.9%;
    background-repeat: no-repeat;
    overflow: hidden;
  }
  .app-campaign-image-web {
    width: 100%;
    height: auto;
    display: block;
    margin: auto;
  }
  .app-campaign-image-mobile {
    display: none;
  }
  .app-campaign-content {
    width: 1000px;
    margin-top: 96px;
    margin-left: 160px;
    height: 400px;
    position: absolute;
  }
  .app-campaign-ornament {
    width: 56px;
    height: 4px;
    background-color: #ff4c47;
  }
  .app-campaign-paket-internet-hemat {
    width: 352px;
    height: 32px;
    font-family: Muli;
    font-size: 24px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #1a1a1a;
    margin-top: 24px;
    display: block;
  }
  .app-campaign-harga-spesial {
    width: 736px;
    height: 64px;
    font-family: Muli;
    font-size: 48px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #1a1a1a;
    display: block;
  }
  .app-campaign-button {
    width: 240px;
    height: 48px;
    border-radius: 24px;
    background-color: #ff4c47;
    font-family: Muli;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    margin-top: 48px;
    border: 1px solid #ff4c47;
  }
  
  /* Campaign 2*/
  @media screen and (max-width: 768px) {
    .app-campaign-second-content {
      display: flex;
      flex-direction: column;
      margin: 0 0 0 4.4% !important;
      margin-top: -130px !important;
      padding-right: 0 !important;
      background-color: #ff4c47;
      position: absolute;
      width: 91.5% !important;
      height: 412px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
      background-color: #ffffff;
      border-radius: 16px;
    }
    .app-campaign-second-ornament {
      width: 56px !important;
      height: 4px !important;
      margin-left: 24px !important;
      margin-top: 40px !important;
      margin-bottom: 8px !important;
      border: 2px solid #ff4c47 !important;
    }
    .app-campaign-second-paket-internet-hemat {
      width: 86.3% !important;
      height: 20.3% !important;
      font-family: Muli;
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.6;
      letter-spacing: normal;
      margin-left: 24px !important;
    }
    .app-campaign-second-harga-spesial {
      width: 86.3% !important;
      height: 20.3% !important;
      margin-top: 8px !important;
      margin-left: 24px !important;
      font-family: Muli;
      font-size: 34px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5 !important;
      letter-spacing: normal;
      margin-bottom: 32px !important;
    }
    .app-campaign-second-button {
      width: 170px !important;
      height: 40px !important;
      border-radius: 20px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1) !important;
      margin-left: 24px !important;
      background-color: #ff4c47;
      font-family: Muli;
      font-size: 16px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
      margin-top: 0 !important;
      margin-bottom: 56px !important;
      padding: 7px 16px 9px 16px !important;
    }
    .app-campaign-second-container {
      display: flex;
      width: 100% !important;
      height: 376px !important;
      background-repeat: no-repeat;
      margin-top: 300px !important;
      overflow: hidden;
    }
    .app-campaign-second-image-web {
      display: none !important;
    }
    .app-campaign-second-image-mobile {
      width: 100% !important;
      height: auto !important;
      display: block !important;
      margin: auto !important;
    }
    .app-campaign-second-all-container {
      margin-bottom: 250px;
    }
  }
  @media screen and (max-width: 993px) {
    .app-campaign-second-content {
      display: flex;
      flex-direction: column;
      margin: 0 0 0 4.4% !important;
      margin-top: -130px !important;
      padding-right: 0 !important;
      background-color: #ff4c47;
      position: absolute;
      width: 91.5% !important;
      height: 412px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1);
      background-color: #ffffff;
      border-radius: 16px;
    }
    .app-campaign-second-ornament {
      width: 56px !important;
      height: 4px !important;
      margin-left: 24px !important;
      margin-top: 40px !important;
      margin-bottom: 8px !important;
      background-color: #ff4c47 !important;
      border: 2px solid #ff4c47 !important;
    }
    .app-campaign-second-paket-internet-hemat {
      width: 86.3% !important;
      height: 20.3% !important;
      font-family: Muli;
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.6;
      letter-spacing: normal;
      margin-left: 24px !important;
    }
    .app-campaign-second-harga-spesial {
      width: 86% !important;
      height: 46.6% !important;
      margin-top: 8px !important;
      margin-left: 24px !important;
      font-family: Muli;
      font-size: 34px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5 !important;
      letter-spacing: normal;
      margin-bottom: 32px !important;
    }
    .app-campaign-second-button {
      width: 170px !important;
      height: 40px !important;
      border-radius: 20px !important;
      box-shadow: 4px 6px 24px 0 rgba(32, 32, 35, 0.1) !important;
      margin-left: 24px !important;
      background-color: #ff4c47;
      font-family: Muli;
      font-size: 16px !important;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
      margin-top: 0 !important;
      margin-bottom: 56px !important;
      padding: 7px 16px 9px 16px !important;
    }
    .app-campaign-second-container {
      display: flex;
      /* background-image: url('../Assets/modem-mobile.jpg') !important; */
      width: 100% !important;
      height: 376px !important;
      background-repeat: no-repeat;
      margin-top: 300px !important;
      overflow: hidden;
    }
    .app-campaign-second-image-web {
      display: none;
    }
    .app-campaign-second-image-mobile {
      width: 100% !important;
      height: auto !important;
      display: block !important;
      margin: auto !important;
    }
    .app-cam .app-campaign-second-all-container {
      margin-bottom: 250px;
    }
  }
  
  .app-campaign-second-container {
    display: flex;
    /* background-image: url('../Assets/modem.jpg'); */
    width: 100%;
    height: 13.9%;
    overflow: hidden;
  }
  .app-campaign-second-image-web {
    width: 100%;
    height: auto;
    display: block;
    margin: auto;
  }
  .app-campaign-second-image-mobile {
    display: none;
  }
  .app-campaign-second-content {
    width: auto;
    margin-top: 96px;
    margin-left: 544px;
    height: 400px;
    position: absolute;
  }
  .app-campaign-second-ornament {
    width: 56px;
    height: 4px;
    background-color: #ff4c47;
  }
  .app-campaign-second-paket-internet-hemat {
    width: 352px;
    height: 32px;
    font-family: Muli;
    font-size: 24px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #1a1a1a;
    margin-top: 24px;
    display: block;
  }
  .app-campaign-second-harga-spesial {
    width: 736px;
    height: 64px;
    font-family: Muli;
    font-size: 48px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #1a1a1a;
    display: block;
    margin-top: 16px;
    margin-bottom: 48px;
  }
  .app-campaign-second-button {
    width: 240px;
    height: 48px;
    border-radius: 24px;
    background-color: #ff4c47;
    font-family: Muli;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    margin-top: 48px;
    border: 1px solid #ff4c47;
  }
  

</style>`;

export default styleCSS;
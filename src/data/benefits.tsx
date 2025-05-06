import {
    FiShoppingCart,
    FiSettings,
    FiTrendingUp,
    FiSmartphone,
    FiUploadCloud,
    FiGlobe,
    FiShield,
    FiUserCheck,
    FiPackage,
  } from "react-icons/fi";
  
  import { IBenefit } from "../types";
  
  export const benefits: IBenefit[] = [
    {
      title: "Effortless Store Creation",
      description:
        "Launch your own professional storefront in minutes — no tech skills needed. Zikor simplifies the process so you can focus on running your business.",
      bullets: [
        {
          title: "Customizable Storefronts",
          description: "Choose your store name, logo, colors, and layout — make it yours.",
          icon: <FiShoppingCart size={26} />,
        },
        {
          title: "Mobile-First Design",
          description: "Your store looks great and functions smoothly on any device.",
          icon: <FiSmartphone size={26} />,
        },
        {
          title: "Custom Domains (Business Plan)",
          description: "Stand out with your own branded store URL.",
          icon: <FiGlobe size={26} />,
        },
      ],
      imageSrc: "https://res.cloudinary.com/dantj20mr/image/upload/v1746542666/zikstore-removebg-preview_sst4ls.png",
    },
    {
      title: "Business Automation & AI Tools",
      description:
        "From inventory to insights, Zikor gives you smart tools to automate your workflow and grow your store without the overwhelm.",
      bullets: [
        {
          title: "AI Product Descriptions",
          description: "Generate compelling descriptions for your products in seconds.",
          icon: <FiSettings size={26} />,
        },
        {
          title: "Sales & Order Management",
          description: "Track orders, manage sales, and stay on top of customer needs effortlessly.",
          icon: <FiTrendingUp size={26} />,
        },
        {
          title: "Instagram Product Import",
          description: "Sync your IG shop to auto-import products with images and captions.",
          icon: <FiUploadCloud size={26} />,
        },
      ],
      imageSrc: "https://res.cloudinary.com/dantj20mr/image/upload/v1746544929/Black_and_White_Phone_Mockup_Webinar_Promotion_Instagram_Story__1_-removebg-preview_dzdejj.png",
    },
    {
      title: "Reliable Support & Security",
      description:
        "Zikor gives you peace of mind with secure systems, fraud protection, and expert support whenever you need it.",
      bullets: [
        {
          title: "User Verification & Store Protection",
          description: "We vet businesses and keep your store secure from fraud.",
          icon: <FiShield size={26} />,
        },
        {
          title: "Dedicated Support Team",
          description: "Need help? Our support team is always just an email away.",
          icon: <FiUserCheck size={26} />,
        },
        {
          title: "Logistics & CAC (Coming Soon)",
          description: "Get delivery support and official CAC registration under the Business plan.",
          icon: <FiPackage size={26} />,
        },
      ],
      imageSrc: "https://res.cloudinary.com/dantj20mr/image/upload/v1746545639/Black_and_White_Phone_Mockup_Webinar_Promotion_Instagram_Story__2_-removebg-preview_c6kux4.png",
    },
  ];
  
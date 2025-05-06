import { BsShop, BsFillStarFill } from "react-icons/bs";
import { FiGlobe } from "react-icons/fi";

import { IStats } from "../types";

export const stats: IStats[] = [
  {
    title: "10,000+",
    icon: <BsShop size={34} className="text-blue-500" />,
    description: "Stores created on Zikor, empowering entrepreneurs around the world."
  },
  {
    title: "4.9",
    icon: <BsFillStarFill size={34} className="text-yellow-500" />,
    description: "Average customer rating, reflecting satisfaction with our platform."
  },
  {
    title: "50+",
    icon: <FiGlobe size={34} className="text-green-600" />,
    description: "Countries served, enabling businesses to reach a global audience."
  }
];

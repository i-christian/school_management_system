import {
  logo,
  homeIcon,
  aboutIcon,
  contactIcon,
  userSettingsIcon,
  adminIcon,
  studentsIcon,
  usersIcon,
  logoutIcon,
  teachersIcon,
  reportsIcon,
} from "../assets/icons";

export const navbarElements = [
  { name: "Home", link: "/", icon: homeIcon },
  { name: "About", link: "/about", icon: aboutIcon },
  { name: "Contact", link: "#contact", icon: contactIcon },
];

export const admindashboardElements = [
  { name: "Home", link: "/", icon: homeIcon },
  { name: "Admin", link: "/admin", icon: adminIcon },
  { name: "Users", link: "/users", icon: usersIcon },
  { name: "Students", link: "/students", icon: studentsIcon },
  { name: "Teachers", link: "/teachers", icon: teachersIcon },
  { name: "Reports", link: "/reports", icon: reportsIcon },
  { name: "User Settings", link: "/settings", icon: userSettingsIcon },
];
export const userDashboardElements = [
  { name: "Home", link: "/", icon: homeIcon },
  { name: "Students", link: "/students", icon: studentsIcon },
  { name: "User Settings", link: "/settings", icon: userSettingsIcon },
];
export const logOutElement = {
  name: "Sign Out",
  link: "/logout",
  icon: logoutIcon,
};

export const logoutIcons = [
  { name: "Sign Out", link: "/logout", icon: logoutIcon },
];

export const logoUrl = logo;

export const schoolName = [
  {
    full: "Ekwendeni Girls' Secondary School",
    name: "Ekwendeni Girls'",
    short: "EGSS",
  },
];

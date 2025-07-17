import {
  HomeWork as HomeWorkIcon,
  Category as CategoryIcon,
  Photo as BannerIcon,
  People as UserManagementIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export const menuItems = [
  {
    icon: HomeWorkIcon,
    label: "Property Approvals",
    route: "/",
  },
  {
    icon: CheckCircleIcon,
    label: "Approved Estates",
    route: "/approved-estates",
  },
  {
    icon: CategoryIcon,
    label: "Category",
    route: "/category-management",
  },
  {
    icon: UserManagementIcon,
    label: "User Management",
    route: "/user/get-all-users",
  },
  {
    icon: BannerIcon,
    label: "Banner Management",
    route: "/get-all-banners",
  },
];

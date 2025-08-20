import {
  HomeWork as HomeWorkIcon,
  Category as CategoryIcon,
  Photo as BannerIcon,
  People as UserManagementIcon,
  CheckCircle as CheckCircleIcon,
  SystemUpdate as SystemUpdateIcon, // ✅ add
} from "@mui/icons-material";

export interface MenuItemDef {
  icon: React.ElementType;
  route: string;
  labelEn: string;
  labelAr: string;
}

export const menuItems: MenuItemDef[] = [
  { icon: HomeWorkIcon, route: "/", labelEn: "Property Approvals", labelAr: "الموافقات على العقارات" },
  { icon: CheckCircleIcon, route: "/approved-estates", labelEn: "Approved Estates", labelAr: "العقارات المعتمدة" },
  { icon: CategoryIcon, route: "/category-management", labelEn: "Category", labelAr: "إدارة الفئات" },
  { icon: UserManagementIcon, route: "/user/get-all-users", labelEn: "User Management", labelAr: "إدارة المستخدمين" },
  { icon: BannerIcon, route: "/get-all-banners", labelEn: "Banner Management", labelAr: "إدارة البانرات" },
  {
    icon: SystemUpdateIcon,
    route: "/release-versions",
    labelEn: "Release Versions",
    labelAr: "إصدارات التطبيق",
  },
];

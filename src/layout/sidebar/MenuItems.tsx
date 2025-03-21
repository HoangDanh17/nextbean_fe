import AssignmentIcon from "@mui/icons-material/Assignment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Thông kê",
  },
  {
    id: 1,
    title: "Dashboard",
    icon: DashboardIcon,
    href: "/homePage/dashboard",
  },
  {
    navlabel: true,
    subheader: "Quản lí thực tập",
  },
  {
    id: 3,
    title: "Kỳ thực tập",
    icon: FormatListBulletedIcon,
    href: "/homePage/internTerm",
  },
  {
    id: 4,
    title: "Danh sách intern",
    icon: FormatListBulletedIcon,
    href: "/homePage/internList",
  },
  {
    navlabel: true,
    subheader: "Quản lí dự án",
  },
  {
    id: 5,
    title: "Danh sách dự án",
    icon: AssignmentIcon,
    href: "/homePage/projectList",
  },
  {
    id: 6,
    title: "Thành viên dự án",
    icon: AssignmentIcon,
    href: "/homePage/projectMember",
  },
  {
    navlabel: true,
    subheader: "Quản lí lịch",
  },
  {
    id: 7,
    title: "Lịch làm việc",
    icon: AssignmentIcon,
    href: "/homePage/timeTable",
  },
  {
    navlabel: true,
    subheader: "Quản lí tài khoản",
  },
  {
    id: 2,
    title: "Quản lí tài khoản",
    icon: DashboardIcon,
    href: "/homePage/accountManagement",
  },
  // {
  //   navlabel: true,
  //   subheader: "Quản lí dự án của PM",
  // },
  // {
  //   id: 7,
  //   title: "Chi tiết dự án",
  //   icon: AssignmentIcon,
  //   href: "/homePage/projectDetail",
  // },
  // {
  //   id: 8,
  //   title: "Thành viên dự án",
  //   icon: AssignmentIcon,
  //   href: "/homePage/projectMemberPM",
  // },
  // {
  //   id: 9,
  //   title: "Danh sách công việc",
  //   icon: AssignmentIcon,
  //   href: "/homePage",
  // },
];

const MenuitemsManager = [
  {
    navlabel: true,
    subheader: "Quản lí dự án",
  },
  {
    id: 1,
    title: "Chi tiết dự án",
    icon: AssignmentIcon,
    href: "/homePage/projectDetail",
  },
  {
    id: 2,
    title: "Thành viên dự án",
    icon: AssignmentIcon,
    href: "/homePage/projectMemberPM",
  },
  {
    id: 3,
    title: "Danh sách công việc",
    icon: AssignmentIcon,
    href: "/homePage/listCard",
  },
];

const MenuitemsPm = [
  {
    navlabel: true,
    subheader: "Quản lí dự án",
  },
  {
    id: 1,
    title: "Chi tiết dự án",
    icon: AssignmentIcon,
    href: "/homePage/projectDetail",
  },
  {
    id: 2,
    title: "Thành viên dự án",
    icon: AssignmentIcon,
    href: "/homePage/projectMemberPM",
  },
  {
    id: 3,
    title: "Danh sách công việc",
    icon: AssignmentIcon,
    href: "/homePage/listTask",
  },
];

export { Menuitems, MenuitemsManager, MenuitemsPm };

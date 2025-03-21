"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/app/app-provider";
import authApiRequest from "@/apiRequests/auth";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import LogoutIcon from '@mui/icons-material/Logout';
interface UserInfo {
  "user-name": string;
  email: string;
  account_role: string;
}

const Profile = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { user, setUser } = useAppContext();
  const [userName, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    setUserName(user?.["user-name"] || "");
    setUserInfo(
      user
        ? {
            "user-name": user["user-name"],
            email: user.email,
            account_role: user.role,
          }
        : null
    );
  }, [user]);

  const handleLogout = async () => {
    try {
      await authApiRequest
        .logoutFromNextClientToNextServer(true)
        .then((res) => {
          toast({
            title: `Đăng xuất thành công`,
            duration: 2000,
            variant: "info",
          });
          router.push(`/login?redirectFrom=${pathname}`);
        });
    } finally {
      setUser(null);
      router.refresh();
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionTokenExpiresAt");
    }
  };

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <Box>
      <Chip
        onClick={handleClick2}
        avatar={<Avatar alt="Natacha" src="/images/profile/user-1.jpg" />}
        label={userName}
        variant="outlined"
        style={{ width: "auto", fontSize: 14, fontWeight: 600 }}
      />
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <PersonIcon width={20} />
          </ListItemIcon>
          <ListItemText
            onClick={() => {
              setOpenDrawer(true);
            }}
          >
            My Profile
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <EmailIcon width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ChecklistIcon width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<LogoutIcon></LogoutIcon>}
          >
            Logout
          </Button>
        </Box>
      </Menu>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        style={{ width: 500 }}
      >
        <Box sx={{ width: 500, padding: 4, position: "relative" }}>
          <Box
            sx={{
              width: "100%",
              height: "50%",
              background: "#cffafe",
              position: "absolute",
              backgroundClip: "padding-box",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
          <Stack
            style={{ alignItems: "center" }}
            direction={"column"}
            spacing={4}
          >
            <Typography variant="h3" style={{ marginBottom: 30 }}>
              Thông tin người dùng
            </Typography>
            <Avatar
              alt="Natacha"
              src="/images/profile/user-1.jpg"
              sx={{ width: 200, height: 200 }}
            />
            <Stack spacing={3} style={{ width: "100%" }}>
              <Box className="flex flex-row w-full items-center gap-1.5">
                <Label htmlFor="Tên" style={{ width: "20%", fontWeight: 700 }}>
                  Tên:
                </Label>
                <Input
                  type="text"
                  id="Tên"
                  placeholder="Tên"
                  disabled
                  value={userInfo?.["user-name"]}
                  style={{ width: "70%" }}
                />
              </Box>
              <Box className="flex flex-row w-full items-center gap-1.5">
                <Label
                  htmlFor="email"
                  style={{ width: "20%", fontWeight: 700 }}
                >
                  Email:
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  disabled
                  value={userInfo?.email}
                  style={{ width: "70%" }}
                />
              </Box>
              <Box className="flex flex-row w-full items-center gap-1.5">
                <Label
                  htmlFor="chucVu"
                  style={{ width: "20%", fontWeight: 700 }}
                >
                  Chức vụ:
                </Label>
                <Input
                  type="text"
                  id="chucVu"
                  placeholder="Chức vụ"
                  value={userInfo?.account_role}
                  disabled
                  style={{ width: "70%" }}
                />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Profile;

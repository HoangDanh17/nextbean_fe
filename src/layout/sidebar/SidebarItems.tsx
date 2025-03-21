"use client";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavGroup from "@/layout/sidebar/NavGroup/NavGroup";
import {
  Menuitems,
  MenuitemsManager,
  MenuitemsPm,
} from "@/layout/sidebar/MenuItems";
import NavItem from "@/layout/sidebar/NavItem";
import { useEffect, useState } from "react";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getMenuItems = () => {
    if (user?.role === "admin") {
      return Menuitems;
    } else if (user?.role === "manager") {
      return MenuitemsManager;
    } else {
      return MenuitemsPm;
    }
  };

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {getMenuItems().map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;

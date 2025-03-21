import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";
import { useAppContext } from "@/app/app-provider";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  const { user } = useAppContext();
  const href = user?.role !== "admin" ? "/listCard" : "/";
  return (
    <LinkStyled href={href}>
      <Image
        src="/images/logos/dark-logo.svg"
        alt="logo"
        height={70}
        width={200}
        priority
        style={{ alignContent: "center", marginTop: 30, marginLeft: 8 }}
      />
    </LinkStyled>
  );
};

export default Logo;

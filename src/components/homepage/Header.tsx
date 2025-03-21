import { Button } from "@mui/material";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-black shadow-md dark:bg-gray-800">
      <Link href={"/homePage"}>
        <Button>Login</Button>
      </Link>
    </div>
  );
};

export default Header;

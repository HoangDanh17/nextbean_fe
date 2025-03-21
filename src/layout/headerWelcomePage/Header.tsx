import { Typography } from "@mui/material";
import Link from "next/link";

const HeaderWelcomePage = () => {
  return (
    <div className="flex justify-between flex-row items-center w-full p-4 bg-[#fbf8f8]/20 text-center">
      <Typography variant="h5" className="text-white font-bold ml-6 nextBean">
        NEXTBEAN CENTER
      </Typography>
      <Link href="/login" className="btn-get-started">
        Đăng nhập
      </Link>
    </div>
  );
};

export default HeaderWelcomePage;

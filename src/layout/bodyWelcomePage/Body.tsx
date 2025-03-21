import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const Body = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: 20,
        margin: "0 140px",
        justifyContent: "center",
      }}
    >
      <div style={{ lineHeight: 2 }}>
        <Typography
          variant="h3"
          style={{ color: "white", fontFamily: "sans-serif", fontWeight: 700 }}
        >
        Nextbean Center
        </Typography>
        <Typography variant="h5" className="text-white/40">
          Best choice for managing member and information effeciently
        </Typography>
        <Link href={"/login"} className="btn-get-started mt-4 font-semibold">
          Get Started
        </Link>
      </div>
      <div
        className="hero"
        data-aos="zoom-out"
        data-aos-delay="200"
      >
        <Image
          alt="image"
          width={636}
          height={526.737}
          src="/images/hero-img.png"
        ></Image>
      </div>
    </div>
  );
};

export default Body;

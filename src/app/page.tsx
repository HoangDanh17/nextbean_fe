import Body from "@/layout/bodyWelcomePage/Body";
import HeaderWelcomePage from "@/layout/headerWelcomePage/Header";

export default function Home() {
  return (
    <main
      className="min-h-screen "
      style={{ backgroundImage: "url('/images/party.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",objectFit:"cover" }}
    >
      <header>
        <HeaderWelcomePage />
      </header>
      <div>
        <Body></Body>
      </div>
    </main>
  );
}

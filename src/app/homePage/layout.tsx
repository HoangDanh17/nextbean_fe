import MainLayout from "@/layout/mainlayout/Mainlayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
    </div>
  );
}

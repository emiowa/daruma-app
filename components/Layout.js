import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-main-background text-main-grey">
      <Header />
      <main className="flex-grow p-6 pt-24 md:pt-24 lg:pt-40 flex justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};
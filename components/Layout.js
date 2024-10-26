import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div className="text-red-50">{children}</div>
      <Footer />
    </div>
  );
};
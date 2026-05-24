import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Contacts from "./pages/Contacts";
import Promotions from "./pages/Promotions";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/promotions" element={<Promotions />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
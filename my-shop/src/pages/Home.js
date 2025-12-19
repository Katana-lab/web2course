import { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Filters from "../components/Filters";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import productsData from "../data/products";
import Footer from "../components/Footer";


export default function Home() {
  const [sort, setSort] = useState("default");
  const [selectedModel, setSelectedModel] = useState("Усі");
  const [page, setPage] = useState(0);
  const perPage = 4;

  // Filter by model
  const filtered = productsData.filter(
    (p) => selectedModel === "Усі" || p.model === selectedModel
  );

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "cheap") return a.price - b.price;
    if (sort === "expensive") return b.price - a.price;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / perPage);
  const shownProducts = sorted.slice(page * perPage, page * perPage + perPage);

  return (
    <>
      <Header />
      <Navigation />
      <div className="main">
        <Sidebar selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        <div>
          <Filters sort={sort} setSort={setSort} />
          <ProductList products={shownProducts} />
          <Pagination totalPages={totalPages} currentPage={page} setPage={setPage} />
        </div>
      </div>
      <Footer />
    </>
  );
}

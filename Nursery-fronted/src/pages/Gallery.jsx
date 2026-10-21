import React, { useState } from "react";
import { Sparkles, Filter } from "lucide-react";

export default function Gallery() {
  const [filter, setFilter] = useState("all");

  const galleryItems = [
    {
      id: 1,
      title: "Lush Indoor Living Room Garden Setup",
      category: "indoor",
      image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Exotic Terracotta Balcony Landscape",
      category: "balcony",
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Minimalist Ceramic Planter Styling",
      category: "pots",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Monstera & Tropical Foliage Corner",
      category: "indoor",
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Greenhouse Seedling Propagation",
      category: "nursery",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Corporate Office Biophilic Design",
      category: "indoor",
      image: "https://images.unsplash.com/photo-1599598425947-0206455589db?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredItems = filter === "all" ? galleryItems : galleryItems.filter(item => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Botanical Showcase
        </span>
        <h1 className="serif-font text-3xl sm:text-4xl font-bold text-slate-900">
          Nursery Project Gallery
        </h1>
        <p className="text-xs text-slate-500">
          Inspiration for your home garden, balcony transformation, and office indoor plants.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { key: "all", label: "All Works" },
          { key: "indoor", label: "Indoor Setup" },
          { key: "balcony", label: "Balcony Gardens" },
          { key: "pots", label: "Pots & Styling" },
          { key: "nursery", label: "Nursery Hub" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === f.key
                ? "bg-emerald-800 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-md border border-emerald-100/80 aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div className="text-white space-y-1">
                <span className="bg-emerald-600 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
                <h3 className="serif-font font-bold text-base">{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

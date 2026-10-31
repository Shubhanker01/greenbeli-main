// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
// import { useCart } from "../context/CartContext";

// export default function CartDrawer() {
//   const navigate = useNavigate();
//   const { cartItems, updateQuantity, removeFromCart, totalItems, subtotal, isCartOpen, setIsCartOpen } = useCart();

//   if (!isCartOpen) return null;

//   const shippingFee = subtotal > 499 ? 0 : 79;
//   const grandTotal = subtotal + shippingFee;

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden">
//       {/* Overlay Background */}
//       <div
//         onClick={() => setIsCartOpen(false)}
//         className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
//       />

//       <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-50">
//         <div className="w-full sm:w-[420px] bg-white shadow-2xl flex flex-col justify-between border-l border-emerald-100 animate-slide-up sm:animate-fade-in">
          
//           {/* Header */}
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
//             <div className="flex items-center gap-2">
//               <ShoppingBag className="w-5 h-5 text-emerald-800" />
//               <h2 className="serif-font text-lg font-bold text-slate-900">Your Botanical Cart</h2>
//               <span className="bg-emerald-800 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
//                 {totalItems}
//               </span>
//             </div>
//             <button
//               onClick={() => setIsCartOpen(false)}
//               className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Cart Items List */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {cartItems.length === 0 ? (
//               <div className="text-center py-16 space-y-4">
//                 <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
//                   <ShoppingBag className="w-10 h-10" />
//                 </div>
//                 <h3 className="serif-font text-xl font-bold text-slate-800">Your cart is empty</h3>
//                 <p className="text-xs text-slate-500 max-w-xs mx-auto">
//                   Explore our lush plant collection and fill your space with green life!
//                 </p>
//                 <button
//                   onClick={() => {
//                     setIsCartOpen(false);
//                     navigate("/products");
//                   }}
//                   className="bg-emerald-800 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-emerald-900 transition"
//                 >
//                   Explore Plants Now
//                 </button>
//               </div>
//             ) : (
//               cartItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex gap-4 p-3 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 transition shadow-sm"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded-xl bg-emerald-50 flex-shrink-0"
//                   />
//                   <div className="flex-1 flex flex-col justify-between">
//                     <div>
//                       <div className="flex items-start justify-between">
//                         <h4 className="serif-font font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
//                         <button
//                           onClick={() => removeFromCart(item._id)}
//                           className="text-slate-300 hover:text-rose-500 transition p-1"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <p className="text-xs text-emerald-800 font-extrabold mt-1">₹{item.price}</p>
//                     </div>

//                     <div className="flex items-center justify-between mt-2">
//                       <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-2 py-1 bg-slate-50">
//                         <button
//                           onClick={() => updateQuantity(item._id, item.quantity - 1)}
//                           className="text-slate-500 hover:text-emerald-800 p-0.5"
//                         >
//                           <Minus className="w-3.5 h-3.5" />
//                         </button>
//                         <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
//                         <button
//                           onClick={() => updateQuantity(item._id, item.quantity + 1)}
//                           className="text-slate-500 hover:text-emerald-800 p-0.5"
//                         >
//                           <Plus className="w-3.5 h-3.5" />
//                         </button>
//                       </div>

//                       <span className="text-xs font-extrabold text-slate-900">
//                         ₹{item.price * item.quantity}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Footer Summary */}
//           {cartItems.length > 0 && (
//             <div className="p-6 border-t border-slate-100 bg-emerald-50/30 space-y-4">
//               <div className="space-y-1.5 text-xs text-slate-600">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span className="font-bold text-slate-900">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping</span>
//                   <span className="font-bold text-emerald-700">
//                     {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm font-extrabold text-emerald-950 pt-2 border-t border-slate-200">
//                   <span>Grand Total</span>
//                   <span className="text-base text-emerald-800">₹{grandTotal}</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-100/50 p-2.5 rounded-xl">
//                 <ShieldCheck className="w-4 h-4 flex-shrink-0" />
//                 <span>100% Healthy Plant Guarantee + Safe Delivery</span>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <Link
//                   to="/cart"
//                   onClick={() => setIsCartOpen(false)}
//                   className="w-full bg-white border border-emerald-200 text-emerald-900 text-center py-3 rounded-2xl text-xs font-bold hover:bg-emerald-50 transition"
//                 >
//                   View Full Cart
//                 </Link>
//                 <Link
//                   to="/cart"
//                   onClick={() => setIsCartOpen(false)}
//                   className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-center py-3 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-1 transition"
//                 >
//                   Checkout <ArrowRight className="w-3.5 h-3.5" />
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

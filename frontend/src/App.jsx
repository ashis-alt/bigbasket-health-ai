import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Activity, ShoppingCart as CartIcon, AlertCircle, CheckCircle2, Trash2, FileText, Apple, ChevronDown, ChefHat, Clock } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [activeRecipeIdx, setActiveRecipeIdx] = useState(null);

  useEffect(() => {
    if (results) {
      setCartItems(results.shopping_cart.items);
      setCartTotal(results.shopping_cart.total_estimated_price);
      setRecipes(results.shopping_cart.recipes || []);
    }
  }, [results]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a lab report to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    setActiveRecipeIdx(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload-report/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while analyzing the report.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updatedCart);
    
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.buy_quantity), 0);
    setCartTotal(newTotal);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Upload Section */}
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">BigBasket Health AI</h1>
          <p className="text-slate-500 mb-10 text-lg max-w-2xl mx-auto">Upload your lab report to generate a medically-tailored dietary cart instantly.</p>
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-10 bg-emerald-50/50 max-w-3xl mx-auto transition-all hover:bg-emerald-50">
            <UploadCloud className="w-14 h-14 text-emerald-500 mb-6" />
            <input 
              type="file" 
              accept=".pdf, image/jpeg, image/png"
              onChange={handleFileChange}
              className="mb-8 text-sm text-slate-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-colors cursor-pointer"
            />
            <button 
              onClick={handleUpload}
              disabled={loading}
              className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? "AI Agents Analyzing Data..." : "Analyze & Generate Cart"}
            </button>
            {error && <p className="text-red-500 mt-6 text-sm font-semibold bg-red-50 py-2 px-4 rounded-lg">{error}</p>}
          </div>
        </div>

        {/* Results Dashboard */}
        {results && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Health Ingestion Data */}
            <div className="xl:col-span-1 space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg"><Activity className="w-6 h-6 text-blue-600" /></div>
                  <h2 className="text-xl font-bold text-slate-900">Health Profile</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient</p>
                    <p className="font-bold text-lg text-slate-800">{results.report_data.patient_name || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Report Date</p>
                    <p className="font-medium text-slate-800">{results.report_data.report_date || "Unknown"}</p>
                  </div>
                </div>
              </div>

              {/* Critical Flags */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-red-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                  <h2 className="text-xl font-bold text-slate-900">Critical Flags</h2>
                </div>
                {results.report_data.critical_flags.length > 0 ? (
                  <ul className="space-y-3">
                    {results.report_data.critical_flags.map((flag, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-red-700 font-bold bg-red-50 px-4 py-3 rounded-xl text-sm border border-red-100">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl font-bold border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5"/> All critical markers normal.
                  </div>
                )}
              </div>

              {/* Verified Clinical Ledger */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg"><FileText className="w-6 h-6 text-slate-600" /></div>
                  <h2 className="text-xl font-bold text-slate-900">Complete Ledger</h2>
                </div>
                <div className="max-h-[500px] overflow-y-auto pr-4 space-y-1 scrollbar-thin">
                  {results.report_data.biomarkers.map((b, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-3 border-b border-slate-100 last:border-0">
                      <span className="text-slate-700 font-semibold max-w-[160px] md:max-w-none truncate">{b.name}</span>
                      <div className="text-right">
                        <span className={`font-bold text-base ${b.status === 'NORMAL' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {b.value} <span className="text-xs font-medium text-slate-500">{b.unit}</span>
                        </span>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          <span className="uppercase">{b.status}</span> • Range: {b.reference_range}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Execution Modules */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Dynamic Shopping Cart */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 rounded-xl"><CartIcon className="w-7 h-7 text-emerald-700" /></div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Your Medical Cart</h2>
                  </div>
                  <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 text-right">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Estimated Total</p>
                    <p className="text-3xl font-black text-emerald-700">₹{cartTotal}</p>
                  </div>
                </div>

                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md transition-all group">
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-xl text-slate-900 mb-1">{item.name}</h3>
                              <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                                {item.brand} • Qty: {item.buy_quantity}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-black text-2xl text-slate-800">₹{item.price * item.buy_quantity}</p>
                              <button 
                                onClick={() => handleRemoveItem(idx)}
                                className="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100/50">
                            <p className="text-sm text-blue-900 leading-relaxed"><span className="font-bold mr-1">Medical Match:</span> {item.justification}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-semibold text-lg">Your cart is empty.</p>
                  </div>
                )}
              </div>

              {/* Cart-Based Kitchen Recipes */}
              {recipes.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-amber-100 rounded-lg"><ChefHat className="w-6 h-6 text-amber-600" /></div>
                    <h2 className="text-2xl font-bold text-slate-900">AI Kitchen: Cart-Based Recipes</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {recipes.map((recipe, idx) => (
                      <div key={idx} className="p-6 rounded-2xl border border-amber-100 bg-amber-50/20">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
                          <h3 className="font-extrabold text-xl text-slate-900">{recipe.title}</h3>
                          <div className="flex items-center gap-1.5 bg-white border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-700 shadow-sm">
                            <Clock className="w-3.5 h-3.5" /> {recipe.prep_time}
                          </div>
                        </div>
                        
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed italic">
                          <span className="font-bold text-slate-800 not-italic">Clinical Target:</span> {recipe.health_benefit_summary}
                        </p>
                        
                        <div className="mb-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cart Ingredients Utilized:</p>
                          <div className="flex flex-wrap gap-2">
                            {recipe.ingredients_used.map((ing, iIdx) => (
                              <span key={iIdx} className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setActiveRecipeIdx(activeRecipeIdx === idx ? null : idx)}
                          className="flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors bg-white px-5 py-2.5 rounded-xl border border-amber-200 shadow-sm w-full justify-between"
                        >
                          {activeRecipeIdx === idx ? "Hide Cooking Steps" : "View Step-by-Step Cooking Steps"}
                          <ChevronDown className={`w-4 h-4 transition-transform ${activeRecipeIdx === idx ? 'rotate-180' : ''}`} />
                        </button>

                        {activeRecipeIdx === idx && (
                          <div className="mt-4 p-5 bg-white rounded-xl border border-amber-100 shadow-inner space-y-3 animate-fadeIn">
                            <p className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-1">Preparation Instructions:</p>
                            <ol className="list-decimal pl-5 text-slate-700 text-sm space-y-2.5 font-medium">
                              {recipe.steps.map((step, sIdx) => (
                                <li key={sIdx} className="leading-relaxed pl-1">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkout Trigger */}
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-center">
                <button 
                  disabled={cartItems.length === 0}
                  className="w-full bg-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:bg-emerald-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  Confirm & Route Order to BigBasket
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
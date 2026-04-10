import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Zap, LayoutGrid, PlusCircle, Archive, LogOut, User, Cpu, CheckCircle, Clock, Activity, ArrowLeft, UserPlus } from 'lucide-react';

const API_URL = "https://online-smart-complain-management.onrender.com/api/tickets";
const AUTH_URL = "https://online-smart-complain-management.onrender.com/api/auth";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [view, setView] = useState("select");
  const [role, setRole] = useState("");
  const [tab, setTab] = useState("dash");
  const [userName, setUserName] = useState("");
  const [inputFullName, setInputFullName] = useState("");
  const [inputUser, setInputUser] = useState("");
  const [error, setError] = useState("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [history, setHistory] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(API_URL);
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuth) fetchTickets();
  }, [isAuth]);

  // Success Rate Logic: Calculation based on Resolved vs Total
  const resolvedCount = history.filter((t) => t.status === "Resolved").length;
  const totalCount = history.length;
  const successRate =
    totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${AUTH_URL}/login`, {
        username: inputUser,
        password: inputPass,
        role,
      });
      if (response.data.success) {
        setUserName(response.data.user.fullName);
        setIsAuth(true);
        setView("portal");
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed!");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${AUTH_URL}/signup`, {
        fullName: inputFullName,
        username: inputUser,
        password: inputPass,
        role: "Resident",
      });
      alert("Resident Account Created Successfully!");
      setView("login");
      setInputFullName("");
      setInputUser("");
      setInputPass("");
    } catch (err) {
      alert(err.response?.data?.error || "Signup Failed!");
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketTitle) return alert("Please enter a subject");
    const newTicket = {
      ticketId: `TK-${Math.floor(8000 + Math.random() * 999)}`,
      title: ticketTitle,
      description: ticketDesc,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Pending",
      userName: userName,
    };
    try {
      const response = await axios.post(API_URL, newTicket);
      setHistory([response.data, ...history]);
      alert("Ticket submitted successfully!");
      setTicketTitle("");
      setTicketDesc("");
      setTab("records");
    } catch (err) {
      alert("Database error!");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      fetchTickets();
      alert("Status Updated!");
    } catch (err) {
      alert("Update Failed!");
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    setView("select");
    setRole("");
    setUserName("");
    setInputUser("");
    setInputPass("");
    setError("");
  };

  if (view === "select")
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] px-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black mb-10 tracking-tight uppercase italic text-slate-900">
            SmartFix
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                setRole("Resident");
                setView("login");
              }}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700"
            >
              Resident Access
            </button>
            <button
              onClick={() => {
                setRole("Administrator");
                setView("login");
              }}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black"
            >
              Admin Control
            </button>
          </div>
        </div>
      </div>
    );

  if (view === "login")
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] px-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border-b-8 border-blue-600">
          <button
            onClick={() => setView("select")}
            className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Return
          </button>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase italic text-slate-900">
              Login
            </h2>
            <span className="text-blue-600 font-black text-[9px] uppercase tracking-widest mt-1 bg-blue-50 px-3 py-1 rounded-full inline-block">
              {role}
            </span>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none text-slate-900"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none text-slate-900"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              required
            />
            {error && (
              <p className="text-red-500 text-[9px] font-black uppercase text-center">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest"
            >
              LOGIN
            </button>
          </form>
          {role === "Resident" && (
            <button
              onClick={() => setView("signup")}
              className="mt-8 w-full text-blue-600 font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:underline"
            >
              <UserPlus size={16} /> NEW REGISTRATION
            </button>
          )}
        </div>
      </div>
    );

  if (view === "signup")
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] px-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 italic uppercase text-slate-900 border-b-2 border-slate-50 pb-4">
            Create Account
          </h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none text-slate-900"
              value={inputFullName}
              onChange={(e) => setInputFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none text-slate-900"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Create Password"
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none text-slate-900"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-4 uppercase text-xs tracking-widest"
            >
              Register Resident Account
            </button>
            <button
              type="button"
              onClick={() => setView("login")}
              className="w-full text-slate-400 font-black py-2 text-[10px] uppercase"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-900">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
        <div className="p-8 flex items-center gap-3 border-b border-slate-50">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
            <Zap />
          </div>
          <span className="font-black text-2xl uppercase italic text-slate-900">
            SmartFix
          </span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <button
            onClick={() => setTab("dash")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest ${tab === "dash" ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : "text-slate-400"}`}
          >
            <LayoutGrid size={20} /> Dashboard
          </button>
          {role === "Resident" && (
            <button
              onClick={() => setTab("form")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest ${tab === "form" ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : "text-slate-400"}`}
            >
              <PlusCircle size={20} /> New Ticket
            </button>
          )}
          <button
            onClick={() => setTab("records")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest ${tab === "records" ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : "text-slate-400"}`}
          >
            <Archive size={20} /> History
          </button>
        </nav>
        <div className="p-8 border-t border-slate-50 font-bold">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={20} /> LOG OUT
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-24 bg-white/80 border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-10 font-bold">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">
            {tab}
          </h2>
          <div className="flex items-center gap-8 border-l border-slate-100 pl-8">
            <div className="text-right leading-none">
              <p className="text-sm font-black text-slate-800 uppercase">
                {userName}
              </p>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-widest">
                {role}
              </span>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-inner">
              <User />
            </div>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto w-full">
          {tab === "dash" && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                  icon={<CheckCircle size={32} className="text-emerald-600" />}
                  count={resolvedCount}
                  label="Resolved"
                />
                <StatCard
                  icon={<Clock size={32} className="text-amber-600" />}
                  count={totalCount - resolvedCount}
                  label="Pending"
                />
                <StatCard
                  icon={<Activity size={32} className="text-blue-600" />}
                  count={`${successRate}%`}
                  label="Success Rate"
                />
              </div>
              <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-xl">
                  <h3 className="text-4xl font-black mb-4 uppercase italic">
                    Cloud Active
                  </h3>
                  <p className="text-slate-400 text-lg font-medium mb-8 italic">
                    Synced with MongoDB Atlas Database.
                  </p>
                  <button
                    onClick={fetchTickets}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-700"
                  >
                    Refresh Data
                  </button>
                </div>
                <Cpu
                  size={250}
                  className="absolute -right-10 -bottom-10 text-white opacity-5 rotate-12"
                />
              </div>
            </div>
          )}

          {tab === "form" && (
            <div className="max-w-4xl mx-auto bg-white p-14 rounded-[3.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-3xl font-black mb-10 uppercase italic text-slate-800 border-b border-slate-100 pb-6 underline decoration-blue-600 underline-offset-8">
                New Ticket
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-3 block">
                    Subject Headline
                  </label>
                  <input
                    type="text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Summary of the issue..."
                    className="w-full p-5 bg-slate-50 border-none rounded-3xl font-bold outline-none text-slate-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-3 block">
                    Incident Report
                  </label>
                  <textarea
                    rows="6"
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full p-6 bg-slate-50 border-none rounded-3xl font-medium text-lg outline-none text-slate-900"
                    placeholder="Provide details here..."
                  ></textarea>
                </div>
              </div>
              <button
                onClick={handleCreateTicket}
                className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black shadow-xl hover:bg-blue-700 uppercase text-[10px] tracking-widest"
              >
                SUBMIT TO DATABASE
              </button>
            </div>
          )}

          {tab === "records" && (
            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden p-4 shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-8 text-[11px] font-black uppercase text-slate-400">
                      Ticket ID
                    </th>
                    <th className="p-8 text-[11px] font-black uppercase text-slate-400">
                      Description
                    </th>
                    <th className="p-8 text-[11px] font-black uppercase text-slate-400 text-center">
                      Timeline
                    </th>
                    <th className="p-8 text-[11px] font-black uppercase text-slate-400 text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/50 transition-all"
                    >
                      <td className="p-8 font-black text-blue-600 text-sm italic">
                        {item.ticketId}
                      </td>
                      <td className="p-8 text-slate-800 font-bold">
                        {item.title}
                      </td>
                      <td className="p-8 text-[12px] font-black text-slate-400 italic text-center">
                        {item.date}
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === "Resolved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                          >
                            {item.status}
                          </span>
                          {role === "Administrator" &&
                            item.status !== "Resolved" && (
                              <button
                                onClick={() =>
                                  updateStatus(item._id, "Resolved")
                                }
                                className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-all"
                                title="Mark as Resolved"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ icon, count, label }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-b-blue-600 border-b-4 transition-all shadow-sm">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
      {icon}
    </div>
    <h4 className="text-6xl font-black mb-1 tracking-tighter text-slate-800">
      {count}
    </h4>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {label}
    </p>
  </div>
);

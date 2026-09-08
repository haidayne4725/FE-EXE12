import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout() { return <div className="app-shell"><Header /><Outlet /><Footer /></div>; }

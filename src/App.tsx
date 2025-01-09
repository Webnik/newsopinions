import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleEditor from "@/pages/ArticleEditor";
import Auth from "@/pages/Auth";
import UserProfile from "@/pages/UserProfile";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/new-article" element={<ArticleEditor />} />
        <Route path="/edit-article/:id" element={<ArticleEditor />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
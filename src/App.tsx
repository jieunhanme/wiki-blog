import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import EditorPage from "./pages/EditorPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Home />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/write" element={<EditorPage />} />
        <Route path="/edit/:id" element={<EditorPage />} />
      </Routes>
    </Layout>
  );
}

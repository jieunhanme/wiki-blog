import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchPosts } from "../lib/api";
import { getCategoryById } from "../lib/categories";
import PostCard from "../components/PostCard";
import type { Post } from "../lib/types";
import styles from "./Home.module.css";

export default function Home() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPosts({ category: categoryId, search })
      .then(setPosts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  const title = search
    ? `"${search}" 검색 결과`
    : categoryId
      ? getCategoryById(categoryId).label
      : "전체 글";

  return (
    <div>
      <h1 className={styles.title}>{title}</h1>

      {loading && <p className={styles.message}>불러오는 중...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className={styles.message}>게시글이 없습니다.</p>
      )}

      <div className={styles.grid}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { fetchPost, deletePost } from '../lib/api';
import { getCategoryById } from '../lib/categories';
import { useAuth } from '../lib/AuthContext';
import type { Post } from '../lib/types';
import styles from './PostPage.module.css';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchPost(id)
      .then(setPost)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id || !window.confirm('정말 삭제하시겠습니까?')) return;
    await deletePost(id);
    navigate('/');
  };

  if (loading) return <p className={styles.loading}>불러오는 중...</p>;
  if (!post) return null;

  const category = getCategoryById(post.category);
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <article className={styles.article}>
      <Link to="/" className={styles.back}>
        <FiArrowLeft size={16} />
        목록으로
      </Link>

      <header className={styles.header}>
        <span className={styles.category} style={{ background: category.color + '20', color: category.color }}>
          {category.label}
        </span>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <time>{formatDate(post.created_at)}</time>
          {post.updated_at !== post.created_at && (
            <span>(수정: {formatDate(post.updated_at)})</span>
          )}
        </div>
        {isAdmin && (
          <div className={styles.actions}>
            <Link to={`/edit/${post.id}`} className={styles.editBtn}>
              <FiEdit2 size={14} /> 수정
            </Link>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              <FiTrash2 size={14} /> 삭제
            </button>
          </div>
        )}
      </header>

      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}

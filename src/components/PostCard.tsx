import { Link } from 'react-router-dom';
import { getCategoryById } from '../lib/categories';
import type { Post } from '../lib/types';
import styles from './PostCard.module.css';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const category = getCategoryById(post.category);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getExcerpt = (content: string) => {
    const text = content.replace(/[#*`>\[\]!_~|]/g, '').replace(/\n+/g, ' ');
    return text.length > 120 ? text.slice(0, 120) + '...' : text;
  };

  return (
    <Link to={`/post/${post.id}`} className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.category} style={{ background: category.color + '20', color: category.color }}>
          {category.label}
        </span>
        <span className={styles.date}>{formatDate(post.created_at)}</span>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{getExcerpt(post.content)}</p>
    </Link>
  );
}

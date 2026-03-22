import { NavLink } from 'react-router-dom';
import { FiHome, FiFolder } from 'react-icons/fi';
import { CATEGORIES } from '../lib/categories';
import styles from './Sidebar.module.css';

interface Props {
  onNavigate: () => void;
}

export default function Sidebar({ onNavigate }: Props) {
  return (
    <nav className={styles.nav}>
      <div className={styles.section}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          onClick={onNavigate}
        >
          <FiHome size={16} />
          <span>전체 글</span>
        </NavLink>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>카테고리</div>
        {CATEGORIES.map((cat) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.id}`}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            onClick={onNavigate}
          >
            <FiFolder size={16} />
            <span>{cat.label}</span>
            <span className={styles.dot} style={{ background: cat.color }} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

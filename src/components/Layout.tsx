import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSidebarOpen(false);
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="메뉴 토글"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <Link to="/" className={styles.logo}>
            Wiki Blog
          </Link>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <FiSearch className={styles.searchIcon} size={16} />
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>

        <Link to="/write" className={styles.writeBtn}>
          <FiPlus size={18} />
          <span>새 글</span>
        </Link>
      </header>

      <div className={styles.body}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </aside>
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

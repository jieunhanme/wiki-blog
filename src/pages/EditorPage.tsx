import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { FiEye, FiEdit, FiImage, FiSave } from "react-icons/fi";
import { fetchPost, createPost, updatePost, uploadImage } from "../lib/api";
import { CATEGORIES } from "../lib/categories";
import { useAuth } from "../lib/AuthContext";
import styles from "./EditorPage.module.css";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    if (isEdit && id) {
      fetchPost(id).then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
      });
    }
  }, [id, isEdit, isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const { url } = await uploadImage(file);
        const imageMarkdown = `![${file.name}](${url})`;
        const textarea = textareaRef.current;
        const pos = textarea?.selectionStart ?? content.length;
        const newContent =
          content.slice(0, pos) + imageMarkdown + content.slice(pos);
        setContent(newContent);
      } catch (err) {
        alert("이미지 업로드에 실패했습니다: " + (err as Error).message);
      }
    };
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await updatePost(id, { title, content, category });
        navigate(`/post/${id}`);
      } else {
        const post = await createPost({ title, content, category });
        navigate(`/post/${post.id}`);
      }
    } catch (err) {
      alert("저장에 실패했습니다: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.editor} onSubmit={handleSubmit}>
      <div className={styles.toolbar}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.select}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        <div className={styles.toolbarRight}>
          <button
            type="button"
            onClick={handleImageUpload}
            className={styles.toolBtn}
            title="이미지 삽입"
          >
            <FiImage size={18} />
          </button>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className={`${styles.toolBtn} ${preview ? styles.toolBtnActive : ""}`}
            title={preview ? "편집" : "미리보기"}
          >
            {preview ? <FiEdit size={18} /> : <FiEye size={18} />}
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            <FiSave size={16} />
            {saving ? "저장 중..." : isEdit ? "수정" : "저장"}
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.titleInput}
      />

      {preview ? (
        <div className={`${styles.previewArea} markdown-body`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          placeholder="마크다운으로 내용을 작성하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
        />
      )}
    </form>
  );
}

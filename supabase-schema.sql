-- Supabase에서 실행할 SQL
-- 1. posts 테이블 생성
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  category text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. 검색을 위한 인덱스
create index idx_posts_category on posts(category);
create index idx_posts_created_at on posts(created_at desc);

-- 3. RLS (Row Level Security) 비활성화 (개인 블로그이므로)
alter table posts enable row level security;
create policy "Allow all" on posts for all using (true) with check (true);

-- 4. 이미지 저장을 위한 Storage 버킷 생성 (Supabase 대시보드에서 실행)
-- Storage > New bucket > Name: images > Public: true

export interface BlogArticle {
  slug: string;
  title: string;
  date: string;
  path: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
  image?: string;
  external?: string[];
  comments?: boolean;
}

export interface BlogCardProps {
  article: BlogArticle;
}

export interface BlogListProps {
  articles: BlogArticle[];
}

export interface TagProps {
  tag: string;
  count?: number;
}

export interface TagCloudProps {
  articles: BlogArticle[];
  limit?: number;
}
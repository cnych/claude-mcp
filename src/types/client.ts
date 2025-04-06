export interface MCPClient {
  id: string;
  name: string;
  description: string;
  digest: string;
  author: string;
  homepage?: string;
  icon?: string;
  repository?: string;
  featured?: boolean;
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
    web: boolean;
    ios: boolean;
    android: boolean;
  };
  tags: string[];
  createTime: string;
}

export interface ClientSearchParams {
  keyword?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
} 
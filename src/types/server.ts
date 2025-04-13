export interface MCPServer {
  id: string;
  name: string;
  description: string;
  digest: string;
  author: string;
  homepage?: string;
  icon?: string;
  repository?: string;
  capabilities: {
    resources: boolean;
    tools: boolean;
    prompts: boolean;
  };
  tags: string[];
  createTime: string;
  featured?: boolean;
}

export interface ServerSearchParams {
  keyword?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
} 
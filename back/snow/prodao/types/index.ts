export interface BaseDaoOptions {
  tableName: string;
  primaryKey?: string;
}

export interface limitOptions {
  page: number;
  size: number;
}

export interface OrderOptions {
  dirc: 'desc' | 'asc';
  field: string;
}

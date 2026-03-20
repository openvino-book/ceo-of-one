export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  published?: boolean;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  instructor?: string;
  price?: number;
  category?: string;
  published?: boolean;
}

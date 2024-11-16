export interface TaskModel{
    id: string;
    order: number;
    content: string;
    description: string;
    projectId: string;
    isCompleted: boolean;
    labels: string[];
    priority: number;
    commentCount: number;
    createdAt: string;
    url: string;
    creatorId: string;
    due: { date: string; string: string; lang: string; is_recurring: boolean } | null;  // Typ dla due
    dueDate: string;
    isDescriptionVisible?: boolean;
  }
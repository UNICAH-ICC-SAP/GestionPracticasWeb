export type Document = {
    id: number;
    title: string;
    description: string;
    file: string;
    exampleDocument?: string;
    status: 'pending' | 'delivered' | 'change_requested';
    needsChange?: boolean;
}
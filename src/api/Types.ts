export interface PaginationParams {
    skip?: number;
    limit?: number;
    search_term?: string;
}

export interface Message {
    id: string;
    message: string;
    send_at: string;
    messageType: string;
    clicked_at?: string | null;
    feedback?: string | null;
    tracking_id?: string | null;
}
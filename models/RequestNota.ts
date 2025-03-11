export interface RequestNota{
    id?: number;
    request_id: number;
    nota_client: string;
    nota_provider: string;
    created_at?:string
    updated_at?:string;
}
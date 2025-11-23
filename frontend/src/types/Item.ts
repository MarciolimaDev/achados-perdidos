
interface Item {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    data_encontrado: string;
    status: "DISPONIVEL" | "RESGATADO";
    foto_url?: string;
}
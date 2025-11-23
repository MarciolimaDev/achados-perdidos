"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import { List, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { listarItens } from "@/services/api/itens.service";

interface Item {
  id: number;
  codigo_do_item: string;
  titulo: string;
  descricao: string;
  data_encontrado: string;
  foto?: string;
  status: string;
  categoria?: string;
}

export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar itens
  useEffect(() => {
    async function load() {
      try {
        const data = await listarItens();
        // Normaliza diferentes formatos de resposta da API
        // Alguns backends retornam { results: [...] } ou { items: [...] }
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data && Array.isArray((data as any).results)) {
          setItems((data as any).results);
        } else if (data && Array.isArray((data as any).items)) {
          setItems((data as any).items);
        } else {
          // Fallback: tenta extrair o primeiro array encontrado ou usa vazio
          const arr = Object.values(data || {}).find((v) => Array.isArray(v));
          if (Array.isArray(arr)) setItems(arr as Item[]);
          else setItems([]);
        }
      } catch {
        toast.error("Erro ao carregar itens");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = items;

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => 
        item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm.length > 0) {
      filtered = filtered.filter((item) =>
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo_do_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [items, statusFilter, searchTerm]);

  const safeFilteredItems = Array.isArray(filteredItems) ? filteredItems : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* TÍTULO */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <List className="h-8 w-8 text-primary" />
          Todos os Itens
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualize e filtre todos os itens cadastrados
        </p>
      </div>

      {/* FILTROS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Campo de busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Título, código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Seleção de status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="DISPONIVEL">Aguardando</SelectItem>
                  <SelectItem value="RESGATADO">Resgatados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LISTA */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando itens...
        </div>
      ) : safeFilteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum item encontrado com os filtros selecionados
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safeFilteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">

              {/* FOTO */}
              {item.foto && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img 
                    src={item.foto}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* CONTEÚDO */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">{item.titulo}</CardTitle>

                  <Badge variant={item.status === "RESGATADO" ? "secondary" : "default"}>
                    {item.status === "RESGATADO" ? "Resgatado" : "Aguardando"}
                  </Badge>
                </div>

                <CardDescription className="font-mono text-xs">
                  {item.codigo_do_item}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.descricao}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>{item.categoria || "Sem categoria"}</span>
                  <span>{format(new Date(item.data_encontrado), "dd/MM/yyyy")}</span>
                </div>
              </CardContent>

            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

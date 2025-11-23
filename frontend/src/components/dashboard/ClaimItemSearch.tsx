"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { apiGet } from "@/services/api/api";
import { atualizarStatusItem as atualizarStatusItemService } from "@/services/api/itens.service";

interface Item {
  id: number;
  codigo_do_item: string;
  titulo: string;
  descricao: string;
  foto?: string;
  status: string;
  categoria: string;
  data_encontrado: string;
}

export default function ClaimItemSearch() {
  const [searchCode, setSearchCode] = useState("");
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);

  async function buscarItem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setItem(null);

    try {
      const data = await apiGet(`itens/?codigo=${searchCode.toUpperCase()}`);

      // Normaliza diferentes formatos de resposta da API
      // alguns endpoints retornam { results: [...] } ou { value: [...] }
      let arr: any[] = [];
      if (Array.isArray(data)) arr = data;
      else if (data && Array.isArray((data as any).results)) arr = (data as any).results;
      else if (data && Array.isArray((data as any).items)) arr = (data as any).items;
      else if (data && Array.isArray((data as any).value)) arr = (data as any).value;
      else {
        const found = Object.values(data || {}).find((v) => Array.isArray(v));
        if (Array.isArray(found)) arr = found as any[];
      }

      if (!arr || arr.length === 0) {
        toast.error("Item não encontrado");
        return;
      }

      // Procurar pelo código exato entre os resultados para evitar pegar o primeiro item
      const match = arr.find((it: any) => (it.codigo_do_item || "").toString().toUpperCase() === searchCode.toUpperCase());

      if (!match) {
        toast.error("Item não encontrado");
        return;
      }

      setItem(match);

      if (match.status === "RESGATADO") {
        toast.info("Este item já foi resgatado");
      }
    } catch {
      toast.error("Erro ao buscar item");
    } finally {
      setLoading(false);
    }
  }

  async function confirmarResgate() {
    if (!item) return;

    setLoading(true);
    console.debug("confirmarResgate called", { item });

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("Usuário não autenticado");
        setLoading(false);
        return;
      }

      // chama o serviço que faz PATCH com Authorization
      await atualizarStatusItemService(item.id, token);

      toast.success("Item marcado como resgatado!");

      setItem({ ...item, status: "RESGATADO" });
    } catch (err: any) {
      // mostra mais detalhes no console para depuração
      console.error("Erro ao dar baixa no item", err);
      if (err?.message) toast.error(`Erro: ${err.message}`);
      else toast.error("Erro ao dar baixa no item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* TÍTULO */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8 text-primary" />
          Dar Baixa em Item
        </h1>
        <p className="text-muted-foreground mt-1">
          Busque pelo código do item para registrar o resgate.
        </p>
      </div>

      {/* CARD DE BUSCA */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Item</CardTitle>
          <CardDescription>Digite o código do item para encontrá-lo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={buscarItem} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: AP12Z345"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                required
              />
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ITEM ENCONTRADO */}
      {item && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{item.titulo}</CardTitle>
                <CardDescription>
                  Código:{" "}
                  <span className="font-mono font-bold">
                    {item.codigo_do_item}
                  </span>
                </CardDescription>
              </div>

              <Badge
                variant={item.status === "RESGATADO" ? "secondary" : "default"}
              >
                {item.status === "RESGATADO" ? "Resgatado" : "Aguardando"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* FOTO */}
            {item.foto && (
              <img
                src={item.foto}
                className="w-full h-64 object-cover rounded border"
                alt="Foto do item"
              />
            )}

            {/* Informações */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Categoria</Label>
                <p className="font-medium">{item.categoria}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Data Encontrado</Label>
                <p className="font-medium">
                  {format(new Date(item.data_encontrado), "PPP", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p>{item.descricao}</p>
            </div>

            {/* DAR BAIXA */}
            {item.status === "DISPONIVEL" && (
              <div className="space-y-4 pt-4 border-t">
                <Button
                  onClick={confirmarResgate}
                  className="w-full"
                  disabled={loading}
                  size="lg"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirmar Resgate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Note: status update is handled by `atualizarStatusItemService` from itens.service

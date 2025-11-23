"use client";

import { useEffect, useState } from "react";
import { listarItensPaginado } from "@/services/api/itens.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Item {
  id: number;
  titulo: string;
  descricao: string;
  codigo_do_item: string;
  status: string;
  foto?: string;
  categoria?: string;
  data_encontrado: string;
}

export default function PublicItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await listarItensPaginado(page);

        // filtrar apenas DISPONÍVEIS
        const disponiveis = data.results.filter(
          (item: Item) => item.status === "DISPONIVEL"
        );

        setItems(disponiveis);
        setNext(data.next);
        setPrevious(data.previous);
        setTotal(data.count);
      } catch (error) {
        console.error("Erro ao carregar itens", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page]);

  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Carregando itens disponíveis...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Itens Disponíveis
      </h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">
          Nenhum item disponível no momento.
        </p>
      ) : (
        <>
          {/* GRID */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow hover:shadow-lg transition">
                
                {/* Imagem com modal */}
                {item.foto && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer">
                        <img
                          src={item.foto}
                          alt={item.titulo}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl p-0 overflow-hidden">
                      <img src={item.foto} className="w-full" />
                    </DialogContent>
                  </Dialog>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{item.titulo}</CardTitle>
                    <Badge>Disponível</Badge>
                  </div>

                  <CardDescription className="font-mono text-xs">
                    Código: {item.codigo_do_item}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.descricao}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>{item.categoria || "Sem categoria"}</span>
                    <span>
                      {format(new Date(item.data_encontrado), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PAGINAÇÃO */}
          <div className="flex justify-center gap-4 mt-10">
            <Button
              variant="outline"
              disabled={!previous}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </Button>

            <Button
              variant="outline"
              disabled={!next}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

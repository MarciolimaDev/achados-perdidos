"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { Package, Upload, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";

import { listarCategorias, adicionarItem } from "@/services/api/itens.service";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface Categoria {
  id: number | string;
  nome: string;
}

export default function NewItemForm() {
  const router = useRouter();

  // Campos do form
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [foundDate, setFoundDate] = useState<Date | undefined>();
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState("");

  const [loading, setLoading] = useState(false);

  // Carrega categorias
  useEffect(() => {
    async function load() {
      try {
        const cats = await listarCategorias();
        setCategorias(cats);
      } catch {
        toast.error("Erro ao carregar categorias.");
      }
    }
    load();
  }, []);

  // Preview da foto
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFoto(file);

    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) return router.push("/login");

    if (!foundDate) {
      toast.error("Selecione a data que o item foi encontrado.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("categoria", categoriaId);
    formData.append("data_encontrado", format(foundDate, "yyyy-MM-dd"));
    formData.append("status", "DISPONIVEL");
    if (foto) formData.append("foto", foto);

    try {
      const novoItem = await adicionarItem(formData, token);

      // SWEET ALERT2 --- Sucesso
      Swal.fire({
        icon: "success",
        title: "Item cadastrado com sucesso!",
        html: `
          <p><b>Código do Item:</b> <span style="font-size:20px;">${novoItem.codigo_do_item} </span></p>
          <p style="margin-top:10px;">Coloque esse código na etiqueta do item para facilitar a busca.</p>
        `,
        confirmButtonText: "Ok",
        confirmButtonColor: "#2563eb",
      });
      
      // Reset
      setTitulo("");
      setDescricao("");
      setCategoriaId("");
      setFoundDate(undefined);
      setFoto(null);
      setFotoPreview("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Título */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          Cadastrar Novo Item
        </h1>
        <p className="text-muted-foreground mt-1">
          Preencha as informações do item encontrado
        </p>
      </div>

      {/* Card do Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Item</CardTitle>
          <CardDescription>
            Um código único será gerado automaticamente após o cadastro.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Título + Categoria */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input 
                  placeholder="Ex: garrafinha azul"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={categoriaId} onValueChange={setCategoriaId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Textarea
                placeholder="Descreva o item encontrado..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label>Data que o item foi encontrado *</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !foundDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {foundDate ? format(foundDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={foundDate}
                    onSelect={setFoundDate}
                    locale={ptBR}
                    disabled={(d) => d > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Foto */}
            <div className="space-y-2">
              <Label>Foto do item</Label>

              <div className="flex items-center gap-4">
                <Input
                  id="foto"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />

                <Label
                  htmlFor="foto"
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Foto
                </Label>

                {fotoPreview && (
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded border"
                  />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Item"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}



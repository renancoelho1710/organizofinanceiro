import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ImportExcel() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV ou Excel",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao importar arquivo');
      }
      
      const data = await response.json();
      
      toast({
        title: "Importação concluída",
        description: data.message,
      });
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
      
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };
  
  return (
    <div className="mt-6 px-4 sm:px-0">
      <div className="bg-primary/5 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-shrink-0 flex items-center mb-4 md:mb-0">
              <i className="fas fa-file-excel text-3xl text-primary mr-4"></i>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Não comece do zero!
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Importe os dados da sua planilha e continue seu controle financeiro de onde parou.
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <label className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <i className="fas fa-upload mr-2"></i>
                {isUploading ? 'Importando...' : 'Importar Planilha'}
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

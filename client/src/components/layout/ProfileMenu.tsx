import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiSettings, 
  FiLogOut, 
  FiBell
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  enableWhatsapp: z.boolean().default(false),
  enableSMS: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileMenuProps {
  userData: {
    name: string;
    email: string;
    username: string;
    phone?: string;
    notificationPreferences?: {
      whatsapp: boolean;
      sms: boolean;
    }
  };
}

export default function ProfileMenu({ userData }: ProfileMenuProps) {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      enableWhatsapp: userData.notificationPreferences?.whatsapp || false,
      enableSMS: userData.notificationPreferences?.sms || false,
    },
  });
  
  const onSubmitProfile = (data: ProfileFormValues) => {
    // Aqui seria feita a chamada para a API para atualizar os dados do perfil
    console.log("Dados do perfil atualizados:", data);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso",
      variant: "default",
    });
    
    setProfileDialogOpen(false);
  };
  
  const updateNotificationSettings = (data: ProfileFormValues) => {
    // Aqui seria feita a chamada para a API para atualizar as preferências de notificação
    console.log("Preferências de notificação atualizadas:", {
      whatsapp: data.enableWhatsapp,
      sms: data.enableSMS
    });
    
    toast({
      title: "Preferências atualizadas",
      description: "Suas preferências de notificação foram atualizadas",
      variant: "default",
    });
    
    setNotificationDialogOpen(false);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={userData.name} />
              <AvatarFallback className="bg-primary text-white">
                {userData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
              <FiUser className="mr-2 h-4 w-4" />
              <span>Editar perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNotificationDialogOpen(true)}>
              <FiBell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FiSettings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FiLogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para edição do perfil */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações pessoais aqui.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Seu email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Seu telefone" {...field} />
                    </FormControl>
                    <FormDescription>
                      Usado para notificações por WhatsApp ou SMS, se ativado.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Salvar alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para configurações de notificação */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Preferências de notificação</DialogTitle>
            <DialogDescription>
              Escolha como deseja ser notificado sobre suas contas e pendências.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateNotificationSettings)} className="space-y-4">
              <FormField
                control={form.control}
                name="enableWhatsapp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        <FaWhatsapp className="mr-2 text-green-600" />
                        WhatsApp
                      </FormLabel>
                      <FormDescription>
                        Receba notificações pelo WhatsApp sobre suas contas.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enableSMS"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        <FiPhone className="mr-2 text-blue-600" />
                        SMS
                      </FormLabel>
                      <FormDescription>
                        Receba lembretes por SMS quando uma conta estiver próxima do vencimento.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Salvar preferências</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
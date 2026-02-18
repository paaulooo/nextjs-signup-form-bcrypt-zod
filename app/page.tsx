'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input';
import { UserDTO } from '@/models/user';
import { User } from '@/models/user';
import { createUser } from '@/services/user-service';

import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner'
import { userLogin, userLoginDTO } from '@/models/user-login'

export default function RegisterForm() {
  const registerForm = useForm<UserDTO>({
    resolver: zodResolver(User),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: ""
    }
  })
  const loginForm = useForm<userLoginDTO> ({
    resolver: zodResolver(userLogin),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onRegisterSubmit(data: UserDTO) {
    try {
      console.log(data)
      const response = await createUser(data)
      console.log(response)

      if (!response.success && response.errors) {
        if ('email' in response.errors && response.errors.email) {
          registerForm.setError("email", {
            type: "manual",
            message: response.errors.email[0]
          })
        }
      } else {
        toast.success("Usuário foi cadastrado com sucesso!", { position: "top-center" })
        console.log('SUCESS')
      }
    } catch (error) {
      console.error('Error : ', error)
      console.log("Try again!")
    }
  }

  // login onSubmit
  async function onLoginSubmit(data:userLoginDTO) {
    try{
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if(!response.ok){
        toast.error(result.error || "Falha ao entrar!")
        return
      }else {
        toast.success(`Bem vindo, ${result.user.name}!`)
        console.log("LOGADO")
      }

      


      //Salva o token
      localStorage.setItem('auth-token', result.token);

    }catch(error){
      console.error(error)
      toast.error("Erro de conexão")
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans dark:bg-black">
      <Toaster />
      <main className="flex flex-row gap-9 min-h-screen w-full max-w-5xl items-center justify-between py-32 px-16 bg-black dark:bg-black sm:items-start">
        <Card className='bg-black text-white mx-auto w-[400px] max-w-sm'>
          <CardHeader>
            <CardTitle className='text-center text-3xl'>Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                <div className='grid gap-4'>
                  <FormField
                    control={registerForm.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='name'>Nome</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder='João' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <FormField
                    control={registerForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <FormControl>
                          <Input id="email" placeholder='João@gmail.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <FormField
                    control={registerForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='password'>Senha</FormLabel>
                        <FormControl>
                          <Input type='password' id="password" placeholder='Insira sua senha...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField
                    control={registerForm.control}
                    name='confirm_password'
                    render={({ field }) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor=''>Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input type='password' id="confirm_password" placeholder='Insira sua senha novamente...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <Button type='submit'
                    className='w-full bg-white text-black hover:bg-violet-600 hover:text-white hover:cursor-pointer'>
                    Registrar-se

                  </Button>

                </div>
              </form>
            </Form>
          </CardContent>

        </Card>



        <Card className='bg-black text-white mx-auto w-[400px] max-w-sm'>
          <CardHeader>
            <CardTitle className='text-center text-3xl'>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <div className='grid gap-4'>


                  <FormField
                    control={loginForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='email-login'>Email</FormLabel>
                        <FormControl>
                          <Input id="email-login" placeholder='João@gmail.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <FormField
                    control={loginForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='password'>Senha</FormLabel>
                        <FormControl>
                          <Input type='password' id="password" placeholder='Insira sua senha...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />


                  <Button type='submit'
                    className='w-full bg-white text-black hover:bg-violet-600 hover:text-white hover:cursor-pointer'>
                    Entrar

                  </Button>

                </div>
              </form>
            </Form>
          </CardContent>

        </Card>


      </main>
    </div>
  );
}

'use client'


import * as z from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

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

export default function RegisterForm(){
  const form = useForm<UserDTO>({
    resolver: zodResolver(User),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: ""
    }
  })

  async function onSubmit(data: UserDTO){
    try{
      console.log(data)
      const response = await createUser(data)
      console.log(response)

      if (!response.success && response.errors){
        if('email' in response.errors && response.errors.email){
          form.setError("email", {
            type: "manual",
            message: response.errors.email[0]
          })
        }
      }else{
        console.log('FAILED')
      }
    } catch(error){
      console.error('Error : ', error)
      console.log("Try again!")
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Card className='bg-black text-white mx-auto w-[400px] max-w-sm'>
          <CardHeader>
            <CardTitle className='text-center text-3xl'>Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid gap-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({field}) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='name'>Nome</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder='João' {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>

                  <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <FormControl>
                          <Input id="email" placeholder='João@gmail.com' {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>

                  <FormField
                    control={form.control}
                    name='password'
                    render={({field}) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor='password'>Senha</FormLabel>
                        <FormControl>
                          <Input type='password' id="password" placeholder='Insira sua senha...' {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>
                  <FormField
                    control={form.control}
                    name='confirm_password'
                    render={({field}) => (
                      <FormItem className='grid gap-2 text-gray'>
                        <FormLabel htmlFor=''>Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input type='password' id="confirm_password" placeholder='Insira sua senha novamente...' {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}/>

                  <Button type='submit' className='w-full bg-white text-black hover:bg-violet-600 hover:text-white hover:cursor-pointer'>
                     Registrar-se 
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

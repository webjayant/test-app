'use client';
import { useEffect, useState } from 'react';
import Users from './users';
import { Flex, Input, Heading, Button, FormControl, FormLabel, FormHelperText, Select, CircularProgress } from '@chakra-ui/react';

export default function Home() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState<any>({})
    useEffect(() => {
        fetch('https://gorest.co.in/public/v2/users', {
            cache: 'no-cache',
        }).then((response) => response.json()).then((data) => {
          setUsers(data)
          setLoading(false)
        });
    }, []);
    const handleSubmit = (e: any) => {
      e.preventDefault();
      const data = new FormData(e.target);
      fetch('https://gorest.co.in/public/v2/users', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(data)),
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer 8063aa951f5fba3b3db4c0744d85802eb0dc218032bc00b238f6b6272754ef8a'
        }
      }).then((response) => {
        if(!response.ok) {
          return response.json().then((data) => {
            throw new Error(JSON.stringify(data))
          })
        }
        return response.json()
      }).then((data) => {
        const updatedUser = [...users, data]
        setUsers(updatedUser)
        setError({})
        e.target.reset()
      }).catch((error) => {
        JSON.parse(error.message).forEach((el: {field: string; message: string}) => {
          setError((prev:any)=>{
            return {
              ...prev,
              [el.field]:{
                hasError:true,
                msg:el.message
              }
            }
          })
        });
      })
    }
    return (
      <Flex direction={{base:'column', lg:'row'}}>
        <Flex direction='column' width={{base:'100%', lg:'50%'}} p={5}>
            <Heading size='md' mb={3}>Users</Heading>
            {loading ?<CircularProgress isIndeterminate /> :
              users?.map(
                (user: {
                    id: number;
                    name: string;
                    email: string;
                    gender: string;
                    status: string;
                }) => (
                    <Users key={user.id} user={user} />
                )
            )}
        </Flex>
        <Flex direction='column' width={{base:'100%', lg:'50%'}} p={5}>
          <form onSubmit={handleSubmit}>
            <Heading size='md' mb={3}>Add User</Heading>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input placeholder='Name' name='name' size='md' errorBorderColor='red' isInvalid={errors?.name?.hasError}/>     
              {errors?.name?.hasError && <FormHelperText color='red'>{errors?.name?.msg}</FormHelperText>}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Email address</FormLabel>
              <Input placeholder='Email' size='md' name='email' errorBorderColor='red' isInvalid={errors?.email?.hasError}/>    
             {errors?.email?.hasError && <FormHelperText color='red'>{errors?.email?.msg}</FormHelperText>}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Gender</FormLabel>
              <Select placeholder='Gender' size='md' name='gender' errorBorderColor='red'>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </Select>   
            </FormControl>
            <Input type='hidden' value='active' name='status'></Input> 
            <Button colorScheme='teal' size='md' type='submit'>
              Add new user 
            </Button>
            </form>
        </Flex>
      </Flex>
    );
}

'use client';
import { useEffect, useState } from 'react';
import { Flex, Box, Text, Input, Heading, Button, FormControl, FormLabel, FormHelperText, Textarea, CircularProgress, Container } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import Post from './post';

export default function Home() {
    const {id} = useParams();
    const [posts, setPosts] = useState<any[]>([]);
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState<any>({})

    const getPosts = () => {
        fetch(`https://gorest.co.in/public/v2/users/${id}/posts`, {
            cache: 'no-cache',
        }).then((response) => response.json()).then((data) => {
            setPosts(data)
            setLoading(false)
        });
    }
    const getUser = () => {
        fetch(`https://gorest.co.in/public/v2/users/${id}`, {
            cache: 'no-cache',
        }).then((response) => response.json()).then((data) => {
            setUser(data)
            setLoading(false)
        });
    }
    useEffect(() => {
        getUser()
        getPosts()
    }, []);
    const handleSubmit = (e: any) => {
      e.preventDefault();
      const data = new FormData(e.target);
      fetch(`https://gorest.co.in/public/v2/users/${id}/posts`, {
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
        const updatedPosts = [data, ...posts]
        setPosts(updatedPosts)
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
    <Container maxW='container.xl'>
      <Flex direction='column'>
        <Flex direction='column' width='100%' p={5}>
            <Box mb={5}>
                <Heading size="xs" textTransform="uppercase">
                    Name: {user.name}
                </Heading>
                <Text pt="1" fontSize="sm" color='black'>
                    Email: {user.email}
                </Text>
                <Text pt="1" fontSize="sm" color='black'>
                    Gender: {user.gender}
                </Text>
            </Box>
        </Flex>
        <Flex direction='column' width='100%' p={5}>
          <form onSubmit={handleSubmit}>
            <Heading size='md' mb={3}>Create New Post</Heading>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input placeholder='Post Title' name='title' size='md' errorBorderColor='red' isInvalid={errors?.title?.hasError}/>     
              {errors?.title?.hasError && <FormHelperText color='red'>{errors?.title?.msg}</FormHelperText>}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Body</FormLabel>
              <Textarea placeholder='Post Body' size='md' name='body' errorBorderColor='red' isInvalid={errors?.body?.hasError}/>    
             {errors?.body?.hasError && <FormHelperText color='red'>{errors?.body?.msg}</FormHelperText>}
            </FormControl>
            <Button colorScheme='teal' size='md' type='submit'>
                Create New Post 
            </Button>
            </form>
        </Flex>
        <Flex direction='column' width='100%' p={5}>
            <Heading size='md' mb={3}>Posts</Heading>
            {loading ?<CircularProgress isIndeterminate /> :
              posts?.map(
                (post: {
                    body: string;
                    id: number;
                    title: string;
                    user_id: number;
                }) => (
                    <Post key={post.id} post={post} />
                )
            )}
        </Flex>
      </Flex>
      </Container>
    );
}

'use client';
import { useEffect, useState } from 'react';
import { Flex, Input, Heading, Button, FormControl, FormLabel, FormHelperText, Textarea, CircularProgress, Container } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import Comment from './comment';

export default function Comments({postId}:{postId: number}) {
    
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState<any>({})
    useEffect(() => {
        fetch(`https://gorest.co.in/public/v2/posts/${postId}/comments`, {
            cache: 'no-cache',
        }).then((response) => response.json()).then((data) => {
          setComments(data)
          setLoading(false)
        });
    }, []);
    const handleSubmit = (e: any) => {
      e.preventDefault();
      const data = new FormData(e.target);
      fetch(`https://gorest.co.in/public/v2/posts/${postId}/comments`, {
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
        const updatedPosts = [data, ...comments]
        setComments(updatedPosts)
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
            <Heading size='md' mb={3}>Comments</Heading>
            {loading ?<CircularProgress isIndeterminate /> :
              comments?.map(
                (comment: {
                    id: number,
                    post_id: number,
                    name: string,
                    email: string,
                    body: string
                }) => (
                    <Comment key={comment.id} comment={comment} />
                )
            )}
        </Flex>
        <Flex direction='column' width='100%' p={5}>
          <form onSubmit={handleSubmit}>
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
              <FormLabel>Comment</FormLabel>
              <Textarea placeholder='Comment Body' size='md' name='body' errorBorderColor='red' isInvalid={errors?.body?.hasError}/>    
             {errors?.body?.hasError && <FormHelperText color='red'>{errors?.body?.msg}</FormHelperText>}
            </FormControl>
            <Button colorScheme='teal' size='md' type='submit'>
                Comment
            </Button>
            </form>
        </Flex>
      </Flex>
      </Container>
    );
}

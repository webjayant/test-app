import { Box, Text } from '@chakra-ui/react';

export default function Comment({comment}:{comment: {
    id: number,
    post_id: number,
    name: string,
    email: string,
    body: string
}}) {
    
    return (
        <Box borderWidth='1px' p={5} borderRadius={5} mb={5}>
            <Text fontWeight='bold'>{comment.body}</Text>
            <Text fontSize='xs' textAlign='right'>{comment.name}</Text>
            <Text fontSize='xs' textAlign='right'>{comment.email}</Text>
        </Box>
    );
}
'use client';
import { Stack, Box, Heading, Text, Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import Comments from './comments';

export default function Post({post}:{post: {
    body: string;
    id: number;
    title: string;
    user_id: number;
}}) {
    
    return (
        <Stack>

  <Accordion allowToggle allowMultiple={false} defaultIndex={[0]}>
  <AccordionItem>
    {({ isExpanded }) => (
      <>
        <h2>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
            <Heading>{post?.title}</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
            <Text mt={5}>{post?.body}</Text>
            {isExpanded && <Comments postId={post.id}/>}
        </AccordionPanel>
      </>
    )}
  </AccordionItem>
</Accordion>
        </Stack>
    );
}

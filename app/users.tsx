'use client';

import { Link } from '@chakra-ui/next-js';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function Users({
    user,
}: {
    user: {
        id: number;
        name: string;
        email: string;
        gender: string;
        status: string;
    };
}) {
    return (
        <Link
            href={`/user/${user.id}`}
            color="blue.400"
            _hover={{ color: 'blue.500' }}
        >
            <Box mb={5} borderWidth="1px" px={5} py={2.5}>
                <Heading size="xs" textTransform="uppercase">
                    {user.name}
                </Heading>
                <Text pt="1" fontSize="sm" color='black'>
                    {user.email}
                </Text>
                <Text pt="1" fontSize="sm" color='black'>
                    {user.gender}
                </Text>
            </Box>
        </Link>
    );
}

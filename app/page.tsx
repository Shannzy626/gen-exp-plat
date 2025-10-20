"use client";

import { Box, Flex, Heading, VStack, Text, Divider } from "@chakra-ui/react";
import { Canvas } from "@/components/Canvas";
import { LibraryColumn } from "@/components/LibraryColumn";

export default function Page() {
  return (
    <Flex h="100vh" overflow="hidden">
      <Box w="280px" borderRightWidth="1px" p={4} overflowY="auto">
        <Heading size="md">Prompt</Heading>
        <Text mt={2} color="gray.600">
          Future: prompt-driven builder. For MVP, use the library at right.
        </Text>
        <Divider my={4} />
        <VStack align="stretch" spacing={2}>
          <Text fontSize="sm" color="gray.500">
            This column will host prompting in later iterations.
          </Text>
        </VStack>
      </Box>

      <Box flex="1" p={0}>
        <Canvas />
      </Box>

      <Box w="320px" borderLeftWidth="1px" p={4} overflowY="auto">
        <LibraryColumn />
      </Box>
    </Flex>
  );
}


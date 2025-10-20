"use client";

import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { SNIPPETS } from "@/lib/snippets";

export function LibraryColumn() {
  const selectedZone = useBuilderStore((s) => s.selectedZone);
  const add = useBuilderStore((s) => s.addComponentToZone);

  return (
    <VStack align="stretch" spacing={3}>
      <Heading size="sm">Component Library</Heading>
      <Text color="gray.600" fontSize="sm">
        Click to add to the selected zone: <strong>{selectedZone}</strong>
      </Text>

      {SNIPPETS.map((item) => (
        <Box key={item.id} borderWidth="1px" borderRadius="md" p={3}>
          <HStack justify="space-between" align="center">
            <Box>
              <Heading size="xs">{item.title}</Heading>
              <Text color="gray.600" fontSize="xs">{item.description}</Text>
            </Box>
            <Button
              size="sm"
              onClick={() => add(selectedZone, item.html)}
            >
              Add
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}


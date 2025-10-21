"use client";

import { Box, Heading, HStack, Text, VStack, Badge } from "@chakra-ui/react";
import { SNIPPETS } from "@/lib/snippets";
import { useDraggable } from "@dnd-kit/core";

function DraggableCard({ id, title, desc, span }: { id: string; title: string; desc: string; span: { w: number; h: number } }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { type: "catalog", catalogId: id, span } });
  
  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      borderWidth="1px"
      borderRadius="md"
      p={3}
      bg={isDragging ? "gray.50" : "white"}
      className={`draggable-item ${isDragging ? "is-dragging" : ""}`}
      userSelect="none"
      style={{ touchAction: "none" }}
    >
      <HStack justify="space-between" align="center">
        <Box>
          <Heading size="xs">{title}</Heading>
          <Text color="gray.600" fontSize="xs">{desc}</Text>
        </Box>
        <Badge colorScheme="purple">{span.w}x{span.h}</Badge>
      </HStack>
    </Box>
  );
}

export function LibraryColumn() {
  return (
    <VStack align="stretch" spacing={3}>
      <Heading size="sm">Component Library</Heading>
      <Text color="gray.600" fontSize="sm">
        Drag a component and drop it onto the canvas grid.
      </Text>

      {SNIPPETS.map((item) => (
        <DraggableCard
          key={item.id}
          id={item.id}
          title={item.title}
          desc={item.description}
          span={item.span}
        />
      ))}
    </VStack>
  );
}


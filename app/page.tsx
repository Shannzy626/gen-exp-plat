"use client";

import { Box, Flex, Heading, VStack, Text, Divider } from "@chakra-ui/react";
import { Canvas } from "@/components/Canvas";
import { LibraryColumn } from "@/components/LibraryColumn";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SNIPPETS } from "@/lib/snippets";
import { useBuilderStore } from "@/store/useBuilderStore";

export default function Page() {
  const canPlace = useBuilderStore((s) => s.canPlace);
  const placeItem = useBuilderStore((s) => s.placeItem);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id as string | undefined;
    const activeId = String(event.active.id);
    const catalog = SNIPPETS.find((s) => s.id === activeId);
    if (!catalog || !overId) return;
    const match = /r(\d+)c(\d+)/.exec(overId);
    if (!match) return;
    let r = parseInt(match[1], 10);
    let c = parseInt(match[2], 10);
    // Auto-clamp to keep the component in bounds by shifting top-left if needed
    const rows = useBuilderStore.getState().grid.rows;
    const cols = useBuilderStore.getState().grid.cols;
    if (r + catalog.span.h > rows) r = Math.max(0, rows - catalog.span.h);
    if (c + catalog.span.w > cols) c = Math.max(0, cols - catalog.span.w);
    if (canPlace(r, c, catalog.span.w, catalog.span.h)) {
      placeItem(catalog, r, c);
    }
  };

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

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <Box flex="1" p={0}>
          <Canvas />
        </Box>

        <Box w="320px" borderLeftWidth="1px" p={4} overflowY="auto">
          <LibraryColumn />
        </Box>
      </DndContext>
    </Flex>
  );
}


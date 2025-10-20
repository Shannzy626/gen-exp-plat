"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Heading, HStack, Input, Text } from "@chakra-ui/react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { buildSrcDocGrid } from "@/lib/buildSrcDoc";
import { useDroppable } from "@dnd-kit/core";
import { SNIPPETS } from "@/lib/snippets";

function DroppableCell({ id, onDropOver }: { id: string; onDropOver: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  useEffect(() => {
    if (isOver) onDropOver(id);
  }, [isOver, id, onDropOver]);
  return (
    <Box
      ref={setNodeRef}
      borderWidth="2px"
      borderColor={isOver ? "green.400" : "gray.300"}
      borderStyle="dashed"
      borderRadius="md"
      w="100%"
      h="100%"
      bg={isOver ? "green.50" : "transparent"}
      pointerEvents="auto"
    />
  );
}

export function Canvas() {
  const grid = useBuilderStore((s) => s.grid);
  const items = useBuilderStore((s) => s.items);
  const setGrid = useBuilderStore((s) => s.setGrid);
  const canPlace = useBuilderStore((s) => s.canPlace);
  const placeItem = useBuilderStore((s) => s.placeItem);

  const [hoverCell, setHoverCell] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const srcDoc = useMemo(() => buildSrcDocGrid(grid, items), [grid, items]);

  // Drag handling moved to app/page.tsx DndContext

  const gridTemplate = {
    display: "grid",
    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
    gap: "0px",
    height: "100%",
    width: "100%",
  } as const;

  const overlayCells = [] as JSX.Element[];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const id = `r${r}c${c}`;
      overlayCells.push(
        <Box key={id} gridColumn={`${c + 1} / span 1`} gridRow={`${r + 1} / span 1`}>
          <DroppableCell id={id} onDropOver={setHoverCell} />
        </Box>
      );
    }
  }

  const [rowsInput, setRowsInput] = useState(grid.rows.toString());
  const [colsInput, setColsInput] = useState(grid.cols.toString());

  useEffect(() => {
    setRowsInput(grid.rows.toString());
    setColsInput(grid.cols.toString());
  }, [grid.rows, grid.cols]);

  const commitSize = () => {
    const r = Math.max(1, Math.min(12, parseInt(rowsInput || "1", 10)));
    const c = Math.max(1, Math.min(12, parseInt(colsInput || "1", 10)));
    setGrid(r, c);
  };

  return (
    <Flex direction="column" h="100%">
      <Box borderBottomWidth="1px" p={3}>
        <Heading size="sm" mb={2}>
          Canvas
        </Heading>
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.600">Grid</Text>
          <Input size="sm" width="64px" value={rowsInput} onChange={(e) => setRowsInput(e.target.value)} onBlur={commitSize} />
          <Text fontSize="sm">x</Text>
          <Input size="sm" width="64px" value={colsInput} onChange={(e) => setColsInput(e.target.value)} onBlur={commitSize} />
        </HStack>
      </Box>

      <Box ref={wrapperRef} position="relative" flex="1" overflow="hidden" bg="gray.50" p={0}>
          <Box position="absolute" inset={0} pointerEvents="none">
            <iframe
              title="preview"
              style={{ width: "100%", height: "100%", border: 0, background: "white" }}
              srcDoc={srcDoc}
              sandbox="allow-same-origin allow-scripts"
            />
          </Box>
          <Box position="absolute" inset={0} pointerEvents="auto" style={gridTemplate}>
            {overlayCells}
          </Box>
      </Box>
    </Flex>
  );
}


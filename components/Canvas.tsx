"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Heading, HStack, Input, Text, IconButton, Tooltip, Icon } from "@chakra-ui/react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { buildSrcDocGrid } from "@/lib/buildSrcDoc";
import { useDroppable, useDraggable } from "@dnd-kit/core";
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

function MoveHandle({ id, r, c, w, h }: { id: string; r: number; c: number; w: number; h: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `item:${id}`,
    data: { type: "item", itemId: id, span: { w, h } },
  });
  
  return (
    <Box position="absolute" top="4px" left="4px" pointerEvents="auto">
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        borderWidth="1px"
        borderColor={isDragging ? "purple.400" : "gray.300"}
        bg="white"
        borderRadius="md"
        boxShadow="sm"
        w="24px"
        h="24px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={`draggable-item ${isDragging ? "is-dragging" : ""}`}
        style={{ touchAction: "none" }}
      >
        <Icon viewBox="0 0 24 24" boxSize="3.5">
          <path fill="currentColor" d="M7 4h2v2H7V4m8 0h2v2h-2V4M7 18h2v2H7v-2m8 0h2v2h-2v-2M4 7h2v2H4V7m14 0h2v2h-2V7M4 15h2v2H4v-2m14 0h2v2h-2v-2"/>
        </Icon>
      </Box>
    </Box>
  );
}

export function Canvas() {
  const grid = useBuilderStore((s) => s.grid);
  const items = useBuilderStore((s) => s.items);
  const setGrid = useBuilderStore((s) => s.setGrid);
  const canPlace = useBuilderStore((s) => s.canPlace);
  const placeItem = useBuilderStore((s) => s.placeItem);
  const moveItem = useBuilderStore((s) => s.moveItem);
  const removeItem = useBuilderStore((s) => s.removeItem);
  const isDragging = useBuilderStore((s) => s.isDragging);
  const dragInfo = useBuilderStore((s) => s.dragInfo);
  const clearDragInfo = useBuilderStore((s) => s.clearDragInfo);

  const [hoverCell, setHoverCell] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Clean up drag state when dragging ends
  useEffect(() => {
    if (!isDragging) {
      setHoverCell(null);
    }
  }, [isDragging]);

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

  // Controls overlay: delete + move-handle per item
  const controlsOverlay = items.map((it) => (
    <Box
      key={`ctrl-${it.id}`}
      gridColumn={`${it.c + 1} / span ${it.w}`}
      gridRow={`${it.r + 1} / span ${it.h}`}
      position="relative"
      pointerEvents="none"
      opacity={0}
      _hover={{ opacity: 1, pointerEvents: "auto" }}
      transition="opacity 0.2s"
    >
      <MoveHandle id={it.id} r={it.r} c={it.c} w={it.w} h={it.h} />
      <Box position="absolute" top="4px" right="4px" pointerEvents="auto">
        <Tooltip label="Remove" openDelay={300}>
          <IconButton
            aria-label="Remove"
            size="xs"
            variant="solid"
            colorScheme="red"
            onClick={(e) => { e.stopPropagation(); removeItem(it.id); }}
            icon={
              <Icon viewBox="0 0 24 24" boxSize="3.5">
                <path fill="currentColor" d="M18.3 5.71L12 12.01l-6.3-6.3-1.4 1.42 6.29 6.29-6.3 6.29 1.42 1.41 6.29-6.29 6.29 6.29 1.41-1.41-6.29-6.29 6.3-6.3-1.42-1.42z"/>
              </Icon>
            }
          />
        </Tooltip>
      </Box>
    </Box>
  ));

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
          {/* Layer 1: Iframe - always interactive */}
          <Box position="absolute" inset={0} zIndex={1}>
            <iframe
              title="preview"
              style={{ width: "100%", height: "100%", border: 0, background: "white" }}
              srcDoc={srcDoc}
              sandbox="allow-same-origin allow-scripts"
            />
          </Box>
          
          {/* Layer 2: Drag drop zones - only when dragging */}
          {isDragging && (
            <Box position="absolute" inset={0} zIndex={2} style={gridTemplate}
              onMouseUp={() => clearDragInfo()} onTouchEnd={() => clearDragInfo()}>
              {overlayCells}
            </Box>
          )}
          
          {/* Layer 3: Control handles - small positioned elements */}
          <Box position="absolute" inset={0} zIndex={3} pointerEvents="none" style={gridTemplate}>
            {controlsOverlay}
          </Box>
      </Box>
    </Flex>
  );
}


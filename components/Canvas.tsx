"use client";

import { useMemo } from "react";
import { Box, Flex, Heading, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useBuilderStore, ZoneId } from "@/store/useBuilderStore";
import { buildSrcDoc } from "@/lib/buildSrcDoc";

export function Canvas() {
  const zones = useBuilderStore((s) => s.zones);
  const selectedZone = useBuilderStore((s) => s.selectedZone);
  const selectZone = useBuilderStore((s) => s.selectZone);

  const srcDoc = useMemo(() => buildSrcDoc(zones), [zones]);

  return (
    <Flex direction="column" h="100%">
      <Box borderBottomWidth="1px" p={3}>
        <Heading size="sm" mb={2}>
          Canvas
        </Heading>
        <RadioGroup
          onChange={(v) => selectZone(v as ZoneId)}
          value={selectedZone}
        >
          <Stack direction="row" spacing={4}>
            <Radio value="header">Header</Radio>
            <Radio value="main">Main</Radio>
            <Radio value="footer">Footer</Radio>
          </Stack>
        </RadioGroup>
      </Box>

      <Box flex="1" overflow="hidden" bg="gray.50">
        <iframe
          title="preview"
          style={{ width: "100%", height: "100%", border: 0, background: "white" }}
          srcDoc={srcDoc}
          sandbox="allow-same-origin allow-scripts"
        />
      </Box>
    </Flex>
  );
}

